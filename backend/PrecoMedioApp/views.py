from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from .text_processing import detectar_outliers
from .db_operations import get_all_price_trackers, get_average_price, get_price_trackers_by_title_and_storage, get_product_with_lowest_price, get_price_trackers_by_title
from .utils import extrair_resultados, fazer_pesquisa, obter_modelos_e_precos
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated

from .serializers import PriceTrackerSerializer, UserSerializer

from .models import Products, PriceTracker
from django.http import HttpResponse

def executar_funcao(request):
    reset_and_query()
    return HttpResponse("Função executada com sucesso!")

@api_view(['GET'])
def buscaDiaria_alimentarConsolidada(request):
    # Passo 1: Apagar os dados nas tabelas Products e PriceTracker
    #Products.objects.all().delete()
    #PriceTracker.objects.all().delete()
    # Passo 2: Realizar as consultas.
    #search('iphone12', '256g')
    #return HttpResponse("Função executada com sucesso!")
    if request.method == 'GET':
        #search_query = f"{model} {storage}"
        search_query = f"iphone12 128g"
        soup = fazer_pesquisa(search_query)
        soup_ads, soup_results = extrair_resultados(soup)
        products_with_filters = obter_modelos_e_precos(soup_results, soup_ads, search_query)
        products = get_price_trackers_by_title_and_storage(products_with_filters)
        filtered_products = detectar_outliers(products)
        serialized_priceTrackers = PriceTrackerSerializer(filtered_products, many=True).data  
        # Pegar média e menor valor
        productlowestPrice = get_product_with_lowest_price(serialized_priceTrackers)
        mean = get_average_price(serialized_priceTrackers)

        """sql_query = 
        INSERT INTO Busca_consolidado (Consolidadoid, SearchString, AveragePrice, MinPrice, )
        SELECT
        ROW_NUMBER() OVER () AS Consolidadoid,  -- Gera um ID único para cada grupo de resultados
        SearchString,                          -- Agrupa pelo campo SearchString
        AVG(Price) AS AveragePrice,            -- Calcula a média do campo Price
        MIN(Price) AS MinPrice,                -- Calcula o valor mínimo do campo Price
        CURDATE() - INTERVAL 1 DAY as DateOfSearch                 -- Conta quantos registros estão sendo agrupados
        FROM
        PriceTracker
        WHERE
        Date = CURDATE() - INTERVAL 1 DAY      -- Filtra pela data do dia anterior (1 dia atrás)
        GROUP BY
        SearchString

        
        
        with connection.cursor() as cursor:
            cursor.execute(sql_query)  # Executa a consulta SQL

        print("Dados inseridos com sucesso!")
"""
        return JsonResponse(serialized_priceTrackers, safe=False, status=200)
    else:
        return JsonResponse({'message': 'Method not allowed'}, status=405)

@csrf_exempt
@api_view(['GET'])
#@authentication_classes([SessionAuthentication,TokenAuthentication])
#@permission_classes([IsAuthenticated])
def search(request, model:str, storage: str):  
    if request.method == 'GET':
        search_query = f"{model} {storage}"
        soup = fazer_pesquisa(search_query)
        soup_ads, soup_results = extrair_resultados(soup)
        products_with_filters = obter_modelos_e_precos(soup_results, soup_ads, search_query)
        products = get_price_trackers_by_title_and_storage(products_with_filters)
        filtered_products = detectar_outliers(products)
        serialized_priceTrackers = PriceTrackerSerializer(filtered_products, many=True).data  
        # Pegar média e menor valor
        productlowestPrice = get_product_with_lowest_price(serialized_priceTrackers)
        mean = get_average_price(serialized_priceTrackers)
        
        return JsonResponse({'lowestPrice': productlowestPrice['lowestPrice'], "mean": mean, "products": serialized_priceTrackers}, safe=False, status=200)
    else:
        return JsonResponse({'message': 'Method not allowed'}, status=405)
    
@api_view(['POST'])
def login(request):
    user = get_object_or_404(User, username=request.data['username'])
    if not user.check_password(request.data['password']):
        return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)
    token, created = Token.objects.get_or_create(user=user)
    return Response({"token": token.key})
    
    
@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(username=request.data['username'])
        user.set_password(request.data['password'])
        user.save()
        token = Token.objects.create(user= user)
        return Response({"token": token.key})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
@api_view(['GET'])
@authentication_classes([SessionAuthentication,TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response({})
