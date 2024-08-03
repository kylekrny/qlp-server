using System;

using MailKit.Net.Smtp;
using MailKit;
using MimeKit;

class MailService
    {
        public int SendNewEmail(Submission submission)
        {
            var message = new MimeMessage();
            message.From.Add (new MailboxAddress("No Reply", "noreply@qualitylapelpins.com"));
            message.To.Add (new MailboxAddress ("Kyle Kearney", "kylekrny@gmail.com"));
            message.Subject = "Test Subject";

            message.Body = new TextPart ("plain") {
                Text = "Hello Email!"
            };

            try {
                using (var client = new SmtpClient()) {
                    client.Connect ("mail.qualitylapelpins.com", 465, true);
                    client.Authenticate ("noreply@qualitylapelpins.com", "Hs}}VH&aVu6u");
                    
                    client.Send (message);
                    client.Disconnect(true);

                    return 200;
                }
            } catch {
                throw;
            }
        }
    }
