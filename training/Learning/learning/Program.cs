using learning.Services;
using RabbitMQ.Client;

var builder = WebApplication.CreateBuilder(args);

{
    // Add services to the container.

    builder.Services.AddControllers();

    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    //creating the connectionfactory for rabbitmq
    builder.Services.AddSingleton<IConnectionFactory>(sp =>
    {
        var factory = new ConnectionFactory { HostName = "localhost" };
        return factory;
    });

    //adding some more services
    builder.Services.AddSingleton<RabbitMQPublisher>();
    builder.Services.AddSingleton<RabbitMQConsumer>();

    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowAllOrigins",
            builder =>
            {
                builder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader();
            });
    });

    // builder.Services.AddTransient<RabbitMQConsumer>();//Add transient is for making the consumer trigger once post is made and stop once its finished
}

var app = builder.Build();

{
    // Configure the HTTP request pipeline./ middlewares

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();

    app.UseAuthorization();
    app.UseCors("AllowAllOrigins");
    app.MapControllers();
}

app.Run();