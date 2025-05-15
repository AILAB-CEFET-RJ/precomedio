# gerar_preco_mensal.py

import os
import django
from datetime import datetime, timedelta
from django.db.models import Avg
from django.db.models.functions import TruncMonth

# Configura o Django (ajuste o nome do seu projeto aqui)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'PrecoMedioApi.settings')
django.setup()

ULTIMO_MES = False
LIMPA_TABELA_PRECO_MENSAL = True

from PrecoMedioApp.models import Busca_consolidado, Preco_Mensal  # ajuste o nome da sua app

def gerar_preco_mensal():
    if LIMPA_TABELA_PRECO_MENSAL:
        Preco_Mensal.objects.all().delete()
    
    # Data de hoje     
    hoje = datetime.today()

    # Primeiro e último dia do mês anterior
    primeiro_dia_mes_atual = hoje.replace(day=1)
    ultimo_dia_mes_passado = primeiro_dia_mes_atual - timedelta(days=1)
    primeiro_dia_mes_passado = ultimo_dia_mes_passado.replace(day=1)
    seis_meses_atras = primeiro_dia_mes_atual - timedelta(days=180)

    ano = primeiro_dia_mes_passado.year
    mes = primeiro_dia_mes_passado.month
    
    if ULTIMO_MES:
        registros = Busca_consolidado.objects.filter(
            DateOfSearch__gte=primeiro_dia_mes_passado,
            DateOfSearch__lte=ultimo_dia_mes_passado
        )
    else:
        registros = Busca_consolidado.objects.filter(DateOfSearch__gte=seis_meses_atras, DateOfSearch__lte=ultimo_dia_mes_passado)

    if not registros.exists():
        print(f"Nenhum dado encontrado para {mes}/{ano}.")
        return

    # Agrupa por SearchString e calcula média
    if ULTIMO_MES:
        agregados = registros.values('SearchString').annotate(avg_price=Avg('AvgPrice'))
    else: 
        agregados = registros.annotate(month=TruncMonth('DateOfSearch')).values('SearchString', 'month').annotate(avg_price=Avg('AvgPrice')).order_by('SearchString', 'month')  

    # Insere os dados na tabela Preco_Mensal
    inseridos = 0
    for item in agregados:
        if ULTIMO_MES:
            Preco_Mensal.objects.create(
                SearchString=item['SearchString'],
                Price=item['avg_price'],
                Year=ano,
                Month=mes
            )
        else:
            Preco_Mensal.objects.create(
                SearchString=item['SearchString'],
                Price=item['avg_price'],
                Year=item['month'].year,
                Month=item['month'].month
            )
        inseridos += 1

    if ULTIMO_MES:
        print(f"{inseridos} registros inseridos com sucesso em Preco_Mensal para {mes}/{ano}.")
    else:
        print(f"{inseridos} registros inseridos com sucesso em Preco_Mensal para os últimos 6 meses.")

if __name__ == "__main__":
    gerar_preco_mensal()
