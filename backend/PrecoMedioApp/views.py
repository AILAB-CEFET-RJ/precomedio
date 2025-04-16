from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.db import connection
from .text_processing import detectar_outliers
from .db_operations import create_buscaConsolidada, get_average_price, get_price_trackers_by_title_and_storage, get_product_with_lowest_price, get_price_trackers_by_title, getConsolidadoFromPriceTracker
from .utils import extrair_resultados, fazer_pesquisa, obter_modelos_e_precos
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from datetime import datetime, timedelta
from django.db.models import Min
from .serializers import PriceTrackerSerializer, UserSerializer, FavoriteSerializer

from .models import Products, PriceTracker, Busca_consolidado, Favorites
from django.http import HttpResponse

@api_view(['GET'])
def list_min_price_per_product(request):
    queryset = PriceTracker.objects.values('SearchString') \
                                   .annotate(MinPrice=Min('Price')) \
                                   .order_by('SearchString')

    result = list(queryset)

    if not result:
        return Response(
            {"detail": "Nenhum preço encontrado."},
            status=status.HTTP_404_NOT_FOUND
        )

    return Response(result, status=status.HTTP_200_OK)

@api_view(['GET'])
def buscaDiaria_alimentarConsolidada(request):

    if request.method == 'GET':
        search_queries = ["iphone12 128gb", "iphone12 256gb", "iphone13 128gb", "iphone13 256gb", "iphone14 128gb", "iphone14 256gb"]
        for search_query in search_queries:
            soup = fazer_pesquisa(search_query)
            soup_ads, soup_results = extrair_resultados(soup)
            products_with_filters = obter_modelos_e_precos(soup_results, soup_ads, search_query)
            products = get_price_trackers_by_title_and_storage(products_with_filters)
            filtered_products = detectar_outliers(products)
            serialized_priceTrackers = PriceTrackerSerializer(filtered_products, many=True).data  

            avg, lowestPrice = getConsolidadoFromPriceTracker(search_query)
            create_buscaConsolidada(search_query, avg, lowestPrice)
        

        return HttpResponse("Funcao executada com sucesso!")


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
    try:
        user = get_object_or_404(User, username=request.data['user'])
        if not user.check_password(request.data['password']):
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            "token": token.key,
            "userId": user.id
        })
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
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

@api_view(['POST'])
# @authentication_classes([TokenAuthentication])
# @permission_classes([IsAuthenticated])
def save_favorites(request):
    try:
        priceTrackers = request.data.get('products', [])
        userId = request.data.get('userId')
        user = User.objects.get(id=userId)
        saved_products = []

        # Dicionário para controlar duplicatas
        unique_trackers = {}

        for price_tracker_data in priceTrackers:
            # Usar filter com todos os campos disponíveis
            price_trackers = PriceTracker.objects.filter(
                Model__iexact=price_tracker_data['Model'],
                Price=price_tracker_data['Price'],
                SearchString=price_tracker_data['SearchString'],
                Supplier=price_tracker_data['Supplier']
            )

            if price_trackers.exists():
                price_tracker = price_trackers.first()
                # Criar uma chave única baseada nos campos relevantes
                key = (price_tracker.Model, price_tracker.Price, 
                       price_tracker.SearchString, price_tracker.Supplier)
                
                if key not in unique_trackers:
                    unique_trackers[key] = price_tracker
                    favorite, created = Favorites.objects.get_or_create(
                        user=user,
                        price_tracker=price_tracker,
                        defaults={'date_added': datetime.now()}
                    )
                    if created:
                        saved_products.append(favorite)

        serializer = FavoriteSerializer(saved_products, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        print("Erro:", str(e))
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['GET'])
# @authentication_classes([TokenAuthentication])
# @permission_classes([IsAuthenticated])
def get_favorites(request):
    try:
        userId = request.GET.get('userId')
        user = User.objects.get(id=userId)
        
        # Buscar todos os favoritos
        favorites = (Favorites.objects
                    .filter(user=user)
                    .select_related('price_tracker')
                    .order_by('price_tracker__Model', 'price_tracker__Price', '-date_added'))
        
        # Dicionário para manter apenas um registro por Model/Price
        unique_favorites = {}
        for favorite in favorites:
            key = (favorite.price_tracker.Model, favorite.price_tracker.Price)
            if key not in unique_favorites:
                unique_favorites[key] = favorite
        
        # Converter o dicionário de volta para lista
        unique_favorites_list = list(unique_favorites.values())
        
        serializer = FavoriteSerializer(unique_favorites_list, many=True)
        return Response(serializer.data)
        
    except Exception as e:
        print("Erro:", str(e))
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['GET'])
def get_prices_monthly_history(request):
    try:
        search_query = request.GET.get('searchString')
        search_query = search_query.replace('"', '').replace("'", '')

        thirty_days_ago = datetime.now() - timedelta(days=30)

        priceTrackers = PriceTracker.objects.filter(
            SearchString__icontains=search_query,
            DateOfSearch__gte=thirty_days_ago
        )

        if not priceTrackers.exists():
            return Response({"average_price_30_days": None}, status=200)

        avg_price = sum(p.Price for p in priceTrackers) / len(priceTrackers)
        return Response({"average_price_30_days": round(avg_price, 2)}, status=200)

    except Exception as e:
        print("Error:", str(e))
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
