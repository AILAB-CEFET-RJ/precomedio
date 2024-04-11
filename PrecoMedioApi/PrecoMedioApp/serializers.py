from rest_framework import serializers
from django.contrib.auth.models import User
from .models import PriceTracker, Products

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
