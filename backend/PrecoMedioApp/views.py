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
from dateutil.relativedelta import relativedelta 
from django.db.models import Min, Avg
from django.db.models.functions import TruncMonth
from .serializers import PriceTrackerSerializer, UserSerializer, FavoriteProductSerializer, AlertSerializer, FavoritesSearchSerializer

from .models import Products, PriceTracker, Busca_consolidado, FavoritesProduct, Alert, Preco_Mensal, FavoritesSearch
from django.http import HttpResponse

@api_view(['GET'])
def list_min_price_per_product(request):
    queryset = Busca_consolidado.objects.values('SearchString') \
                                   .annotate(MinPrice=Min('MinPrice')) \
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
        search_query = f"{model}+{storage}"
        soup = fazer_pesquisa(search_query)
        products_with_filters = obter_modelos_e_precos(soup, search_query)
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
                Supplier=price_tracker_data['Supplier']
            )

            if price_trackers.exists():
                price_tracker = price_trackers.first()
                # Criar uma chave única baseada nos campos relevantes
                key = (price_tracker.Model, price_tracker.Price, 
                       price_tracker.SearchString, price_tracker.Supplier)
                
                if key not in unique_trackers:
                    unique_trackers[key] = price_tracker
                    favorite, created = FavoritesProduct.objects.get_or_create(
                        user=user,
                        price_tracker=price_tracker,
                        defaults={'date_added': datetime.now()},
                    )
                    if created:
                        saved_products.append(favorite)

        serializer = FavoriteProductSerializer(saved_products, many=True)
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
        favorites = (FavoritesProduct.objects
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
        
        serializer = FavoriteProductSerializer(unique_favorites_list, many=True)
        return Response(serializer.data)
        
    except Exception as e:
        print("Erro:", str(e))
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )
        
@api_view(['GET'])
def get_mean_prices_last_30_days(request):
    try:
        thirty_days_ago = datetime.now().date() - timedelta(days=30)

        queryset = Busca_consolidado.objects.filter(
            DateOfSearch__gte=thirty_days_ago
        ).values(
            'SearchString'
        ).annotate(
            MeanPriceLast30Days=Avg('AvgPrice') 
        ).order_by(
            'SearchString'  
        )

        result = list(queryset)

        return Response(result, status=status.HTTP_200_OK)

    except Exception as e:
        print("Erro:", str(e))
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['GET'])
def get_mean_prices_last_6_months(request):
    try:
        # Get the first day of the current month at midnight
        current_month_start = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        six_months_ago_start = current_month_start - relativedelta(months=6)

        queryset = (
            Busca_consolidado.objects
            .filter(
                DateOfSearch__gte=six_months_ago_start,
                DateOfSearch__lt=current_month_start
            )
            .annotate(month=TruncMonth('DateOfSearch')) 
            .values('SearchString', 'month')
            .annotate(mean_price=Avg('AvgPrice')) 
            .order_by('SearchString', 'month')
        )

        result = {}
        for entry in queryset:
            product = entry['SearchString']
            month = entry['month'].strftime('%B %Y')
            price = round(entry['mean_price'], 2)
            
            if product not in result:
                result[product] = {}
            result[product][month] = price


        return Response(result, status=status.HTTP_200_OK)
    
    except Exception as e:
        print("Erro:", str(e))
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )


def precos_mensais_view(request):
    dados = Preco_Mensal.objects.all().order_by('SearchString', 'Year', 'Month')

    resultado = {}

    for item in dados:
        nome_produto = item.SearchString
        mes_formatado = f"{int(item.Month):02d}/{int(item.Year)}"
        preco = float(item.Price)

        if nome_produto not in resultado:
            resultado[nome_produto] = []

        resultado[nome_produto].append({
            'month': mes_formatado,
            'product': nome_produto,
            'price': preco
        })
    return JsonResponse(resultado)

@api_view(['GET'])
def list_alerts(request):
    try:
        user_id = request.GET.get('userId')
        user = User.objects.get(id=user_id)
        alerts = Alert.objects.filter(user=user)
        serializer = AlertSerializer(alerts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def create_alert(request):
    try:
        user_id = request.data.get('userId')
        user = User.objects.get(id=user_id)
        data = request.data
        data['user'] = user.id  # Adiciona o ID do usuário ao payload
        serializer = AlertSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def update_alert(request, alert_id):
    try:
        alert = get_object_or_404(Alert, id=alert_id)
        serializer = AlertSerializer(alert, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_alert(request, alert_id):
    try:
        alert = get_object_or_404(Alert, id=alert_id)
        alert.delete()
        return Response({'message': 'Alert deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def save_favorites_search(request):
    print("Request data:", request.data)
    
    try:
        search_string = request.data.get('searchString')
        userId = request.data.get('userId')
        user = User.objects.get(id=userId)
        
        
        
        if FavoritesSearch.objects.filter(user=user, search_string=search_string).exists():
            return Response({"detail": "Favorite already exists."}, status=status.HTTP_400_BAD_REQUEST)
        
        favorite_search = FavoritesSearch.objects.create(
            user=user,
            search_string=search_string,
            date_added=datetime.now()
        )
        
        serializer = FavoritesSearchSerializer(favorite_search)
        return Response({"detail": "Search favorited sucessfuly"}, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        print("Erro:", str(e))
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )
        
@api_view(['GET'])
def get_favorites_search(request):
    try:
        userId = request.GET.get('userId')
        user = User.objects.get(id=userId)
        
        favorites_search = FavoritesSearch.objects.filter(user=user).order_by('-date_added')
        serializer = FavoritesSearchSerializer(favorites_search, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Exception as e:
        print("Erro:", str(e))
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )
        
@api_view(['DELETE'])
def delete_favorites_search(request, search_id):
    try:
        favorite_search = get_object_or_404(FavoritesSearch, id=search_id)
        favorite_search.delete()
        return Response({'message': 'Favorite search deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)  