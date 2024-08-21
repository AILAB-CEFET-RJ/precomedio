from django.db import models

# Create your models here.
class Products(models.Model):
    ProductId = models.AutoField(primary_key=True)
    Model = models.CharField(max_length=100)  
    StorageGB = models.IntegerField()  
    Brand = models.CharField(max_length=100)  

class PriceTracker(models.Model):
    Model = models.CharField(max_length=100) 
    DateOfSearch = models.DateTimeField()
    Price = models.DecimalField(max_digits=10, decimal_places=2)
    SearchString = models.CharField(max_length=100)  
    Product = models.ForeignKey(Products, on_delete=models.CASCADE) 
    Supplier = models.CharField(max_length=100)