using System.Text;
using RabbitMQ.Client;

namespace learning.Services;


public class RabbitMQPublisher
{

    private readonly RabbitMQConsumer consumer;

    private readonly IConnectionFactory connectionFactory;
    private readonly IConnection connection;
    private readonly IModel channel;

    public int currQueueIndex;

    public RabbitMQPublisher(IConnectionFactory _connectionFactory, RabbitMQConsumer _consumer)
    {

        //constructor
        connectionFactory = _connectionFactory;
        connection = connectionFactory.CreateConnection();
        channel = connection.CreateModel();
        consumer = _consumer;

        var numberOfQueues = 5;
        currQueueIndex = 0;

        for (int i = 0; i < numberOfQueues; i++)
        {
            channel.QueueDeclare(queue: $"queue{i}",
                     durable: false,
                     exclusive: false,
                     autoDelete: false,
                     arguments: null);

        }
    }

    public async void  SendChunk(string chunks)
    {

        if (currQueueIndex == 5)
        {
            currQueueIndex = 0;
        }
        var body = Encoding.UTF8.GetBytes(chunks);

        // var properties = channel.CreateBasicProperties();
        // properties.Persistent = true;

        channel.BasicPublish(exchange: string.Empty,
                             routingKey: $"queue{currQueueIndex}",
                             basicProperties: null,
                             body: body);

        consumer.StartListeningToQueue(currQueueIndex);

        currQueueIndex += 1;

    }


}

