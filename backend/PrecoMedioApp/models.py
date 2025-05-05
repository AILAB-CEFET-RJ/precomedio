from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Products(models.Model):
    ProductId = models.AutoField(primary_key=True)
    Model = models.CharField(max_length=100)  
    StorageGB = models.IntegerField()  
    Brand = models.CharField(max_length=100)  
    class Meta:
        db_table = "Products_temp"

class PriceTracker(models.Model):
    Model = models.CharField(max_length=100) 
    DateOfSearch = models.DateTimeField()
    Price = models.DecimalField(max_digits=10, decimal_places=2)
    SearchString = models.CharField(max_length=100)  
    Product = models.ForeignKey(Products, on_delete=models.CASCADE) 
    Supplier = models.CharField(max_length=100)
    class Meta:
        db_table = "PriceTracker_temp"


class Busca_consolidado(models.Model):
    Consolidadoid = models.IntegerField(primary_key=True)
    SearchString = models.CharField(max_length=100)
    AvgPrice = models.DecimalField(max_digits=10, decimal_places=2) 
    MinPrice = models.DecimalField(max_digits=10, decimal_places=2)
    DateOfSearch = models.DateTimeField()
    class Meta:
        db_table = "Busca_consolidado"

class Favorites(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    price_tracker = models.ForeignKey(PriceTracker, on_delete=models.CASCADE)
    date_added = models.DateTimeField()

    class Meta:
        unique_together = ('user', 'price_tracker')
        db_table = "Favorites"

class Preco_Mensal(models.Model):
    Consolidadoid = models.IntegerField(primary_key=True)
    SearchString = models.CharField(max_length=100)
    Price = models.DecimalField(max_digits=10, decimal_places=2) 
    Year = models.DecimalField(max_digits=10, decimal_places=2)
    Month = models.IntegerField(choices=[(i, i) for i in range(1, 13)])
    class Meta:
        db_table = "Preco_Mensal"