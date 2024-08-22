using System.Text;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using MySql.Data.MySqlClient;
using System.Diagnostics;
using Microsoft.AspNetCore.Components.RenderTree;


namespace learning.Services;


public class RabbitMQConsumer
{

    private readonly IConnectionFactory connectionFactory;
    private readonly IConnection connection;

    // private MySqlConnection mySQLConnection;
    private readonly IModel channel;

    public IConfiguration? configuration;//this will store the configuration settings present in appsetting.json
    private readonly string? dbConnString;//this is the string required to connect to mysql db


    public int currQueueIndex = 0;

    public RabbitMQConsumer(IConfiguration _configuration, IConnectionFactory _connectionFactory)
    {
        //constructor
        connectionFactory = _connectionFactory;
        connection = connectionFactory.CreateConnection();
        channel = connection.CreateModel();


        //constructor
        configuration = _configuration;//updating the value
        dbConnString = configuration.GetConnectionString("DBConnectionString");//updating the value

        // mySQLConnection = new MySqlConnection(dbConnString);

        var numberOfQueues = 5;

        for (int i = 0; i < numberOfQueues; i++)
        {
            channel.QueueDeclare(queue: $"queue{i}",
                     durable: false,
                     exclusive: false,
                     autoDelete: false,
                     arguments: null);

        }
    }

    public async void StartListeningToQueue(int queueNumber)
    {


        var consumer = new EventingBasicConsumer(channel);//creating a consumer that can listen to queue

        consumer.Received += async (model, ea) =>
        {
            //this is event that is triggered as the queue has got some data in it
            //dealing with body once received
            var body = ea.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);

            //call functiont to insert in db
            // Console.WriteLine("calling insert to db");
            await InsertToDB(message, queueNumber);
        };
        //listening to queue

        channel.BasicConsume(queue: $"queue{queueNumber}",
                             autoAck: true,
                             consumer: consumer);


    }

    public async Task InsertToDB(string query, int queueN)
    {
        //inserting to db
        // Console.WriteLine("Inside db");
        // Console.WriteLine("a");


        await Task.Run(() =>
    {
        using (var mySQLConnection = new MySqlConnection(dbConnString))
        {
            mySQLConnection.Open();
            using (var command = new MySqlCommand(query.ToString(), mySQLConnection))
            {
                command.ExecuteNonQuery();
            }
            mySQLConnection.Close();
        }
    });


        // Console.WriteLine("jiefr");

        // Console.WriteLine($"Entererd data for queue{queueN}");


    }

}