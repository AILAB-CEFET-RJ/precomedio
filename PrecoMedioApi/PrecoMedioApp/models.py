from django.db import models

# Create your models here.
class Products(models.Model):
    ProductId = models.AutoField(primary_key=True)
    Model = models.CharField(max_length=100)  # Alterei para CharField
    StorageGB = models.IntegerField()  # Alterei para IntegerField
    Brand = models.CharField(max_length=100)  # Alterei para CharField

class PriceTracker(models.Model):
    Model = models.CharField(max_length=100)  # Alterei para CharField
    DateOfSearch = models.DateField()
    Price = models.DecimalField(max_digits=10, decimal_places=2)
    SearchString = models.CharField(max_length=100)  # Alterei para CharField
    Product = models.ForeignKey(Products, on_delete=models.CASCADE)  # Alterei para ForeignKey
    Supplier = models.CharField(max_length=100)