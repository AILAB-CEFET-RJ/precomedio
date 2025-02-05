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
from PrecoMedioApp.views import search, login, signup, save_favorites, get_favorites
from PrecoMedioApp import views

urlpatterns = [
    path('buscaDiaria_alimentarConsolidada/', views.buscaDiaria_alimentarConsolidada, name='buscaDiaria_alimentarConsolidada'),
    path('admin/', admin.site.urls),
    path('search/<str:model>/<str:storage>/', search, name='search'),
    re_path('login', login),
    re_path('signup', signup),
    path('favorites/', views.save_favorites, name='save_favorites'),
    path('favorites/list/', views.get_favorites, name='get_favorites'),
]
