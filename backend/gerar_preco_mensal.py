# gerar_preco_mensal.py

import os
import django
from datetime import datetime, timedelta
from django.db.models import Avg

# Configura o Django (ajuste o nome do seu projeto aqui)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'PrecoMedioApi.settings')
django.setup()

from PrecoMedioApp.models import Busca_consolidado, Preco_Mensal  # ajuste o nome da sua app

def gerar_preco_mensal():
    # Data de hoje
    hoje = datetime.today()

    # Primeiro e último dia do mês anterior
    primeiro_dia_mes_atual = hoje.replace(day=1)
    ultimo_dia_mes_passado = primeiro_dia_mes_atual - timedelta(days=1)
    primeiro_dia_mes_passado = ultimo_dia_mes_passado.replace(day=1)

    ano = primeiro_dia_mes_passado.year
    mes = primeiro_dia_mes_passado.month

    # Filtra registros da Busca_consolidado no mês anterior
    registros = Busca_consolidado.objects.filter(
        DateOfSearch__gte=primeiro_dia_mes_passado,
        DateOfSearch__lte=ultimo_dia_mes_passado
    )

    if not registros.exists():
        print(f"Nenhum dado encontrado para {mes}/{ano}.")
        return

    # Agrupa por SearchString e calcula média
    agregados = registros.values('SearchString').annotate(avg_price=Avg('AvgPrice'))

    # Insere os dados na tabela Preco_Mensal
    inseridos = 0
    for item in agregados:
        Preco_Mensal.objects.create(
            SearchString=item['SearchString'],
            Price=item['avg_price'],
            Year=ano,
            Month=mes
        )
        inseridos += 1

    print(f"{inseridos} registros inseridos com sucesso em Preco_Mensal para {mes}/{ano}.")

if __name__ == "__main__":
    gerar_preco_mensal()
