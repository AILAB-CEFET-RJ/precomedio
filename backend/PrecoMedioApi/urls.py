"""
URL configuration for PrecoMedioApi project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path
from PrecoMedioApp.views import search, login, signup, save_favorites, get_favorites, buscaDiaria_alimentarConsolidada, list_min_price_per_product, get_mean_prices_last_30_days

urlpatterns = [
    path('buscaDiaria_alimentarConsolidada/', buscaDiaria_alimentarConsolidada, name='buscaDiaria_alimentarConsolidada'),
    path('admin/', admin.site.urls),
    path('search/<str:model>/<str:storage>/', search, name='search'),
    re_path('login', login),
    re_path('signup', signup),
    path('favorites/', save_favorites, name='save_favorites'),
    path('favorites/list/', get_favorites, name='get_favorites'),
    path('min_prices/', list_min_price_per_product, name='list_min_price_per_product'),
    path('mean-prices/last-30-days/', get_mean_prices_last_30_days, name='mean_prices_last_30_days'),
]
