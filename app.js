// This is a file for the server-side

const express = require('express');
const app = express();

app.set('view engine', 'ejs'); // set the template engine ejs
app.use(express.static('public'));
app.get('/', (req, res) => { // like routing in Vue
    res.render('index')
});
server = app.listen(3000); // make the 'server' listen to app on port 3000

//configure socket.io
const io = require('socket.io')(server) // instantiate socket.io. The io object will give us access to the socket.io lib
io.on('connection', (socket) => {
    console.log('New user connected'); // server listens, and for on every new connection, console.log it
    socket.username = "Anonymous"; // when a new user connects, give user a default name of Anon
    socket.on('change_username', (data) => {
        socket.username = data.username // when the change username button is pressed, change the that user's/socket's username
    });
    socket.on('new_message', (data) => { // when server receives a new message, send it out to all users, with username and message data
        io.sockets.emit('new_message', { // sockets = all sockets connected
            message: data.message,
            username: socket.username
        });
    });
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', { // broadcast means to send to all sockets except the socket that started it
            username: socket.username
        });
    });

    socket.on('no_longer_typing', (data) => {
        socket.broadcast.emit('no_longer_typing', { // broadcast means to send to all sockets except the socket that started it
            username: socket.username
        });

        console.log("Server: received not typing");
    });
});