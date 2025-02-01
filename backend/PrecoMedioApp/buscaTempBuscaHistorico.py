import requests

response = requests.get('http://127.0.0.1:8000/reset_and_query/')
print(response.text)