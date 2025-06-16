import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Configurações do Gmail
smtp_server = "smtp.gmail.com"
smtp_port = 587
email_usuario = "precomedio59@gmail.com"         # Seu e-mail Gmail
email_senha = "xsex meek ntmj ctfq"       # Sua senha de app do Gmail

# Destinatário
destinatario = "####"     # E-mail de destino

# Montando o e-mail
mensagem = MIMEMultipart()
mensagem["From"] = email_usuario
mensagem["To"] = destinatario
mensagem["Subject"] = "Teste de envio de e-mail com Gmail"

corpo = "Este é um e-mail de teste enviado via Python usando Gmail SMTP!"
mensagem.attach(MIMEText(corpo, "plain"))

# Enviando o e-mail
try:
    servidor = smtplib.SMTP(smtp_server, smtp_port)
    servidor.starttls()
    servidor.login(email_usuario, email_senha)
    servidor.sendmail(email_usuario, destinatario, mensagem.as_string())
    servidor.quit()
    print("E-mail enviado com sucesso!")
except Exception as e:
    print("Erro ao enviar e-mail:", e)