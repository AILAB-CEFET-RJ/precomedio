from django.contrib import admin
from .models import Products, PriceTracker, Busca_consolidado, Favorites

@admin.register(Products)
class ProductsAdmin(admin.ModelAdmin):
    list_display = ('ProductId', 'Model', 'StorageGB', 'Brand')

@admin.register(PriceTracker)
class PriceTrackerAdmin(admin.ModelAdmin):
    list_display = ('Model', 'DateOfSearch', 'Price', 'Supplier', 'Product')

@admin.register(Busca_consolidado)
class BuscaConsolidadoAdmin(admin.ModelAdmin):
    list_display = ('Consolidadoid', 'SearchString', 'AvgPrice', 'MinPrice', 'DateOfSearch')

@admin.register(Favorites)
class FavoritesAdmin(admin.ModelAdmin):
    list_display = ('user', 'price_tracker', 'date_added')