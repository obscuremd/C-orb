using DotNetEnv;
using MailKit.Net.Smtp;
using MimeKit;

namespace Server.Utils
{
    public class MailService
    {
        public MailService()
        {
            Env.Load();
        }

        private readonly string smtpServer = Environment.GetEnvironmentVariable("SMTP_SERVER") ?? "smtp.gmail.com";
        private readonly int smtpPort = int.Parse(Environment.GetEnvironmentVariable("SMTP_PORT")?? "587");
        private readonly string smtpUsername = Environment.GetEnvironmentVariable("SMTP_USERNAME") ?? "";
        private readonly string smtpPassword = Environment.GetEnvironmentVariable("SMTP_PASSWORD") ?? "";

        public async Task SendEmailAsync(string ToEmail, string subject, string body)
        {
            var builder = new BodyBuilder();

            builder.HtmlBody = $@"
                <html>
                <body style='font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;'>
                    <div style='max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);'>
                        <h2 style='color: #333333;'>C-Orb</h2>
                        <p style='font-size: 16px; color: #555555;'>{body}</p>
                        <hr style='border: none; border-top: 1px solid #eeeeee;' />
                        <p style='font-size: 12px; color: #aaaaaa;'>You're receiving this email from C-Orb updates and notifications system.</p>
                    </div>
                </body>
                </html>
            ";

            builder.TextBody = body; // fallback for clients that don't support HTML

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("C-Orb", smtpUsername));
            message.To.Add(new MailboxAddress("", ToEmail));
            message.Subject = subject;

            message.Body = builder.ToMessageBody();

            using var client = new SmtpClient();
            await client.ConnectAsync(smtpServer, smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(smtpUsername, smtpPassword);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);

        }
    }
}