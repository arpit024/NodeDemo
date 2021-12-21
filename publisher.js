var amqp = require('amqp-connection-manager');
var exchange = 'Subscriber';
let channelWrapper;
let connection;
let options={
    reconnectTimeInSeconds:5
}
exports.startPublisher=function(exchangeToStart=exchange){
    let url = 'amqp://'+'guest'+":"+'guest'+'@'+'localhost'+":"+5672
    connection = amqp.connect(url,options)
  connection.on('connect',()=>{console.log('Publisher Connected to Rabbitmq')})
  channelWrapper = connection.createChannel({
   json:true,
   setup: channel => channel.assertExchange(exchangeToStart, 'topic')    
  });
}
exports.publishEvent = (msg)=>{
    let routingkey=msg.routingKey
    return channelWrapper.publish(exchange, routingkey,msg).then(()=>{
        console.log("Event sent successfully with routing key :-", msg.routingKey);
    })
}

