
from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include("precoMedioProduto.urls")),
    path('produtos/',include("precoMedioProduto.urls"))
]






