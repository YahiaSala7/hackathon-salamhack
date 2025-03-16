using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using SalamHack.Data;
using SalamHack.Data.Mapping;
using SalamHack.Services;

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
