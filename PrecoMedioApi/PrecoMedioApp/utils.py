import requests
import re
from bs4 import BeautifulSoup
from .db_operations import create_PriceTracker, create_Product, save_product_and_price
from .text_processing import obter_preco


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
    palavras_proibidas = ["vitrine", "usado", "recondicionado", "Sou como novo"]

    for result in soup_results:
        title = result.find(re.compile('^h\d$')).get_text()
        if not any(proibida in title.lower() for proibida in palavras_proibidas):
            storage_match = re.search(r'\d+GB', title)
            if storage_match:
                storage_size = storage_match.group()
                product = create_Product(title, storage_size, "Apple")
                price_element = result.find("span", {"class": "a8Pemb OFFNJ"})
                supplier_span = result.find("div", {"class": "aULzUe IuHnof"})
                supplier = supplier_span.get_text(strip=True) if supplier_span else None
                if price_element and not result.find("span", {"class": "tD1ls"}):  
                    price_text = price_element.get_text()
                    price = obter_preco(price_text)
                    if price is not None:
                        create_PriceTracker(title, price, product, model, supplier)

    for ad in soup_ads:
        title = ad.find(re.compile('^h\d$')).get_text()
        if not any(proibida in title.lower() for proibida in palavras_proibidas):
            storage_match = re.search(r'\d+GB', title)
            if storage_match:
                storage_size = storage_match.group()
                product = create_Product(title, storage_size, "Apple")
                price_element = ad.find("span", {"class": "T14wmb"})
                supplier_div = ad.find("div", {"class": "sh-np__seller-container"})
                supplier = supplier_div.get_text(strip=True) if supplier_div else None
                if price_element and not ad.find("span", {"class": "tD1ls"}):
                    price_text = price_element.get_text()
                    price = obter_preco(price_text)
                    if price is not None:
                        create_PriceTracker(title, price, product, model, supplier)


def search_product(soup_results, soup_ads):
    product_list = obter_modelos_e_precos(soup_results,soup_ads)
    save_product_and_price(products_list=product_list)
    