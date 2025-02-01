import requests

response = requests.get('http://127.0.0.1:8000/buscaDiaria_alimentarConsolidada/')
print(response.text)
