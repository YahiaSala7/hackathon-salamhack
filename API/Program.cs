using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SalamHack.Data;
using SalamHack.Data.Entity.Identity;
using SalamHack.Data;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add builder.Services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });

    // Add JWT Authentication description
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\""
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});


builder.Services.AddIdentity<User, Role>(option =>
{
    // Password settings.
    option.Password.RequireDigit = false;
    option.Password.RequireLowercase = false;
    option.Password.RequireNonAlphanumeric = false;
    option.Password.RequireUppercase = false;
    option.Password.RequiredLength = 6;
    option.Password.RequiredUniqueChars = 0;

    // Lockout settings.
    option.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
    option.Lockout.MaxFailedAccessAttempts = 5;
    option.Lockout.AllowedForNewUsers = true;

    // User settings.
    option.User.AllowedUserNameCharacters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
    option.User.RequireUniqueEmail = true;
    option.SignIn.RequireConfirmedEmail = true;

}).AddEntityFrameworkStores<ApplicationDbContext>().AddDefaultTokenProviders();

//JWT Authentication
var jwtSettings = new JwtSettings();
var emailSettings = new EmailSettings();
builder.Configuration.GetSection(nameof(jwtSettings)).Bind(jwtSettings);
builder.Configuration.GetSection(nameof(emailSettings)).Bind(emailSettings);

builder.Services.AddSingleton(jwtSettings);
builder.Services.AddSingleton(emailSettings);

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
   x.RequireHttpsMetadata = false;
   x.SaveToken = true;
   x.TokenValidationParameters = new TokenValidationParameters
   {
       ValidateIssuer = jwtSettings.ValidateIssuer,
       ValidIssuers = new[] { jwtSettings.Issuer },
       ValidateIssuerSigningKey = jwtSettings.ValidateIssuerSigningKey,
       IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSettings.Secret)),
       ValidAudience = jwtSettings.Audience,
       ValidateAudience = jwtSettings.ValidateAudience,
       ValidateLifetime = jwtSettings.ValidateLifeTime,
   };
});

//builder.Services.AddScoped<IUserService, UserService>();
//builder.Services.AddScoped<IProjectService, ProjectService>();
//builder.Services.AddScoped<IRoomService, RoomService>();
//builder.Services.AddScoped<IFurnitureService, FurnitureService>();
//builder.Services.AddScoped<IPriceComparisonService, PriceComparisonService>();
//builder.Services.AddScoped<ILayoutService, LayoutService>();
//builder.Services.AddScoped<IReportService, ReportService>();
//builder.Services.AddScoped<IAIRecommendationService, AIRecommendationService>();
//builder.Services.AddScoped<IPriceSearchService, PriceSearchService>();

//// Register repositories
//builder.Services.AddScoped<IUserRepository, UserRepository>();
//builder.Services.AddScoped<IProjectRepository, ProjectRepository>();
//builder.Services.AddScoped<IRoomRepository, RoomRepository>();
//builder.Services.AddScoped<IFurnitureRepository, FurnitureRepository>();
//builder.Services.AddScoped<IPriceComparisonRepository, PriceComparisonRepository>();
//builder.Services.AddScoped<ILayoutRepository, LayoutRepository>();
//builder.Services.AddScoped<IReportRepository, ReportRepository>();

//// Register external builder.Services
//builder.Services.AddScoped<IAIClient, AIClient>();
//builder.Services.AddScoped<IExternalPriceApiClient, ExternalPriceApiClient>();
//builder.Services.AddScoped<IGeocodingService, GeocodingService>();

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
