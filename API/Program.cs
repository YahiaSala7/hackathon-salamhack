using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using SalamHack.Data;
using SalamHack.Data.Mapping;
using SalamHack.Services;
using SalamHack.Services.Interfaces;
using SalamHack.Services.Services;

var builder = WebApplication.CreateBuilder(args);

// Add builder.Services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
});

// Pass configuration to the dependency registration method
builder.Services.AddServiceDependencies(builder.Configuration)
                .AddDataDependencies();
builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);

#region IdGoogleMaps
// Setup dependency injection for GeocodingService using IHttpClientFactory and IOptions<GeocodingSettings>
builder.Services.AddHttpClient();
builder.Services.AddMemoryCache();

builder.Services.AddSingleton<IGeocodingService>(provider =>
{
    // Resolve IHttpClientFactory and create an HttpClient
    var httpClientFactory = provider.GetRequiredService<IHttpClientFactory>();
    var memoryCache = provider.GetRequiredService<IMemoryCache>();
    var geocodingOptions = Options.Create(new GeocodingSettings { ApiKey = "YOUR_API_KEY_HERE" });

    return new GeocodingService(httpClientFactory, geocodingOptions, memoryCache);
});
#endregion

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
