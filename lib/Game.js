
var GameRound = require('./GameRound');
var CPUPerson = require('./CPUPerson');

class Game {
    constructor(person,globalId) {
        this.idGen = globalId;
        this.id = globalId.getNext();
        this.players = [];
        this.creator = person;
        this.token = this.generateToken(30);

        this.started = false;

        this.minPlayerCount = 2;
        this.maxPlayerCount = 5;

        this.gameRound = null;
        this.prevRounds = [];

        this.startPlayer = null;

        this.addPlayer(person);
    };

    generateToken(length) {
        //edit the token allowed characters
        var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
        var b = [];
        for (var i = 0; i < length; i++) {
            var j = (Math.random() * (a.length - 1)).toFixed(0);
            b[i] = a[j];
        }
        return b.join("");
    }

    export() {
        return {
            token: this.token,
        }
    }

    hasToken(token) {
        return (token === this.token);
    }

    hasPlayer(name) {
        for(var i in this.players) {
            if(this.players[i].hasName(name)) {
                return true;
            }
        }
        return false;
    }

    hasSocket(socket) {
        if(this.getPlayerBySocket(socket)) {
            return true;
        }
        return false;
    }

    isMinPlayers() {
        return (this.players.length >= this.minPlayerCount);
    }

    isMaxPlayers() {
        return (this.players.length >= this.maxPlayerCount);
    }

    isStarted() {
        return this.started;
    }

    getPlayerBySocket(socket) {
        for(var i in this.players) {
            if(this.players[i].hasSocket(socket)) {
                return this.players[i];
            }
        }
        return false;
    }

    addPlayer(person) {
        this.players.push(person);
        this.emitToAll('regularMessage',{message:person.getName() + ' has joined the game.'});
        this.updatePlayerList();

        person.game = this;
    }

    updatePlayerList() {
        var list = [];

        this.players.forEach(player => {
            var data = {
                name: player.getName(),
                id: player.id,
                cardCount: (this.gameRound) ? this.gameRound.getPlayerCardCount(player) : null,
                roundTurn: (this.gameRound && this.gameRound.isPLayerTurn(player)),
                gameTurn: (this.gameRound && this.gameRound.isStartPlayer(player)),
            };
            list.push(data);
        });

        this.players.forEach(player => {
            // Make sure we have our own copy of the data
            var playerData = JSON.parse(JSON.stringify(list));
            player.updatePlayerList(playerData);
        });
    }



    startTheGame(player) {
        if(this.players.length < this.minPlayerCount) {
            player.emitError('Not enough players');
            return;
        }

        this.started = true;

        this.shufflePlayers();
        this.nextStartPlayer();

        this.gameRound = new GameRound(this);
        this.gameRound.setStartPlayer(this.startPlayer);
        this.gameRound.init();

        this.updatePlayerList();
    }


    nextStartPlayer() {
        if(this.startPlayer === null) {
            this.startPlayer = this.players[0];
            return;
        }

        var index = this.players.indexOf(this.startPlayer) + 1;
        if(this.players[index] === undefined) {
            index = 0;
        }
        this.startPlayer = this.players[index];
    }

    addCpuPlayer(player) {
        if(this.players.length >= this.maxPlayerCount) {
            player.emitError('Max players reached');
            return;
        }

        var cpuPlayer = new CPUPerson(this.idGen);
        while(this.hasPlayer(cpuPlayer.name)) {
            cpuPlayer.resetName();
        }

        this.addPlayer(cpuPlayer);

        if (this.isMinPlayers()) {
            this.emitMinPlayersReached();
        }
    }

    shufflePlayers() {
        var players = this.players.slice(0);
        this.players = [];
        while(players.length > 0) {
            var randomIndex = Math.round(Math.random() * (players.length - 1));
            var player = players.splice(randomIndex,1);
            this.players.push(player[0]);
        }
    }

    chooseFirstCard(data,person) {
        if(!this.gameRound) {
            person.emitError('No game round');
            return;
        }
        this.gameRound.chooseFirstCard(data,person);
    }

    playCard(data,person) {
        if(!this.gameRound) {
            person.emitError('No game round');
            return;
        }

        this.gameRound.playCard(data,person);
    }

    passTurn(person) {
        if(!this.gameRound) {
            person.emitError('No game round');
            return;
        }
        this.gameRound.passTurn(person);
    }

    scoreDone(person) {
        this.gameRound.scoreDone(person);
    }

    nextGameRound() {
        this.prevRounds.push(this.gameRound);
        this.nextStartPlayer();

        this.gameRound = new GameRound(this);
        this.gameRound.setStartPlayer(this.startPlayer);
        this.gameRound.init();

        this.updatePlayerList();

    }

    getPlayers() {
        return this.players;
    }

    emitMinPlayersReached() {

        this.emitToCreator('enableGameStart');
        this.emitToOthers(this.creator,'waitGameStart',{creator: this.creator.getName()});
    }


    emitToAll(type, data) {
        for(var i in this.players) {
            this.players[i].emit(type,data);
        }
    }

    emitToCreator(type,data) {
        this.creator.emit(type,data);
    }

    emitToOthers(excludePerson,type,data) {
        for(var i in this.players) {
            if(this.players[i] !== excludePerson) {
                this.players[i].emit(type,data);
            }
        }
    }

    emitErrorToAll(message) {
        this.emitToAll('errorMessage',{message: message});
    }

}



module.exports = Game;
