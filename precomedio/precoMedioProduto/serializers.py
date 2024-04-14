from rest_framework import serializers
from precoMedioProduto.models import Produto

class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = ["id","valproduto","lojaproduto","descricaoproduto","data"]


        
