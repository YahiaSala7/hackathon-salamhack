using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.OpenApi.Models;
using SalamHack.Data;
using SalamHack.Data.Mapping;
using SalamHack.Services;
using SalamHack.Services.Interfaces;
using SalamHack.Services.Services;

var builder = WebApplication.CreateBuilder(args);

// Add builder.Services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });

});

builder.Services.AddServiceDependencies().AddDataDependencies();
builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);
#region IdGoogleMaps
// Setup dependency injection
var services = new ServiceCollection();
services.AddHttpClient();
services.AddMemoryCache(); // Add the memory cache service
services.AddSingleton<IGeocodingService>(provider =>
{
    var httpClient = provider.GetRequiredService<HttpClient>();
    var memoryCache = provider.GetRequiredService<IMemoryCache>();
    return new GeocodingService(httpClient, "YOUR_API_KEY_HERE", memoryCache);
});

var serviceProvider = services.BuildServiceProvider();
var geocodingService = serviceProvider.GetRequiredService<IGeocodingService>();

try
{
    Console.WriteLine("Running first queries (will hit the API):");

    // Example 1: Get coordinates from address
    var address = "1600 Amphitheatre Parkway, Mountain View, CA";
    var stopwatch1 = System.Diagnostics.Stopwatch.StartNew();
    var coordinates = await geocodingService.GetCoordinatesAsync(address);
    stopwatch1.Stop();
    Console.WriteLine($"Coordinates for {address}: Latitude = {coordinates.latitude}, Longitude = {coordinates.longitude}");
    Console.WriteLine($"Time taken: {stopwatch1.ElapsedMilliseconds}ms");

    // Example 2: Calculate distance between two addresses
    var address1 = "Empire State Building, New York, NY";
    var address2 = "Statue of Liberty, New York, NY";
    var stopwatch2 = System.Diagnostics.Stopwatch.StartNew();
    var distance = await geocodingService.CalculateDistanceAsync(address1, address2);
    stopwatch2.Stop();
    Console.WriteLine($"Distance between {address1} and {address2}: {distance:F2} km");
    Console.WriteLine($"Time taken: {stopwatch2.ElapsedMilliseconds}ms");

    Console.WriteLine("\nRunning the same queries again (should hit the cache):");

    // Run the same queries again to demonstrate caching
    stopwatch1.Restart();
    coordinates = await geocodingService.GetCoordinatesAsync(address);
    stopwatch1.Stop();
    Console.WriteLine($"Coordinates for {address}: Latitude = {coordinates.latitude}, Longitude = {coordinates.longitude}");
    Console.WriteLine($"Time taken: {stopwatch1.ElapsedMilliseconds}ms");

    stopwatch2.Restart();
    distance = await geocodingService.CalculateDistanceAsync(address1, address2);
    stopwatch2.Stop();
    Console.WriteLine($"Distance between {address1} and {address2}: {distance:F2} km");
    Console.WriteLine($"Time taken: {stopwatch2.ElapsedMilliseconds}ms");

    // Example 3: Testing cache with slightly different address formats
    Console.WriteLine("\nTesting cache with slightly different address format:");
    stopwatch1.Restart();
    coordinates = await geocodingService.GetCoordinatesAsync("1600  Amphitheatre  Parkway, Mountain View, CA");
    stopwatch1.Stop();
    Console.WriteLine($"Time taken: {stopwatch1.ElapsedMilliseconds}ms (should still hit cache)");
}
catch (Exception ex)
{
    Console.WriteLine($"An error occurred: {ex.Message}");
}


#endregion

builder.Services.AddDbContext<ApplicationDbContext>(options =>
               options.UseSqlServer(builder.Configuration.GetConnectionString("TestDb")));

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
