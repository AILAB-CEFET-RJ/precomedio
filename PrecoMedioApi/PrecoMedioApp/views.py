from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from .db_operations import get_all_price_trackers, get_price_trackers_by_title_and_storage, get_product_with_lowest_price, get_price_trackers_by_title
from .utils import extrair_resultados, fazer_pesquisa, obter_modelos_e_precos
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from .text_processing import detectar_outliers

from .serializers import PriceTrackerSerializer, UserSerializer


@csrf_exempt
@api_view(['GET'])
@authentication_classes([SessionAuthentication,TokenAuthentication])
@permission_classes([IsAuthenticated])
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

@api_view(['GET'])
@authentication_classes([SessionAuthentication,TokenAuthentication])
@permission_classes([IsAuthenticated])   
def averagePrice(request, model:str):
    if request.method == 'GET':
        products = get_price_trackers_by_title(model)
        average = detectar_outliers(products)
        message = f"O preço médio do produto {model} é R$ {average:.2f}"
        
        return Response({"message": message})
    else:
        return JsonResponse({'message': 'Method not allowed'}, status=405)