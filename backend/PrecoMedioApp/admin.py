from django.contrib import admin
from .models import Products, PriceTracker, Busca_consolidado, Favorites

admin.site.register(Products)
admin.site.register(PriceTracker)
admin.site.register(Busca_consolidado)
admin.site.register(Favorites)
