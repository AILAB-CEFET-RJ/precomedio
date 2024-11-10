# **Tutorial Completo - Configuração e Uso do Projeto Preço Médio API no Windows**

## **Visão Geral**
O **Preço Médio** é uma aplicação Python criada para calcular o preço médio de produtos. Este tutorial abrange desde a configuração do ambiente até o uso da API.

## **Requisitos do Sistema**
1. **Python 3.12**
2. **Ambiente Virtual**: Para organizar pacotes e denpendências
3. **Git**: Ferramenta para controle de versão
4. **Docker**: Para contêinerização da aplicação
5. **Postman** ou **Insomnia**: Ferramentas para testar a API
6. **SQLite**: Banco de dados integrado ao Django
7. **Node**: Gerenciar pacotes e dependências de projetos JavaScript, como o **Create React App**.
   
## 1. Python 

1. Baixar o instalador do Python:
   - Acesse o site oficial do Python (https://www.python.org/downloads/) e baixe a versão 3.12.

2. Instalar o Python:
   - Execute o instalador baixado.
   - Marque a opção "Add Python to PATH" na primeira tela do instalador. Isso facilita o uso do Python no Prompt de Comando.
   - Clique em "Install Now" e aguarde a instalação.

3. Verificar a instalação:
   - Abra o Prompt de Comando (digite `cmd` no menu Iniciar).
   - Digite `python --version` e pressione Enter. Você deve ver a versão do Python instalada, algo como `Python 3.x.x`.

## 2. Ambiente Virtual
### 2.1. Criar um Ambiente Virtual 
1. Acessar o diretório desejado:
   - No Prompt de Comando, navegue até o diretório onde você quer criar o ambiente virtual. Por exemplo:
     
cmd
     cd C:\Users\SeuUsuario

### 2.2. Criar o ambiente virtual:
   - No Prompt de Comando, crie um ambiente virtual com o comando:
     
cmd
     python -m venv nome_do_ambiente

   - Substitua nome_do_ambiente pelo nome que deseja dar ao ambiente virtual (por exemplo, aps2).

### 2.3   Ativar o ambiente virtual:
   - No Windows, use o comando:
     
cmd
     nome_do_ambiente\Scripts\activate

   - Após a ativação, você verá o nome do ambiente virtual (por exemplo, (aps2)) antes do prompt, indicando que está ativo.

### 2.4. Instalar Pacotes Necessários 

1. Atualizar o pip:
   - Com o ambiente ativado, atualize o pip para garantir a versão mais recente:
     
cmd
     python -m pip install --upgrade pip

2. Instalar dependências:
   - Instale as dependências que seu projeto ou ambiente pode precisar. Por exemplo, para instalar requests e flask, execute:
     
cmd
     pip install requests flask

3. Verificar os pacotes instalados:
   - Use o comando pip list para ver uma lista dos pacotes instalados no ambiente:
     
cmd
     pip list

### 2.5. Desativar o Ambiente Virtual 
Para sair do ambiente virtual e voltar ao prompt normal, basta digitar:

cmd
deactivate

> **Observação:** O comando deactivate **apenas sai** do ambiente virtual; ele **não o apaga**. O ambiente virtual e todos os pacotes instalados nele permanecem salvos. Você pode reativá-lo a qualquer momento com o comando nome_do_ambiente\Scripts\activate. Para excluir o ambiente virtual completamente, você precisaria deletar a pasta onde ele foi criado (por exemplo, aps2).

## 3. Git
O Git é necessário para clonar o repositório do projeto.

1. **Baixar e Instalar Git**:
   - Acesse [Git Downloads](https://git-scm.com/downloads) e faça o download.
   - Durante a instalação, marque a opção para adicionar o Git ao PATH.

2. **Verificar a Instalação**:
   - Após a instalação, abra o **Prompt de Comando** e digite:
     ```cmd
     git --version
     ```
## 4. Docker
O Docker é usado para rodar a aplicação em contêineres, garantindo que o ambiente de produção seja idêntico ao de desenvolvimento.

1. **Baixar e Instalar Docker Desktop**:
   - Acesse [Docker Downloads](https://www.docker.com/products/docker-desktop) e faça o download.
   - Após a instalação, reinicie o computador se necessário e abra o Docker Desktop.

2. **Verificar a Instalação**:
   - No **Docker Desktop**, certifique-se de que o Docker está funcionando corretamente.
  
3. **Construir os Contêineres**:
   - No diretório principal do projeto (onde está o arquivo `docker-compose.yml`), execute:
     ```cmd
     docker-compose build
     ```
## 5. Postman ou Insomnia
Essas ferramentas são usadas para enviar requisições HTTP para a API.

1. **Baixar e Instalar Postman**:
   - Acesse [Postman Downloads](https://www.postman.com/downloads/) e faça o download.
   
2. **Baixar e Instalar Insomnia** (alternativa):
   - Acesse [Insomnia Downloads](https://insomnia.rest/download) e faça o download.

## 6. Banco de Dados SQLite
O projeto utiliza o **SQLite** como banco de dados. Para configurá-lo, execute os seguintes comandos:

1. **Aplicar Migrations do Django**:
   - Execute os comandos a seguir para configurar o banco de dados:
     ```cmd
     python manage.py migrate
     ```

2. **Criar as Migrations Específicas do App**:
   - No diretório do projeto, execute:
     ```cmd
     python manage.py makemigrations PrecoMedioApp
     python manage.py migrate
     ```
## 7. NPM
O **npm** é uma ferramenta fundamental para gerenciar pacotes e dependências de projetos JavaScript, como o **Create React App**. 

1. **Instale o Node.js**: O **npm** vem junto com o Node.js. Para instalá-lo, vá até o site oficial: [nodejs.org](https://nodejs.org/) e baixe a versão recomendada para a maioria dos usuários.

2. **Verifique a instalação**:
   Após a instalação, abra o terminal ou prompt de comando e execute os seguintes comandos para verificar se o **Node.js** e o **npm** foram instalados corretamente:
   
   - Para verificar o Node.js:
     ```
     node -v
     ```

   - Para verificar o npm:
     ```
     npm -v
     ```

## Usando a aplicação:
Agora que o ambiente está configurado, você pode iniciar a aplicação e interagir com a API.

### 1. Rodar o Servidor Django

1. **Iniciar o Servidor de Desenvolvimento**:
   - Execute o seguinte comando para iniciar o servidor Django local:
     ```cmd
     python manage.py runserver
     ```

2. **Acessar a Aplicação**:
   - O servidor estará disponível em `http://127.0.0.1:8000/`. Você pode acessá-lo pelo navegador ou usar o Postman/Insomnia para testar os endpoints.

### 2. Testar a API com Postman ou Insomnia

1. **Abrir o Postman/Insomnia**:
   - Abra o Postman ou Insomnia para testar os endpoints da API.

2. **Enviar Requisições**:
   - Para testar a API, crie requisições HTTP com os métodos GET, POST, PUT, etc., de acordo com os endpoints definidos no seu projeto.

   Exemplo de uma requisição para listar produtos:
   ```http
   GET http://127.0.0.1:8000/api/produtos/
   ```

   - No Postman ou Insomnia, insira a URL e o tipo de requisição, e clique em "Send" para obter a resposta.

## Estrutura do Projeto
- **precoMedioApi**: Contém o código-fonte da API.
- **PrecoMedioApp**: Aplicação principal onde a lógica de negócios reside.
- **docker-compose.yml**: Arquivo de configuração para o Docker, que define como os contêineres devem ser configurados e executados.

---

## Contribuição
Se você deseja contribuir para o projeto:
1. **Faça um Fork** do repositório no GitHub.
2. **Crie uma Nova Branch** com a sua feature ou correção:
   ```cmd
   git checkout -b nome-da-feature
   ```
3. **Faça Commit das Mudanças**:
   ```cmd
   git add .
   git commit -m "Descrição da mudança"
   ```
4. **Envia um Pull Request** para a branch principal do repositório.

## Suporte
Se encontrar problemas ou tiver dúvidas:
- Abra uma **issue** no GitHub para relatar o problema ou pedir ajuda.

## Licença
MIT License

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
