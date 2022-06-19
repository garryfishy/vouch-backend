const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const mongo = require('mongodb').MongoClient;
const client = require('socket.io')(4000);
const router = require('./routes');
mongo.connect(
  'mongodb+srv://vouchtesting:vouch12345@chatvouch.tapkwvx.mongodb.net/?retryWrites=true&w=majority',
  (err, db) => {
    if (err) {
      throw err;
    }

    console.log('Connected to mongoDB');
    client.on('connection', function () {
      let chat = db.collection('chat');

      sendStatus = function (s) {
        socket.emit('status', s);
      };

      chat
        .find()
        .limit(100)
        .sort({ _id: 1 })
        .toArray(function (err, res) {
          if (err) {
            throw err;
          }
          socket.emit('output', res);
        });

      socket.on('input', function (data) {
        let { name, message, room } = data;
        if (name === '' || message === '') {
          sendStatus('Please enter a name or message');
        } else {
          chat.insert({ name, message, room }, function () {
            client.emit('output', [data]);

            sendStatus({
              message: 'Message sent',
              clear: true,
            });
          });
        }
      });
      socket.on('clear', function (data) {
        chat.remove({}, function () {
          socket.emit('cleared');
        });
      });
    });
  }
);
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
