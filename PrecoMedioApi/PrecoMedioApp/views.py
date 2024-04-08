from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse

from .db_operations import get_all_price_trackers, get_price_trackers_by_title_and_storage
from .utils import extrair_resultados, fazer_pesquisa, obter_modelos_e_precos

from .serializers import PriceTrackerSerializer


@csrf_exempt
def search(request, model:str, storage: str):  
    if request.method == 'GET':
        search_query = f"{model} {storage}"
        soup = fazer_pesquisa(search_query)
        soup_ads, soup_results = extrair_resultados(soup)
        obter_modelos_e_precos(soup_results, soup_ads, search_query)
        products = get_price_trackers_by_title_and_storage(model,storage)
        serialized_priceTrackers = PriceTrackerSerializer(products, many=True).data  

        return JsonResponse(serialized_priceTrackers, safe=False, status=200)
    else:
        return JsonResponse({'message': 'Method not allowed'}, status=405)
    