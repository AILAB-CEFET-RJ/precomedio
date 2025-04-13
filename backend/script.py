import os
import django
import random
from datetime import datetime, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'PrecoMedioApi.settings')
django.setup()

from PrecoMedioApp.db_operations import get_or_create_product
from PrecoMedioApp.text_processing import get_brand
from PrecoMedioApp.models import PriceTracker

def inserir_dados_ficticios_tabela_pricetracker():
    quantidade = 50

    for x in range(quantidade):
        nome = "iPhone 12 Pro Max 256GB Azul"
        preco = random.randint(3500, 4000)
        nome_procurado = "iphone12 256gb"
        fornecedor = "Mercado Livre"
        tamanho_armazenamento = "256GB"
        
        product = get_or_create_product(nome, tamanho_armazenamento, get_brand(nome))

        PriceTracker.objects.create(
            Model=nome,
            DateOfSearch=(datetime.now() - timedelta(days=x)).date(),  
            Price=preco,
            SearchString=nome_procurado,  
            Product=get_or_create_product(nome, tamanho_armazenamento, get_brand(nome)),
            Supplier=fornecedor
        )

        print("Dados inseridos com sucesso na tabela PriceTracker")

def checar_dados_ficticios_tabela_pricetracker():
    produtos = PriceTracker.objects.all()
    print("Dados na tabela PriceTracker:")
    for produto in produtos:
        print(produto.Model, produto.DateOfSearch, produto.Price, produto.SearchString, produto.Product.Model, produto.Supplier)

if __name__ == "__main__":
    checar_dados_ficticios_tabela_pricetracker()