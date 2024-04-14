from django.db import models

# Create your models here.
class Produto(models.Model):
    id = models.AutoField(primary_key=True)
    valproduto = models.FloatField()
    lojaproduto = models.TextField()
    descricaoproduto = models.TextField()
    data = models.DateField(auto_now=True)

    def __str__(self):
        return self.descricaoproduto





