import requests
import re
from datetime import datetime
from bs4 import BeautifulSoup
from .db_operations import create_priceTracker, get_or_create_product, save_product_and_price, get_price_trackers_by_title
from .text_processing import obter_preco, similar, get_brand
from .models import Products, PriceTracker
from serpapi import GoogleSearch
from django.conf import settings


def fazer_pesquisa(pesquisa):
    params = {
        "api_key": settings.SERPAPI_KEY,
        "engine": "google",
        "q": pesquisa,
        "location": "Brazil",
        "google_domain": "google.com",
        "gl": "br",
        "hl": "pt-br",
        "tbm": "shop"
    }

    search = GoogleSearch(params)
    results = search.get_dict()
    shopping_results = results.get("shopping_results", [])
    
    return shopping_results
    
def obter_modelos_e_precos(results, search_string):
    list_priceTracker = []
    
    for result in results:
        product_title = result.get("title")
        product_price = result.get("extracted_price")
        seller_name = result.get("source")

        excluded_keywords = ["vitrine", "usado", "recondicionado", "como novo", "zerado", "semi-novo", "seminovo", "semi novo", "renovada", "renovado", "vitirne"]

        if any(keyword in product_title.lower() for keyword in excluded_keywords):
            continue
        
        storage_match = re.search(r'\d+GB', search_string, re.IGNORECASE)
        price_match = re.search(r'[\d\.]+(?:,\d{2})?', str(product_price))
    
        if storage_match and price_match and not has_similar_product(product_title, search_string):
            storage_size = storage_match.group()
            
            product_price = float(price_match.group())
            
            product = get_or_create_product(search_string, storage_size, get_brand(search_string))
            create_priceTracker(product_title, product_price, product, search_string, seller_name)
            unidade_priceTracker = PriceTracker(Model=product_title,
                                            DateOfSearch=datetime.now(),
                                            Price = product_price,
                                            SearchString=search_string,
                                            Product=product,
                                            Supplier=seller_name)
            list_priceTracker.append(unidade_priceTracker)
        
    return list_priceTracker

def has_similar_product(title, model):
    similar_products = get_price_trackers_by_title(model)
    for product in similar_products:
        if similar(title, product.Model) > 1: 
            return True
    return False

def contains_product(title, model):
    title = title.lower()
    model = model.lower()
    
    title = re.sub(r'(\d+)([a-zA-Z]+)', r'\1 \2', title)
    tokens = re.findall(r'[a-zA-Z]+|\d+', model)
    
    termos_pesquisa = []
    i = 0
    while i < len(tokens):
        if i < len(tokens) - 1 and tokens[i].isalpha() and tokens[i + 1].isdigit():
            termos_pesquisa.append(f"{tokens[i]} {tokens[i + 1]}")
            i += 2  
        else:
            termos_pesquisa.append(tokens[i])
            i += 1
    
    return all(termo in title for termo in termos_pesquisa)