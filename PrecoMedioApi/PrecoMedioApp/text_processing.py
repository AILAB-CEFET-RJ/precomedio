import statistics
import numpy as np
import re
from difflib import SequenceMatcher
from decimal import Decimal, InvalidOperation


def obter_preco(price_text):
    numeric_price_str = re.sub(r'[^\d,]', '', price_text)
    numeric_price_str = numeric_price_str.replace(',', '.')

    try:
        decimal_price = Decimal(numeric_price_str)
    except InvalidOperation:
        decimal_price = None

    return decimal_price

#Usar esse metodo no endpoint preco medio
def detectar_outliers(products):
    prices = []

    for product in products:
        price = float(product.Price)
        prices.append(price)

    average = round(statistics.mean(prices), 2)
    standard_deviation = statistics.stdev(prices)
    
    upper_limit = average + standard_deviation
    under_limit = average - standard_deviation
        
    prices_without_outliers = [preco for preco in prices if under_limit <= preco <= upper_limit]
    
    average_without_outliers = round(statistics.mean(prices_without_outliers), 2)
    
    return average_without_outliers


def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()  


def get_brand(model):
    for marca in marcas_smartphone:
        if marca.lower() in model.lower():
            return marca
    return 'Apple'  

marcas_smartphone = [
    "Apple", "Samsung", "Huawei", "Xiaomi", "OnePlus", "Google", "Sony", "LG",
    "Motorola", "Nokia", "HTC", "BlackBerry", "Lenovo", "ASUS", "Oppo", "Vivo",
    "Realme", "ZTE", "Alcatel", "Meizu", "TCL", "Honor", "Infinix", "Micromax",
    "Poco", "Redmi", "Sharp", "Panasonic", "Tecno", "Coolpad", "Gionee", "LeEco",
    "Razer", "Wiko", "Yota", "ZUK", "Essential", "Fairphone", "Fujitsu", "HP",
    "Kyocera", "Land Rover", "Microsoft", "Nubia", "Roku", "Saygus", "Vertu",
    "YU", "Zopo", "iQOO"
]