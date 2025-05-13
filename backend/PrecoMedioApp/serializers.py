from rest_framework import serializers
from django.contrib.auth.models import User
from .models import PriceTracker, Products, Favorites, Alert

class ProductsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields = ['ProductId', 'Model', 'StorageGB', 'Brand']

class PriceTrackerSerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceTracker
        fields = ['Model', 'DateOfSearch', 'Price', 'SearchString', 'Product', 'Supplier']

class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = User
        fields=['id','username','password','email']

class FavoriteSerializer(serializers.ModelSerializer):
    price_tracker = PriceTrackerSerializer()
    
    class Meta:
        model = Favorites
        fields = ['id', 'price_tracker', 'date_added']

class AlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = ['id', 'user', 'SearchString', 'target_price']
