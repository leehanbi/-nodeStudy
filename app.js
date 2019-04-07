'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

// 자신의 토큰 설정
var PAGE_ACCESS_TOKEN = 'EAAGEB4PRqdEBAFZBdE4pjmJi7Wvqe3VX9TsI2KrBvlZCGpe2UZARtifNj6n7vzigPuaBZC0ntCfluHwBkG3FPoVB8laASTZBJK3zRPNZCMJb6C3byY1uvCVz6WG19BT0NM2Hv6dLYqZASwZAKCP5Y1kyCwT5neudKVySaOO4yyvBD1zaHvD6YPSS';

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello world');
})


app.get('/webhook', (req, res) => {
    if (req.query['hub.verify_token'] === 'VERIFY_TOKEN') {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong token');
})

//페이스북 메신져
app.post("/webhook", (req, res) => {
    console.log("WEBHOOK GET IT WORKS");
    var data = req.body;
    console.log(data);

    // Make sure this is a page subscription
    if (data.object == 'page') {
        // Iterate over each entry
        // There may be multiple if batched
        data.entry.forEach((pageEntry) => {
            var pageID = pageEntry.id;
            var timeOfEvent = pageEntry.time;

            // Iterate over each messaging event
            pageEntry.messaging.forEach((messagingEvent) => {
                if (messagingEvent.optin) {
                    receivedAuthentication(messagingEvent);
                } else if (messagingEvent.message) {
                    receivedMessage(messagingEvent);
                } else if (messagingEvent.postback) {
                    receivedPostback(messagingEvent);
                } else {
                    console.log("Webhook received unknown messagingEvent: ", messagingEvent);
                }
            });
        });

        res.sendStatus(200);
    }
});

// 메세지 받고 내보내기
function receivedMessage(event) {
    var senderId = event.sender.id;
    var content = event.message.text;
    var echo_message = "ECHO : " + content;
    sendTextMessage(senderId, echo_message);
}

function receivedPostback(event) {
    console.log("RECEIVED POSTBACK IT WORKS");
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfPostback = event.timestamp;

    var payload = event.postback.payload;

    console.log("Received postback for user %d and page %d with payload '%s' " +
        "at %d", senderID, recipientID, payload, timeOfPostback);

    sendTextMessage(senderID, "Postback called");
}

function sendTextMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: recipientId },
            message: { text: message }
        }
    }, (error, response, body) => {
        if (error) {
            console.log('Error sending message: ' + response.error);
        }
    });
}

app.listen(app.get('port'), ()=> {
    console.log('running on port', app.get('port'));
})