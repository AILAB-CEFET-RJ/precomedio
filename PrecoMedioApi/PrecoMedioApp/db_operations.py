import re
from .models import Products, PriceTracker
from datetime import datetime
from django.db.models import Min
from .text_processing import get_brand


def save_product_and_price(products_list, searchString):
    for storage_size, data in products_list.items():
        for i in range(len(data["modelos"])):
            modelo = data["modelos"][i]
            preco = data["precos"][i]
            vendedor = data["vendedores"][i]

            product = get_or_create_Product(modelo,storage_size,get_brand(modelo))
            price_tracker = create_PriceTracker(modelo,preco,product,searchString,vendedor)


def get_all_price_trackers():
    return PriceTracker.objects.all()


def get_or_create_product(title, storage, brand):
    product, _ = Products.objects.get_or_create(
        Model=title,
        StorageGB=int(storage[:-2]),  
        Brand=brand
    )
    return product

def create_priceTracker(title, price, product,model, supplier):
    PriceTracker.objects.create(
        Model=title,
        DateOfSearch=datetime.now(),  
        Price=price,
        SearchString=model,  
        Product=product,
        Supplier = supplier
    )

def get_price_trackers_by_title(title):
    return PriceTracker.objects.filter(Model__icontains=title)


def get_price_trackers_by_title_and_storage(title, storage):
    if storage:
        storage_number = None
        storage_numbers = re.findall(r'\d+', storage)
        if storage_numbers:
            storage_number = int(storage_numbers[0])
        
        title = re.sub(r'(\d+)', r' \1', title).strip()

        if storage_number is not None:
            return PriceTracker.objects.filter(Model__icontains=title, Product__StorageGB=storage_number)
    else:
        title = re.sub(r'(\d+)', r' \1', title).strip()
        return PriceTracker.objects.filter(Model__icontains=title)
    

def get_product_with_lowest_price(title_contains, storage):

    if storage is not None:
        products = PriceTracker.objects.filter(Model__icontains=title_contains, StorageGB=storage)
    else:
        products = PriceTracker.objects.filter(Model__icontains=title_contains)
    
    if not products.exists():
        return None
    
    products_with_min_price = products.annotate(min_price=Min('pricetracker__Price'))
    
    product_with_lowest_price = products_with_min_price.order_by('min_price').first()
    
    return product_with_lowest_price