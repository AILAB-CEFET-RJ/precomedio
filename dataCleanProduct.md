A "limpeza" dos produtos da busca:

Em text_processing.py:
.obter_preco(price_text)
- Remove tudo que não dígito ou vígula.
- Substitui vígula por ponto.
- Transforma o dado string em tipo decimal.

.detectar_outliers(products)
- Dado decimal é transofrmado para tipo float.
- Remoção dos produtos com preços fora dos limites.

.get_brand(model)
-transforma a string do modelo toda em minúscula.

Em db_operations.py:
.get_or_create_product(title, storage, brand)
- Remove os dois últimos caracteres do armazenamento.
- Transoforma o dados em inteiro.

.get_price_trackers_by_title_and_storage(title, storage)
- Coloca um espaço entre o nome do modelo e seu número.

Em utils.py:
.extrair_resultados(soup)
- Filtra os resultados da pesquisa para encontrar apenas os itens que contêm os links dos anúncios.

.obter_modelos_e_precos(soup_results, soup_ads, model)
- Filtra os produtos cujos títulos contêm certas palavras.
- Filtra produtos sem informações de armazenamento ou diferentes de GB.
- Evita a duplicação de produtos com informações idênticas ou muito semelhantes.
- Filtra produtos sem preços, indisponíveis ou com preços inválidos.
