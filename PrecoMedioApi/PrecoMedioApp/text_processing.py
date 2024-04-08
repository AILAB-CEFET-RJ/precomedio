import statistics
import numpy as np
import re
from decimal import Decimal, InvalidOperation


def obter_preco(price_text):
    numeric_price_str = re.sub(r'[^\d,]', '', price_text)
    numeric_price_str = numeric_price_str.replace(',', '.')

    try:
        decimal_price = Decimal(numeric_price_str)
    except InvalidOperation:
        print("Erro de conversão para Decimal:", numeric_price_str)
        decimal_price = None

    return decimal_price

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
