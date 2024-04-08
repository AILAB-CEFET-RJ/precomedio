from rest_framework import serializers
from .models import PriceTracker, Products

class ProductsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields = ['ProductId', 'Model', 'StorageGB', 'Brand']

class PriceTrackerSerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceTracker
        fields = ['Model', 'DateOfSearch', 'Price', 'SearchString', 'Product', 'Supplier']
