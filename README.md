# Preço Médio

## Visão Geral

Preço Médio é uma aplicação Python voltada para calcular o preço médio de produtos.

## Requisitos do Sistema

- Python 3.12
- Docker
- Postman ou Insomnia
- SQLite

## Configuração do Ambiente

1. Clone o repositório e mude para a branch V2:

   ```
   git clone git@github.com:MLRG-CEFET-RJ/precomedio.git
   cd precoMedio
   git checkout main
   ```

2. Instale as dependências:

   ```
   cd precoMedioApi
   pip install -r requirements.txt
   ```

3. Configure o banco de dados SQLite:

   ```
   python manage.py migrate
   python3 manage.py makemigrations PrecoMedioApp
   ```

4. Crie o contêiner Docker:

   ```
   docker-compose build
   ```

## Uso da Aplicação

1. Inicie o servidor Django:

   ```
   python manage.py runserver
   ```

2. Faça requisições para a API usando o Postman ou o Insomnia.

## Estrutura do Projeto

- **precoMedioApi**: Contém o código-fonte da API.
- **PrecoMedioApp**: Aplicação principal.
- **docker-compose.yml**: Configuração do contêiner Docker.

## Contribuição

- Faça um fork do repositório.
- Crie uma nova branch com a sua feature.
- Faça commit das suas mudanças e envie um pull request.

## Suporte

Abra uma issue no GitHub para reportar problemas ou tirar dúvidas.

## Licença

MIT License
