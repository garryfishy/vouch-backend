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

app.use(cors);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);
mongo.connect(
  'mongodb+srv://vouchtesting:vouch12345@chatvouch.tapkwvx.mongodb.net/?retryWrites=true&w=majority',
  (err, db) => {
    if (err) {
      throw err;
    }

    console.log('Connected to mongoDB');

    const io = socket(server, {
      allowEIO3: true,
      cors: { credentials: true, origin: 'http://localhost:8080' },
    });

    io.on('connection', function (socket) {
      console.log('Socket connected');

      socket.on('testaja', function (data) {
        io.emit('testlagi', data);
      });

      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
    });
  }
);
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(router);

module.exports = app;
