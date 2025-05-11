import requests
import re
from datetime import datetime
from bs4 import BeautifulSoup
from .db_operations import create_priceTracker, get_or_create_product, save_product_and_price, get_price_trackers_by_title
from .text_processing import obter_preco, similar, get_brand
from .models import Products, PriceTracker


def fazer_pesquisa(pesquisa):
    response = requests.get(f"https://www.google.com/search?q=${pesquisa}&sca_esv=e05ade750ba4d55d&udm=28&biw=1793&bih=1014&sxsrf=AHTn8zqkqOZZ2notYbNy1pj0O679mZ81sg%3A1746913849911&ei=OcofaICuN_ab5OUPz4qG-QM&oq=iphone+12+256gb&gs_lp=Ehlnd3Mtd2l6LW1vZGVsZXNzLXNob3BwaW5nIg9pcGhvbmUgMTIgMjU2Z2IqAggAMgQQABhHMgQQABhHMgQQABhHMgQQABhHMgQQABhHMgQQABhHMgQQABhHMgQQABhHSKEWUDJYMnABeAKQAQCYAQCgAQCqAQC4AQHIAQD4AQGYAgKgAg3CAgoQABiwAxjWBBhHmAMA4gMFEgExIECIBgGQBgiSBwEyoAcAsgcAuAcA&sclient=gws-wiz-modeless-shopping")
    parsed_page = BeautifulSoup(response.text, 'html.parser')

    return parsed_page

def extrair_resultados(soup):
    soup_ads = soup.find_all("a", {"class": "shntl sh-np__click-target"})
    soup_results = soup.find_all("div", {"class": "sh-dgr__gr-auto sh-dgr__grid-result"})
    return soup_ads, soup_results

def obter_modelos_e_precos(soup, search_string):
    product_containers = soup.find_all('div', class_='P8xhZc')
    list_priceTracker = []
    
    for product_container in product_containers:
        price_store_divs = product_container.find_all('div', class_='dD8iuc')
        
        price_store_div = price_store_divs[1] if len(price_store_divs) > 1 else price_store_divs[0] if price_store_divs else None
        
        if not price_store_div:
            continue
            
        price_store_text = price_store_div.text.split(" de ", 1)
        product_price = price_store_text[0].strip()
        seller_name = price_store_text[1].strip() if len(price_store_text) > 1 else ""
        product_title = product_container.find('a').text
        
        excluded_keywords = ["vitrine", "usado", "recondicionado", "como novo", "zerado", "semi-novo", "seminovo", "semi novo", "renovada", "renovado", "vitirne"]

        if any(keyword in product_title.lower() for keyword in excluded_keywords) or "usado" in product_price.lower():
            continue
        
        storage_match = re.search(r'\d+GB', search_string, re.IGNORECASE)
        price_match = re.search(r'[\d\.]+(?:,\d{2})?', product_price)
    
        if storage_match and price_match and not has_similar_product(product_title, search_string):
            storage_size = storage_match.group()
            product_price = price_match.group().replace('.', '').replace(',', '.')
            
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