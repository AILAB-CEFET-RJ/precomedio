import requests
import schedule
import time

def consolidar_dia():
    print("Rodando job consolidar dia!")
    response = requests.get('http://127.0.0.1:8000/buscaDiaria_alimentarConsolidada/')
    print("Status Code: ",response.status_code)
    print("Content: ",response.content)
  
schedule.every().day.at("23:59").do(consolidar_dia)

while True:
    schedule.run_pending()
    time.sleep(1)