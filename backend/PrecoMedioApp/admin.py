from django.contrib import admin
from .models import Products, PriceTracker, Busca_consolidado, FavoritesProduct, Preco_Mensal, FavoritesSearch, Alert

@admin.register(Products)
class ProductsAdmin(admin.ModelAdmin):
    list_display = ('ProductId', 'Model', 'StorageGB', 'Brand')

@admin.register(PriceTracker)
class PriceTrackerAdmin(admin.ModelAdmin):
    list_display = ('Model', 'SearchString', 'Price', 'Supplier', 'Product')

@admin.register(Busca_consolidado)
class BuscaConsolidadoAdmin(admin.ModelAdmin):
    list_display = ('Consolidadoid', 'SearchString', 'AvgPrice', 'MinPrice', 'DateOfSearch')

@admin.register(FavoritesProduct)
class FavoritesAdmin(admin.ModelAdmin):
    list_display = ('user', 'price_tracker', 'date_added')

@admin.register(Preco_Mensal)
class PrecoMensalAdmin(admin.ModelAdmin):
    list_display = ('Consolidadoid', 'SearchString', 'Price', 'Year', 'Month')
    
@admin.register(FavoritesSearch)
class FavoritesSearchAdmin(admin.ModelAdmin):
    list_display = ('user', 'search_string', 'date_added')

@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ('user', 'SearchString', 'target_price')