import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


def send_email(to: str, id: int):
    subject = "Connection Request"
    body = f"Hi! \nYou have a connection request From: {id}"
    message = MIMEMultipart()
    message["From"] = "your_email@gmail.com"
    message["To"] = to
    message["Subject"] = subject

    # Add body to email
    message.attach(MIMEText(body, "plain"))

    text = message.as_string()

    # Log in to server using secure context and send email
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login("msgsend1@gmail.com", "oniniqkytxhpxwhv")
        server.sendmail("msgsend1@gmail.com", to, text)
    
send_email("1393895459@qq.com", 1)