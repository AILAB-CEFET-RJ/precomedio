import os
import django
import random
from datetime import datetime, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'PrecoMedioApi.settings')
django.setup()

from PrecoMedioApp.models import Busca_consolidado

def inserir_dados_ficticios_busca_consolidado():
    search_string = "iphone13 128gb"
    hoje = datetime.now()
    
    for i in range(30):
        dia = hoje - timedelta(days=i)
        avg_price = round(random.uniform(2500, 3500), 2)
        min_price = round(random.uniform(2000, avg_price - 1), 2) 

        busca = Busca_consolidado( 
            SearchString=search_string,
            AvgPrice=avg_price,
            MinPrice=min_price,
            DateOfSearch=dia.replace(hour=12, minute=0, second=0) 
        )
        busca.save()
        print(f"Linha inserida para o dia {dia.date()} | AvgPrice: {avg_price} | MinPrice: {min_price}")

if __name__ == "__main__":
    inserir_dados_ficticios_busca_consolidado()
