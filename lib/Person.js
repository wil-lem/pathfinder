class Person {
    constructor(name,socket,globalId) {
        this.idGen = globalId
        this.name = name;
        this.socket = socket;
        this.game = null;
        this.id =globalId.getNext();

        this.dates = {
            created: new Date(),
            modified: new Date()
        };

        this.scores = [];
        this.totalScore = 0;


        this.socket.on('startTheGame', data => {
            this.game.startTheGame(this);
        });

        this.socket.on('addCpuPlayer', data => {
            this.game.addCpuPlayer(this);
        });

        this.socket.on('chooseFirstCard', data => {
            this.game.chooseFirstCard(data,this);
        });

        this.socket.on('playCard', data => {
            this.game.playCard(data,this);
        });

        this.socket.on('passTurn', data => {
            this.game.passTurn(this);
        });

        this.socket.on('scoreDone', data => {
            this.game.scoreDone(this);
        });


    }

    addRoundScore(score) {
        this.scores.push(score);
        this.totalScore += score;
    }

    hasSocket(socket) {
        return (this.socket == socket);
    }

    export() {
        return {
            name: this.name,
        }
    }

    hasName(name) {
        return (name === this.name);
    }

    getName() {
        return this.name;
    }

    emitError(message) {
        this.emit('errorMessage',{message: message});
    }

    emit(type,data) {
        this.socket.emit(type,data);
    }
}

module.exports = Person;