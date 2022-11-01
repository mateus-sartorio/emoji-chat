const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const moment = require('moment');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Run when client connects
io.on('connection', socket => {
    
    socket.on('joinRoom', ({username, emoji}) => {

        //Welcome user
        socket.emit('message', formatMessage('Message Bot', 'Welcome to LiveChat!'));

        //Broadcast when a user connects
        socket.broadcast.emit('message', formatMessage('Message Bot', `${username} ${emoji} has joined the chat.`));

        //Listen for chatMessages
        socket.on('chatMessage', messageValue => {
        io.emit('message', formatMessage(`${username} ${emoji}`, messageValue));
        });

        //Runs when client disconnects
        socket.on('disconnect', () => {
        io.emit('message', formatMessage('Message Bot', `${username} ${emoji} has left the chat.`));
        });

    });
    
});

const PORT = 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

function formatMessage(username, text) {
    return {
       username: username,
       text: text,
       time: moment().format('h:mm a')
    }
}