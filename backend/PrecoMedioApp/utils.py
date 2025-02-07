import requests
import re
from datetime import datetime
from bs4 import BeautifulSoup
from .db_operations import create_priceTracker, get_or_create_product, save_product_and_price, get_price_trackers_by_title
from .text_processing import obter_preco, similar, get_brand
from .models import Products, PriceTracker


def fazer_pesquisa(pesquisa):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    }
    
    response = requests.get(
        "https://www.google.com/search",
        headers=headers,
        params={
            "q": pesquisa,
            "tbm": "shop"
        }
    )

    return BeautifulSoup(response.text, "html.parser")

def extrair_resultados(soup):
    soup_ads = soup.find_all("a", {"class": "shntl sh-np__click-target"})
    soup_results = soup.find_all("div", {"class": "sh-dgr__gr-auto sh-dgr__grid-result"})
    return soup_ads, soup_results


def obter_modelos_e_precos(soup_results, soup_ads, model):
    palavras_proibidas = ["vitrine", "usado", "recondicionado", "como novo", "zerado", "semi-novo", "seminovo", "semi novo", "renovada", "renovado"]
    list_priceTracker = []

    for result in soup_results:
        title = result.find(re.compile('^h\d$')).get_text()

        if contains_product(title, model):
            if not any(proibida in title.lower() for proibida in palavras_proibidas):
                storage_match = re.search(r'\d+GB', title)
                if storage_match:
                    storage_size = storage_match.group()
                    product = get_or_create_product(title, storage_size, get_brand(title))
                    # product = Products(Model=title,
                    #                    StorageGB=int(storage_size[:-2]),
                    #                    Brand=get_brand(title))
                    price_element = result.find("span", {"class": "a8Pemb OFFNJ"})
                    supplier_span = result.find("div", {"class": "aULzUe IuHnof"})
                    supplier = supplier_span.get_text(strip=True) if supplier_span else None
                    if price_element and not result.find("span", {"class": "tD1ls"}) and not result.find("span", {"class": "hahPbb"}):  
                        price_text = price_element.get_text()
                        price = obter_preco(price_text)
                        if price is not None:
                            if not has_similar_product(title, model):
                                create_priceTracker(title, price, product, model, supplier)
                                unidade_priceTracker = PriceTracker(Model=title,
                                                                    DateOfSearch=datetime.now(),
                                                                    Price = price,
                                                                    SearchString=model,
                                                                    Product=product,
                                                                    Supplier=supplier)

                                list_priceTracker.append(unidade_priceTracker)

    for ad in soup_ads:
        title = ad.find(re.compile('^h\d$')).get_text()

        if contains_product(title, model):
            if not any(proibida in title.lower() for proibida in palavras_proibidas):
                storage_match = re.search(r'\d+GB', title)
                if storage_match:
                    storage_size = storage_match.group()
                    product = get_or_create_product(title, storage_size, get_brand(title))
                    # product = Products(Model=title,
                    #                    StorageGB=int(storage_size[:-2]),
                    #                    Brand=get_brand(title))
                    price_element = ad.find("span", {"class": "T14wmb"})
                    supplier_div = ad.find("div", {"class": "sh-np__seller-container"})
                    supplier = supplier_div.get_text(strip=True) if supplier_div else None
                    if price_element and not ad.find("span", {"class": "tD1ls"}) and not ad.find("span", {"class": "hahPbb"}):
                        price_text = price_element.get_text()
                        price = obter_preco(price_text)
                        if price is not None:
                            if not has_similar_product(title, model):
                                create_priceTracker(title, price, product, model, supplier)
                                unidade_priceTracker = PriceTracker(Model=title,
                                                                    DateOfSearch=datetime.now(),
                                                                    Price = price,
                                                                    SearchString=model,
                                                                    Product=product,
                                                                    Supplier=supplier)
                                
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