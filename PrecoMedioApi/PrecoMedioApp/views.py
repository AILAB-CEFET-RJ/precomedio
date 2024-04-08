from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse

from .models import PriceTracker, Products
from .serializers import ProductsSerializer, PriceTrackerSerializer
from .utils import get_all_price_trackers,fazer_pesquisa, extrair_resultados, obter_modelos_e_precos

@csrf_exempt
def search(request, model:str):  
    if request.method == 'GET':
        soup = fazer_pesquisa(model)
        soup_ads, soup_results = extrair_resultados(soup)
        obter_modelos_e_precos(soup_results, soup_ads, model)
        products = get_all_price_trackers()
        serialized_priceTrackers = PriceTrackerSerializer(products, many=True).data  

        return JsonResponse(serialized_priceTrackers, safe=False, status=200)
    else:
        return JsonResponse({'message': 'Method not allowed'}, status=405)
