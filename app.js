const Express = require("express")();
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http,{ origins: '*:*'});


const dotenv = require('dotenv');
dotenv.config();

var Person = require('./lib/Person');
var Game = require('./lib/Game');

var persons = [];
var games = [];
var id = 1;

Http.listen(process.env.LISTEN_PORT, () => {
    console.log('Listening at ' + process.env.LISTEN_PORT);
});

var GlobalId = function() {
    this.id = 1;
};

GlobalId.prototype.getNext = function() {
    this.id++;
    return this.id;
}

var globalId = new GlobalId();

Socketio.on("connection", socket => {

    for (var i in persons) {
        if (persons[i].isSocket(socket)) {
            console.log('reconnect');
            return;
        }
    }

    for (var i in games) {
        if (games[i].hasSocket(socket)) {
            console.log('reconnect to game', games[i].getPlayerBySocket(socket));
            return;
        }
    }

    // socket.emit("position", position);
    // socket.emit("test2", {no:'dacsdrdta'});
    // socket.on("move", data => {
    //     switch(data) {
    //         case "left":
    //             position.x -= 5;
    //             Socketio.emit("position", position);
    //             break;
    //         case "right":
    //             position.x += 5;
    //             Socketio.emit("position", position);
    //             break;
    //         case "up":
    //             position.y -= 5;
    //             Socketio.emit("position", position);
    //             break;
    //         case "down":
    //             position.y += 5;
    //             Socketio.emit("position", position);
    //             break;
    //     }
    // });

    socket.on('startNewGame', data => {
        if (data.nickname === undefined || data.nickname.length < 4) {
            socket.emit('errorMessage', {message: 'Please enter a name of at least 4 characters'});
            return;
        }

        // First create a person
        var person = new Person(data.nickname, socket,globalId);

        // Create a new game
        var game = new Game(person, globalId);

        games.push(game);

        socket.emit('joinGame', {game: game.export(), person: person.export()});

        // var person = new Person(data.nickname,socket);
        // persons.push(person);

    });

    socket.on('joinGame', data => {
        var game = null;
        if (data.token === undefined) {
            socket.emit('errorMessage', {message: 'Game not found'});
            return;
        }
        for (var i in games) {

            if (games[i].hasToken(data.token)) {
                game = games[i];
            }
        }
        if (!game) {
            socket.emit('errorMessage', {message: 'Game not found.'});
            return;
        }

        if (data.nickname === undefined || data.nickname.length < 4) {
            socket.emit('errorMessage', {message: 'Please enter a name of at least 4 characters'});
            return;
        }

        if (game.hasPlayer(data.nickname)) {
            socket.emit('errorMessage', {message: 'Name is already in use'});
            return;
        }

        if (game.isMaxPlayers()) {
            socket.emit('errorMessage', {message: 'Game is full'});
            return;
        }

        if (game.isStarted()) {
            socket.emit('errorMessage', {message: 'Game is isStarted'});
            return;
        }

        var person = new Person(data.nickname, socket, globalId);
        game.addPlayer(person);

        person.emit('joinGame', {game: game.export(), person: person.export()});

        if (game.isMinPlayers()) {
            game.emitMinPlayersReached();
        }
    });
});
