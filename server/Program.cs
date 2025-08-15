using Microsoft.EntityFrameworkCore;
using server.Models;

var builder = WebApplication.CreateBuilder(args);


// Load environment variables from .env file
DotNetEnv.Env.Load();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// Load connection string from environment variable, fallback to appsettings
var connectionString = Environment.GetEnvironmentVariable("NEONDB_CONNECTION")
    ?? builder.Configuration.GetConnectionString("DefaultConnection");

// Register DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString)
);

// ✅ Set URLs before building the app
//var port = Environment.GetEnvironmentVariable("PORT") ?? "80";
//builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
    c.RoutePrefix = string.Empty; // Set Swagger UI at the app's root
});

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();



app.Run();

