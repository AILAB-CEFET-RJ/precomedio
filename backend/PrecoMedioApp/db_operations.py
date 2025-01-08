import re
from .models import Products, PriceTracker
from django.utils import timezone

from .text_processing import get_brand
import statistics

def save_product_and_price(products_list, searchString):
    for storage_size, data in products_list.items():
        for i in range(len(data["modelos"])):
            modelo = data["modelos"][i]
            preco = data["precos"][i]
            vendedor = data["vendedores"][i]

            product = get_or_create_product(modelo,storage_size,get_brand(modelo))
            price_tracker = create_priceTracker(modelo,preco,product,searchString,vendedor)

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
        DateOfSearch= timezone.now(),  
        Price=price,
        SearchString=model,  
        Product=product,
        Supplier = supplier
    )

def get_price_trackers_by_title(model, storage=None):
  if storage:
    search_string = f"{model} {storage}"
    products = PriceTracker.objects.filter(SearchString__icontains=search_string)
  else:
    products = PriceTracker.objects.filter(SearchString__icontains=model)
  return products

def get_price_trackers_by_title_and_storage(title, storage):
    today = timezone.now().date() 
    if storage:
        storage_number = None
        storage_numbers = re.findall(r'\d+', storage)
        if storage_numbers:
            storage_number = int(storage_numbers[0])
        
        title = re.sub(r'(\d+)', r' \1', title).strip()

        if storage_number is not None:
            today = timezone.now().date() 
            products = PriceTracker.objects.filter(Model__icontains=title,
                                               Product__StorageGB=storage_number,
                                               DateOfSearch__date=today
                                               )
    else:
        title = re.sub(r'(\d+)', r' \1', title).strip()
        products = PriceTracker.objects.filter(
            Model__icontains=title,
            DateOfSearch__date = today
        )
    
    unique_products = {}
    for product in products:
        
        key = (product.Model, product.Price)  
        if key not in unique_products:
            unique_products[key] = product  
    return list(unique_products.values())  # retorna uma lista de produtos unicos, tentei distinct mas nao é suportado
    
def get_product_with_lowest_price(products):
    if not products:
        return {'lowestPrice': None, 'productName': None}  # Retorna None se não houver produtos válidos
    
    product_with_lowest_price = min(products, key=lambda p: float(p['Price']))
    print(product_with_lowest_price['Price'])
    return {
        'lowestPrice': product_with_lowest_price['Price'],
        'productName': product_with_lowest_price['SearchString']
    }
    
def get_average_price(products):

    if not products:
        return None

    prices_without_outliers = [float(product['Price']) for product in products]
    average_price = round(sum(prices_without_outliers) / len(prices_without_outliers), 2)
    print(average_price)
    return average_price