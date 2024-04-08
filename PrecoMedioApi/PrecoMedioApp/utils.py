import requests
from bs4 import BeautifulSoup
import re
import statistics
import numpy as np
from datetime import datetime
from .models import Products, PriceTracker
from decimal import Decimal, InvalidOperation

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
    products_list = {}
    palavras_proibidas = ["vitrine", "usado", "recondicionado", "Sou como novo"]

    for result in soup_results:
        title = result.find(re.compile('^h\d$')).get_text()
        if not any(proibida in title.lower() for proibida in palavras_proibidas):
            storage_match = re.search(r'\d+GB', title)
            if storage_match:
                storage_size = storage_match.group()
                product = create_Product(title, storage_size, "Apple")
                price_element = result.find("span", {"class": "a8Pemb OFFNJ"})
                if price_element:
                    price_text = price_element.get_text()
                    price = obter_preco(price_text)
                    if price is not None:
                        create_PriceTracker(title,price,product,model)

    for ad in soup_ads:
        title = ad.find(re.compile('^h\d$')).get_text()
        if not any(proibida in title.lower() for proibida in palavras_proibidas):
            storage_match = re.search(r'\d+GB', title)
            if storage_match:
                storage_size = storage_match.group()
                product =  create_Product(title, storage_size, "Apple")
                price_element = ad.find("span", {"class": "T14wmb"})
                if price_element:
                    price_text = price_element.get_text()
                    price = obter_preco(price_text)
                    if price is not None:
                        create_PriceTracker(title, price,product,model)

    return products_list

def obter_preco(price_text):
    numeric_price_str = re.sub(r'[^\d,]', '', price_text)
    numeric_price_str = numeric_price_str.replace(',', '.')

    try:
        decimal_price = Decimal(numeric_price_str)
    except InvalidOperation:
        print("Erro de conversão para Decimal:", numeric_price_str)
        decimal_price = None

    return decimal_price

def create_Product(title, storage, brand):
    product, _ = Products.objects.get_or_create(
        Model=title,
        StorageGB=int(storage[:-2]),  
        Brand=brand
    )
    return product

def create_PriceTracker(title, price, product,model):
    PriceTracker.objects.create(
        Model=title,
        DateOfSearch=datetime.now(),  
        Price=price,
        SearchString=model,  
        Product=product
    )

    

def detectar_outliers(precos):
    media = statistics.mean(precos)
    desvio_padrao = statistics.stdev(precos)
    
    limite = 2
    
    limite_superior = media + limite * desvio_padrao
    limite_inferior = media - limite * desvio_padrao
    
    outliers = [preco for preco in precos if preco > limite_superior or preco < limite_inferior]
    
    precos_sem_outliers = [preco for preco in precos if preco not in outliers]
    
    media_sem_outliers = statistics.mean(precos_sem_outliers)
    
    return media_sem_outliers



def save_product_and_price(products_list, searchString):
    for storage_size, data in products_list.items():
        for i in range(len(data["modelos"])):
            modelo = data["modelos"][i]
            preco = data["precos"][i]
            vendedor = data["vendedores"][i]
            
            
            product, created = Products.objects.get_or_create(
                Model=modelo,
                StorageGB=storage_size,
                defaults={
                    'Brand': '',  # Preencher com a marca, se disponível
                }
            )

            # Criar e salvar o objeto PriceTracker
            price_tracker = PriceTracker.objects.create(
                Model=modelo,
                DateOfSearch=datetime.now(),
                Price=preco,
                SearchString= searchString,  
                Product=product,
                Supplier=vendedor
            )


def search_product(soup_results, soup_ads):
    product_list = obter_modelos_e_precos(soup_results,soup_ads)
    save_product_and_price(products_list=product_list)
    

def get_all_price_trackers():
    return PriceTracker.objects.all()
