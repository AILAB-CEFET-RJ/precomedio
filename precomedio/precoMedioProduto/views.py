from django.shortcuts import render,redirect
from django.http import HttpResponse,JsonResponse
from .serializers import ProdutoSerializer
from precoMedioProduto.models import Produto
import requests
from bs4 import BeautifulSoup
import re
import json
from urllib.parse import unquote
from django.views.decorators.csrf import csrf_exempt
import statistics
import matplotlib.pyplot as plt
import os

def fazer_pesquisa(pesquisa,num_pag=0,quantidade_pagina_trazida_max = 60):
    pagina_inicial = num_pag * quantidade_pagina_trazida_max
    url = f"https://www.google.com.br/search?q={pesquisa}&sca_esv=576e4e7685de117a&hl=pt-BR&psb=1&tbs=vw:d&tbm=shop&ei=kTwSZuPPJafX1sQP4_WU-Ac&start={pagina_inicial}&sa=N&ved=0ahUKEwij3NOlvK-FAxWnq5UCHeM6BX84PBDy0wMIsRU&biw=1318&bih=646&dpr=1"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    }
    try:
        response = requests.get(url, headers=headers)
        return BeautifulSoup(response.content, "html.parser")
    except:
        return "erro ao acessar o site."
  
def analise_Estatistica(dadosProduts):
    dic_prod = {}
    lista_valores_produtos = []
    [lista_valores_produtos.append(valores["valproduto"]) for valores in dadosProduts] 
    if dadosProduts:
        dic_prod["media"] = statistics.mean(lista_valores_produtos)
        dic_prod["desvio_padrao"] = statistics.stdev(lista_valores_produtos)
        dic_prod["variancia"] = statistics.variance(lista_valores_produtos)
        dic_prod["mediana"] = statistics.median(lista_valores_produtos)
        dic_prod["moda"] = statistics.mode(lista_valores_produtos)
        dic_prod["media_geometrica"] = statistics.geometric_mean(lista_valores_produtos)
        dic_prod["media_harmonica"] = statistics.harmonic_mean(lista_valores_produtos) 
        dic_prod["menor_valor_encontrado"] = min(lista_valores_produtos) 
        dic_prod["maior_valor_encontrado"] = max(lista_valores_produtos)   
        dic_prod["quatis"] = statistics.quantiles(lista_valores_produtos,method='exclusive') 
        return dic_prod
    else:
        return {}
    
def extrairDados(site,pesquisa_produto, palavrasProibidas = []):
    list_inf_site = []    
    reg_loja = re.compile(r"[0-9a-zA-z]{1,}[^(\.br)][^(\.com)]")
    reg_monetario = re.compile(r"[\d{1,},\d{2,2}]")
    reg_excluir_virgula = re.compile(r"[^\.]")
    reg_ajust_monetario = re.compile(r"^(\d+\.\d{2})")
    produtos = site.find_all("div",attrs={'class':'sh-dgr__gr-auto'})  
    palavra_procurada = pesquisa_produto    
    try:            
            for prod in produtos:
                    descricaoproduto=  "".join(re.findall(palavra_procurada.lower(), ("".join(prod.find("h3",{'class':'tAxDx'}).get_text()).lower())))
                    valproduto = float("".join(reg_ajust_monetario.findall(re.sub(",",".",("".join(reg_monetario.findall(("".join(reg_excluir_virgula.findall(prod.find("div",{'class':'XrAfOe'}).get_text()))))))))))
                    lojaproduto = "".join(reg_loja.findall(prod.find("div",{'class':'aULzUe'}).get_text()))
                    if len(palavrasProibidas)==0 and descricaoproduto :
                        list_inf_site.append({"valproduto":valproduto,"lojaproduto":lojaproduto,"descricaoproduto":"".join(prod.find("h3",{'class':'tAxDx'}).get_text()).lower()})  
                    if len(palavrasProibidas)>0 and descricaoproduto:
                                for  listpalpro in palavrasProibidas:
                                    if listpalpro not in  descricaoproduto:
                                        list_inf_site.append({"valproduto":valproduto,"lojaproduto":lojaproduto,"descricaoproduto":"".join(prod.find("h3",{'class':'tAxDx'}).get_text()).lower()})  
            return list_inf_site
    except:  
            print("Erro ao trazer os dados.")  

def boxPlot(dadosRecolhido):
    # Criar o gráfico de boxplot
    try:
        if not os.path.isfile('./precoMedioProduto/static/img/boxplot.png'):            
            dadosRecolhidoLista = []
            if dadosRecolhido != []:
                for valor in dadosRecolhido:
                    dadosRecolhidoLista.append(valor["valproduto"])            
                plt.boxplot(dadosRecolhidoLista)
                plt.title('Boxplot do Produto')
                plt.ylabel('Preços do Produto')
                # salvar o gráfico
                plt.savefig('./precoMedioProduto/static/img/boxplot.png', dpi=300, transparent=False)
    except:
        print("Erro ao deletar ou a gerar o arquivo gráfico")
    
def home(request,produtoEscolhido = "",parametros_estatisticos=[]):
    try:
        if produtoEscolhido != "":
            site = fazer_pesquisa(produtoEscolhido)
            dados_total = extrairDados(site,produtoEscolhido,[])
            url = "http://127.0.0.1:8000/produtos/v1/"
            data = json.dumps(dados_total)    
            res = requests.post(url,json=data)            
        else:
            res = requests.get("http://127.0.0.1:8000/produtos/v1/") 
            res = json.loads(res.text) 
            parametros_estatisticos = analise_Estatistica(res)
            boxPlot(res)
        return render(request,"home.html",{'produtoEscolhido':res,'parametros_estatisticos':parametros_estatisticos})     
    except:
        return "Erro ao processo os dados"
def login(request):
    return render(request,"login.html")
def redefinirSenha(request):
    return render(request,"redefinirSenha.html")
def cadastrarUsuario(request):
    return render(request,"cadastrarUsuario.html")
def historicoProduto(request):
    return render(request,"historicoProduto.html")
@csrf_exempt
def produto(request,id = ""):             
    if request.method == 'GET':
        try:
            pk = id
            if pk != "":
                prod  = Produto.objects.filter(id=int(pk)).get()
                serializer = ProdutoSerializer(prod)
                return JsonResponse(serializer.data) 
            else:
                 prod = Produto.objects.all()  
                 serializer = ProdutoSerializer(prod,many=True)
                 return JsonResponse(serializer.data,safe=False)                         
        except:
            return JsonResponse({"msg":"Não foi possível trazer o(s) produto(s)"})
           
    elif request.method == "POST":   
        data = request.body
        data =  json.loads(unquote(str(data, encoding='utf-8'))) 
        try:
            for inserirDado in json.loads(data):   
                serializer = ProdutoSerializer(data = inserirDado)
                if serializer.is_valid(raise_exception= True):
                    serializer.save()
            return JsonResponse({"msg":"salvo com sucesso"},safe=False)
        except:
            return JsonResponse({"msg":"erro ao salvar no banco"},safe=False)
        
    elif request.method == "DELETE":
        try:
            pk = id
            if pk != "":
                dado_apagar  = Produto.objects.filter(id=int(pk)).get().delete()    
            else:
                dado_apagar  = Produto.objects.all().delete()
            if dado_apagar[0] > 0:
                return JsonResponse({"msg":"Deletado com sucesso!"})
            else:
                return JsonResponse({"msg":"Ja´foi deletado este produto ou todos produtos"})                          
        except:
            return JsonResponse({"msg":"Não foi possível deletar"})
        
    elif request.method == "PUT":
        try:
                pk = id
                data = request.body
                data =  json.loads(unquote(str(data, encoding='utf-8')))                
                res = Produto.objects.filter(id =pk).update(
                    id = data['id'], 
                    valproduto =  data['valproduto'],
                    lojaproduto = data['lojaproduto'],
                    descricaoproduto = data['descricaoproduto'],
                    data = data['data']
                )
                if res>0:
                    return JsonResponse({"msg":"Atualizado com sucesso"})
        except:
                return JsonResponse({"msg":"Erro atualizar"})



