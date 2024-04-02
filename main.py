import requests
from bs4 import BeautifulSoup
import re
import statistics
import numpy as np

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

def parse_valor_monetario(valor):
    valor = valor.replace("R$", "").strip()
    digitos = re.sub(r'[^\d,]', '', valor)
    
    try:
        return float(digitos.replace(",", "."))
    except ValueError:
        return None

def extrair_resultados(soup):
    soup_ads = soup.find_all("a", {"class": "shntl sh-np__click-target"})
    soup_results = soup.find_all("div", {"class": "sh-dgr__gr-auto sh-dgr__grid-result"})
    return soup_ads, soup_results

def obter_modelos_e_precos(soup_results, soup_ads):
    storage_sizes = {}
    palavras_proibidas = ["vitrine", "usado", "recondicionado"]

    for result in soup_results:
        title = result.find(re.compile('^h\d$')).get_text()
        if not any(proibida in title.lower() for proibida in palavras_proibidas):
            storage_match = re.search(r'\d+GB', title)
            if storage_match:
                storage_size = storage_match.group()
                if storage_size not in storage_sizes:
                    storage_sizes[storage_size] = {"modelos": [], "precos": []}
                storage_sizes[storage_size]["modelos"].append(title)

                price_element = result.find("span", {"class": "a8Pemb OFFNJ"})
                if price_element:
                    price_text = price_element.get_text().split("\xa0")[0]
                    price = parse_valor_monetario(price_text)
                    if price is not None:
                        storage_sizes[storage_size]["precos"].append(price)

    for ad in soup_ads:
        title = ad.find(re.compile('^h\d$')).get_text()
        if not any(proibida in title.lower() for proibida in palavras_proibidas):
            storage_match = re.search(r'\d+GB', title)
            if storage_match:
                storage_size = storage_match.group()
                if storage_size not in storage_sizes:
                    storage_sizes[storage_size] = {"modelos": [], "precos": []}
                storage_sizes[storage_size]["modelos"].append(title)

                price_element = ad.find("span", {"class": "T14wmb"})
                if price_element:
                    price_text = price_element.get_text().strip()
                    price = parse_valor_monetario(price_text)
                    if price is not None:
                        storage_sizes[storage_size]["precos"].append(price)

    return storage_sizes

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

def escrever_resultados(storage_sizes):
    for storage_size, data in storage_sizes.items():
        with open(f"{storage_size}_modelos.txt", "w") as file:
             for modelo, preco in zip(data["modelos"], data["precos"]):
                file.write(f"Modelo: {modelo}\n")
                file.write(f"Preço: R$ {preco:.2f}\n")
                file.write("\n")

        if data["precos"]:
            preco_medio = detectar_outliers(data["precos"])
        else:
            preco_medio = 0

        with open(f"{storage_size}_preco_medio.txt", "w") as file:
            file.write(f"Preço médio para {storage_size}: {preco_medio:.2f}\n")

def main():
    pesquisa = input("Faça sua pesquisa aqui: \n")
    soup = fazer_pesquisa(pesquisa)
    soup_ads, soup_results = extrair_resultados(soup)
    storage_sizes = obter_modelos_e_precos(soup_results, soup_ads)
    escrever_resultados(storage_sizes)

if __name__ == "__main__":
    main()
