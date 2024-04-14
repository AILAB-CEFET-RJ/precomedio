from django.urls import path
from . import views

urlpatterns = [
    path('home/<str:produtoEscolhido>', views.home,name="home"),
    path('v1/<str:id>', views.produto,name="produto"),
    path('v1/', views.produto,name="produto"),
    path('', views.home,name="home"),
]


