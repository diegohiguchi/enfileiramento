var amqp = require('amqplib');
var gcm = require('./node_modules/node-gcm');
var respHandler = require('./utils/responseHandler.js');
var helpers = require('./helpers');
var http = require('http');


function teste(req, res) {
   res.send('ok');
}

amqp.connect('amqp://jypqltqo:7FqRtM6HbAcIE4K97MNp6YTwLOSUce1S@jaguar.rmq.cloudamqp.com/jypqltqo')
    .then(function (conn) {
        console.log('Conectado!');
        return conn.createChannel();
    }).then(function (ch) {
        console.log('Canal Criado!');



        setInterval(function () {
            console.log('enviando mensagem');
            ch.sendToQueue('mensagens', new Buffer('Hello World!'));
            teste()
        }, 1000);


    });


//      var deviceTokens = "APA91bGDQxY0xriIDBFM9BbzDZ978_Xb4H6LGZtV4pXAZ-hVzbk7mOG6buw07NuPhx8y9K_M1AFPtHJQRXRavrg1qTSWGeOixp1ig3rKOIHnedm1fjMnp2g";
// 
//                 //var device_tokens = ['APA91bFbfmBrXe5v8eobqZxqg44CreOxdzP_EFQ9jFfDkpyHhsblgz8BNe-F_VsX9ODLxWh7w6i3HYQgwn9iQsHbTNhB-vuOzuP7iZqpXhgDF5y9tTGRngdQGz3SvFZuRszkdcw4_7EM'];
//                 var message = new gcm.Message();
//                 var sender = new gcm.Sender('AIzaSyAxWfrbEBE6XtZkyARfp6dVEsCmzRzS9eE');
// 
//                 message.addData('title', 'teste');
//                 message.addData('message', 'rabbit');
//                 //message.addData('icon', "ic_launcher");
//                 message.addData('sound', '');
// 
//                 message.collapseKey = 'testing';
//                 message.delayWhileIdle = true;
//                 message.timeToLive = 3;
// 
//                 console.log('sending to: ' + deviceTokens);
// 
//                 //deviceTokens.push(deviceTokens);
// 
//                 sender.send(message, deviceTokens, 4, function (result) {
//                     console.log(result);
//                 });