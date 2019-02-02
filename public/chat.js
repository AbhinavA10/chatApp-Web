$(function () { // the $() indicates jQuery function
    var socket = io.connect('http://localhost:3000') // client makes a connection to the server

    var message = $("#message")
    var username = $("#username")
    var send_message = $("#send_message")
    var send_username = $("#send_username")
    var chatroom = $("#chatroom")
    var feedback = $("#feedback")
    var userIsTyping = false;
    var timeout = undefined;
    var userIsTyping = false;
    var timeout = undefined;

    send_username.click(function () { // when the user clicks on the change username button, send a message to server through socket
        console.log(username.val());
        socket.emit('change_username', {
            username: username.val()
        });
    });

    socket.on("new_message", (data) => { // listen for a new message, and when triggered, display the new message on local user's screen
        console.log(data);
        chatroom.append("<p class = 'message'>" + data.username + ":  " + data.message + "</p>");

    });

    send_message.click(function () { // when user clicks send, send a message to the server
        socket.emit('new_message', {
            message: message.val()
        });
        $("#message").val(""); // to clear input text field when button is pressed
    });
    message.bind("keypress", () => { // send a message to server that current user is typing
        if (!userIsTyping) {
            userIsTyping = true
            socket.emit('typing');
            timeout = setTimeout(timeoutFunction, 1000);
        } else {
            clearTimeout(timeout);
            timeout = setTimeout(timeoutFunction, 1000);
        }
    });
    socket.on('typing', (data) => { // get info if another user is typing
        $("#feedback").html("<p><b>" + data.username + " </b> <i> is typing a message... </i></p>");
    });

    socket.on('no_longer_typing', (data) => { // get info if another user has stopped typing
        $("#feedback").html("");
        console.log("Client: received other's not typing");
    });

    function timeoutFunction() {
        userIsTyping = false;
        socket.emit('no_longer_typing');
        console.log("current user not typing");
    }
});