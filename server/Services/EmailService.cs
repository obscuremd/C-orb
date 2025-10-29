using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using MimeKit;

namespace Server.Utils
{
    public class MailService
    {
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;

        public MailService(IConfiguration config, HttpClient httpClient)
        {
            _config = config;
            _httpClient = httpClient;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            await SendUsingBrevoApi(toEmail, subject, body);
        }

        private async Task SendUsingBrevoApi(string toEmail, string subject, string body)
        {
            var apiKey = _config["BREVO_API_KEY"];
            var senderEmail = _config["EMAIL_FROM"] ?? "no-reply@yourdomain.com";

            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("api-key", apiKey);
            _httpClient.DefaultRequestHeaders.Add("accept", "application/json");


            var emailData = new
            {
                sender = new { email = senderEmail, name = "C-Orb" },
                to = new[] { new { email = toEmail } },
                subject = subject,
                htmlContent = $@"
                    <html>
                    <body style='font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;'>
                        <div style='max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);'>
                            <h2 style='color: #333333;'>C-Orb</h2>
                            <p style='font-size: 16px; color: #555555;'>{body}</p>
                            <hr style='border: none; border-top: 1px solid #eeeeee;' />
                            <p style='font-size: 12px; color: #aaaaaa;'>You are receiving this email from C-Orb notifications system.</p>
                        </div>
                    </body>
                    </html>
                "
            };

            var json = JsonSerializer.Serialize(emailData);
            var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("https://api.brevo.com/v3/smtp/email", content);

            if (!response.IsSuccessStatusCode)
            {
                var errorBody = await response.Content.ReadAsStringAsync();
                throw new Exception($"Brevo email failed: {response.StatusCode} — {errorBody}");
            }
        }
    }
}
