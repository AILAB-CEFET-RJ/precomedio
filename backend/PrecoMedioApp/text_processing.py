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

def detectar_outliers(products):
    prices = [float(product.Price) for product in products]
    average = statistics.mean(prices) 
    standard_deviation = statistics.stdev(prices) 

    upper_limit = average + standard_deviation
    lower_limit = average - standard_deviation

    products_without_outliers = [
        product for product in products 
        if lower_limit <= float(product.Price) <= upper_limit
    ]
    
    return products_without_outliers  


def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()  


def get_brand(model):
    model_lower = model.lower()
    matched_brands = [brand for brand in smartphone_brands if brand.lower() in model_lower]
    if matched_brands:
        return matched_brands[0]
    return 'Unknown Brand'

smartphone_brands = [
    "Apple", "Samsung", "Huawei", "Xiaomi", "OnePlus", "Google", "Sony", "LG",
    "Motorola", "Nokia", "HTC", "BlackBerry", "Lenovo", "ASUS", "Oppo", "Vivo",
    "Realme", "ZTE", "Alcatel", "Meizu", "TCL", "Honor", "Infinix", "Micromax",
    "Poco", "Redmi", "Sharp", "Panasonic", "Tecno", "Coolpad", "Gionee", "LeEco",
    "Razer", "Wiko", "Yota", "ZUK", "Essential", "Fairphone", "Fujitsu", "HP",
    "Kyocera", "Land Rover", "Microsoft", "Nubia", "Roku", "Saygus", "Vertu",
    "YU", "Zopo", "iQOO"
]