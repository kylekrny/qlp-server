using System;

using MailKit.Net.Smtp;
using MailKit;
using MimeKit;

class MailProgram
    {
        public void SendNewEmail()
        {
            var message = new MimeMessage();
            message.From.Add (new MailboxAddress("No Reply", "noreply@qualitylapelpins.com"));
            message.To.Add (new MailboxAddress ("Kyle Kearney", "kylekrny@gmail.com"));
            message.Subject = "Test Subject";

            message.Body = new TextPart ("plain") {
                Text = "Hello Email!"
            };
            using (var client = new SmtpClient()) {
                client.Connect ("mail.qualitylapelpins.com", 465, true);
                client.Authenticate ("noreply@qualitylapelpins.com", "");
                
                client.Send (message);
                client.Disconnect(true);
            }
        }
    }
