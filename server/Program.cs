using Microsoft.EntityFrameworkCore;
using server.Models;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Server.Utils;
using DotNetEnv;
using System.Net.Sockets;


// Load environment variables from .env file
Env.Load();

var builder = WebApplication.CreateBuilder(args);


// ✅ Configure JWT authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings["Key"]))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddScoped<JwtService>();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddMemoryCache();

var redisConnectionString = Environment.GetEnvironmentVariable("REDIS_CONNECTION")
    ?? builder.Configuration.GetConnectionString("RedisConnection");

builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("RedisConnection");
});



// Load connection string from environment variable, fallback to appsettings
var connectionString = Environment.GetEnvironmentVariable("NEONDB_CONNECTION")
    ?? builder.Configuration.GetConnectionString("DefaultConnection");

// Register DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString)
);

builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Please enter JWT with Bearer into field. Example: 'Bearer {token}'",
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

Console.WriteLine($"SMTP_SERVER: {Environment.GetEnvironmentVariable("SMTP_SERVER")}");
Console.WriteLine($"SMTP_USERNAME: {Environment.GetEnvironmentVariable("SMTP_USERNAME")}");


try
{
    Console.WriteLine("🧪 Testing SMTP connectivity...");
    using (var client = new TcpClient())
    {
        var result = client.BeginConnect("smtp.gmail.com", 587, null, null);
        var success = result.AsyncWaitHandle.WaitOne(TimeSpan.FromSeconds(5));
        if (!success)
            Console.WriteLine("❌ Cannot connect to smtp.gmail.com:587 (connection timed out)");
        else
            Console.WriteLine("✅ Connected to smtp.gmail.com:587 successfully!");
    }
}
catch (Exception ex)
{
    Console.WriteLine($"⚠️ SMTP test failed: {ex.Message}");
}


var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
    c.RoutePrefix = string.Empty; // Swagger UI at the app's root
});


app.UseHttpsRedirection();

// ✅ IMPORTANT: Authentication must come BEFORE Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
