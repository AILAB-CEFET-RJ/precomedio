Aqui está um guia rápido para configurar o Python e criar um ambiente virtual com todas as dependências necessárias:

# 1. Instalar o Python 

1. Baixar o instalador do Python:
   - Acesse o site oficial do Python (https://www.python.org/downloads/) e baixe a versão mais recente.

2. Instalar o Python:
   - Execute o instalador baixado.
   - Marque a opção "Add Python to PATH" na primeira tela do instalador. Isso facilita o uso do Python no Prompt de Comando.
   - Clique em "Install Now" e aguarde a instalação.

3. Verificar a instalação:
   - Abra o Prompt de Comando (digite `cmd` no menu Iniciar).
   - Digite `python --version` e pressione Enter. Você deve ver a versão do Python instalada, algo como `Python 3.x.x`.

# 2. Criar um Ambiente Virtual 

1. Acessar o diretório desejado:
   - No Prompt de Comando, navegue até o diretório onde você quer criar o ambiente virtual. Por exemplo:
     ```cmd
     cd C:\Users\SeuUsuario
     ```

2. Criar o ambiente virtual:
   - No Prompt de Comando, crie um ambiente virtual com o comando:
     ```cmd
     python -m venv nome_do_ambiente
     ```
   - Substitua `nome_do_ambiente` pelo nome que deseja dar ao ambiente virtual (por exemplo, `aps2`).

3. Ativar o ambiente virtual:
   - No Windows, use o comando:
     ```cmd
     nome_do_ambiente\Scripts\activate
     ```
   - Após a ativação, você verá o nome do ambiente virtual (por exemplo, `(aps2)`) antes do prompt, indicando que está ativo.

# 3. Instalar Pacotes Necessários 

1. Atualizar o pip:
   - Com o ambiente ativado, atualize o pip para garantir a versão mais recente:
     ```cmd
     python -m pip install --upgrade pip
     ```

2. Instalar dependências:
   - Instale as dependências que seu projeto ou ambiente pode precisar. Por exemplo, para instalar `requests` e `flask`, execute:
     ```cmd
     pip install requests flask
     ```

3. Verificar os pacotes instalados:
   - Use o comando `pip list` para ver uma lista dos pacotes instalados no ambiente:
     ```cmd
     pip list
     ```

# 4. Desativar o Ambiente Virtual 

Para sair do ambiente virtual e voltar ao prompt normal, basta digitar:

```cmd
deactivate
```

> **Observação:** O comando `deactivate` **apenas sai** do ambiente virtual; ele **não o apaga**. O ambiente virtual e todos os pacotes instalados nele permanecem salvos. Você pode reativá-lo a qualquer momento com o comando `nome_do_ambiente\Scripts\activate`. Para excluir o ambiente virtual completamente, você precisaria deletar a pasta onde ele foi criado (por exemplo, `aps2`).

Agora você tem o ambiente virtual pronto para usar no Windows 10. 

-----------

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


# Preço Médio API
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
   git clone <url_do_repositorio>
   cd precoMedio
   git checkout V2
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

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
