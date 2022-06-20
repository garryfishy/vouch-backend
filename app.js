const express = require('express');
const app = express();
const port = 3001;
const cors = require('cors');
const mongo = require('mongodb').MongoClient;
const socket = require('socket.io');
const router = require('./routes');
const server = app.listen(port, function () {
  console.log('server running on port 3001');
});
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const session = require('express-session');
const { time } = require('console');

const url =
  'mongodb+srv://vouchtesting:vouch12345@chatvouch.tapkwvx.mongodb.net/?retryWrites=true&w=majority';

app.use(cors);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);
let online = [];
MongoClient.connect(url, function (err, client) {
  assert.equal(null, err);
  console.log('Connected successfully to server');
  const io = socket(server, {
    allowEIO3: true,
    cors: { credentials: true, origin: 'http://localhost:8080' },
  });

  const db = client.db('ChatDB');
  io.on('connection', function (socket) {
    console.log('Socket connected');
    const chat = db.collection('chat');

    sendStatus = function (s) {
      socket.emit('status', s);
    };
    chat
      .find()
      .limit(10)
      .sort({ time: -1 })
      .toArray(function (err, res) {
        if (err) {
          throw err;
        }
        socket.emit('output', res.reverse());
      });

    socket.on('joinRoom', function (data) {
      const { username, message, roomname } = data;
      let canlogin = true;
      online.map((e) => {
        if (e.username === username && e.roomname === roomname) {
          canlogin = false;
        }
      });
      const time = new Date().toLocaleTimeString();

      if (canlogin) {
        online.push({ username, roomname });
        console.log(online);
        chat.insertOne({
          username,
          message,
          roomname,
          time,
        });

        socket.emit('status', true);
      } else {
        socket.emit('status', false);
      }
    });

    socket.on('logout', function (data) {
      const { username, roomname } = data;
      let message = `${username} has left the room`;

      online.map((e) => {
        if (e.username === username && e.roomname === roomname) {
          e.username = '';
        }
        if (e.username === '') {
          delete e;
        }
      });
      const time = new Date().toLocaleTimeString();

      chat.insertOne({
        username,
        message,
        roomname,
        time,
      });

      console.log('logged out');
    });

    socket.on('input', function (data) {
      let username = data.name;
      let message = data.message;
      let roomname = data.roomname;
      let time = new Date().toLocaleTimeString();
      chat.insertOne({
        username,
        message,
        roomname,
        time,
      });
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });

  //   client.close();
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(router);

module.exports = app;
