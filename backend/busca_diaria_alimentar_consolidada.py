import os
import django

# Configura o Django (ajuste o nome do seu projeto aqui)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'PrecoMedioApi.settings')
django.setup()

from PrecoMedioApp.utils import fazer_pesquisa, extrair_resultados, obter_modelos_e_precos
from PrecoMedioApp.text_processing import detectar_outliers
from PrecoMedioApp.db_operations import get_price_trackers_by_title_and_storage, getConsolidadoFromPriceTracker, create_buscaConsolidada, get_price_trackers_by_title_and_storage, get_product_with_lowest_price, get_average_price
from PrecoMedioApp.serializers import PriceTrackerSerializer
from PrecoMedioApp.models import Alert
from django.core.mail import send_mail
from django.conf import settings

def busca_diaria_alimentar_consolidada():
    search_queries = [
        "iphone13+128gb"
    ]
    
    for search_query in search_queries:
        soup = fazer_pesquisa(search_query)
        products_with_filters = obter_modelos_e_precos(soup, search_query)
        products = get_price_trackers_by_title_and_storage(products_with_filters)
        filtered_products = detectar_outliers(products)
        serialized_priceTrackers = PriceTrackerSerializer(filtered_products, many=True).data  
        # Pegar média e menor valor
        productlowestPrice = get_product_with_lowest_price(serialized_priceTrackers)

        if mean is None or productlowestPrice is None:
            print(f"Dados insuficientes para {search_query}. Mean: {mean}, LowestPrice: {productlowestPrice}")
            continue

        mean = get_average_price(serialized_priceTrackers) 
        searchstring_formatted = search_query.replace("+", " ")
        create_buscaConsolidada(searchstring_formatted, mean, productlowestPrice['lowestPrice'])

        # Enviar alerta por e-mail se necessário
        if productlowestPrice is not None:
            alerts = Alert.objects.filter(SearchString__in=[search_query, searchstring_formatted], target_price__gte=productlowestPrice['lowestPrice'])
            for alert in alerts:
                print(f"Alerta encontrado: {alert}")
                print(f"Enviando e-mail para o usuário: {alert.user.email}")
                user = alert.user
                if user.email:
                    send_mail(
                        subject="Alerta de preço atingido!",
                        message=f"O produto '{search_query}' atingiu o preço desejado: R$ {productlowestPrice['lowestPrice']} (sua meta: R$ {alert.target_price})",
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[user.email],
                        fail_silently=False,
                    )

if __name__ == "__main__":
    busca_diaria_alimentar_consolidada()
