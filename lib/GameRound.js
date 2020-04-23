var Card = require('./Card');

class GameRound {
    constructor(game) {
        this.game = game;
        this.colors = ['red', 'green', 'black', 'blue', 'orange'];

        this.playerTurn = null;
        this.startPlayer = null;

        this.roundStarted = false;
        this.roundEnded = false;
        this.firstCard = null;

        this.cards = [];

        this.seenScoreCount = 0;
    }

    setStartPlayer(player) {
        this.startPlayer = player;
    }

    init() {
        this.generateCards();
        this.dealCards();
    }



    nextPlayerTurn() {
        var players = this.game.getPlayers();
        if(this.playerTurn === null) {
            this.playerTurn = players[0];
            return;
        }

        var index = players.indexOf(this.playerTurn) + 1;
        if(players[index] === undefined) {
            index = 0;
        }
        this.playerTurn = players[index];
        console.log('new player turn',this.playerTurn.name);
    }

    generateCards() {
        // Generate cards
        for (var i in this.colors) {
            for (var number = 1; number < 11; number++) {
                this.cards.push(new Card(number, this.colors[i]));
            }
        }
    }

    dealCards() {
        var cards = this.cards.slice(0);
        var players = this.game.getPlayers();

        while(cards.length > 0) {
            for(var i in players) {
                var player = players[i];
                if(cards.length > 0) {
                    var randomIndex = Math.round((cards.length - 1) * Math.random());
                    var card = cards.splice(randomIndex,1)[0];
                    card.setOwner(player);
                }
            }
        }

        for(var i in players) {
            var player = players[i];
            var cards = [];

            for(var i in this.cards) {
                var card = this.cards[i];
                if(card.hasOwner(player)) {
                    cards.push(card.export());
                }
            }

            player.emit('dealCards',{
                cards:cards,
                startGame:this.isStartPlayer(player),
            });
        }
    }

    getPlayerHand(player) {
        var cards = this.cards.slice(0);
        return cards.filter(card => {
            return card.personCanPlayCard(player);
        });
    }

    getPlayerHandValue(player) {
        var cards = this.getPlayerHand(player);
        var value = 0;
        cards.forEach(card => {
            value += card.getValue()
        });
        return value;
    }

    getPlayerCardCount(player) {
        var count = 0;
        for(var i in this.cards) {
            if(this.cards[i].isInHandOfPerson(player)) {
                count++;
            }
        }
        return count;
    }

    isStartPlayer(person) {
        return (person === this.startPlayer);
    }

    isPLayerTurn(person) {
        return (person === this.playerTurn);
    }

    chooseFirstCard(data,person) {

        if(! this.isStartPlayer(person)) {
            person.emitError('Incorrect player');
            return;
        }

        var allowedNumbers = [2,3,4,5,6,7,8,9];

        if( data.color === undefined || data.number === undefined) {
            person.emitError('Color or number not found');
            return;
        }
        if( allowedNumbers.indexOf(data.number) < 0 || this.colors.indexOf(data.color) < 0) {
            person.emitError('Invalid card ');
            return;
        }

        this.firstCard = this.findCard(data.color,data.number);

        data.person = person.getName();

        this.game.emitToAll('playFirstCard',data);

    }

    playCard(data, person) {
        if( data.color === undefined || data.number === undefined) {
            person.emitError('Color or number not found');
            return;
        }
        var card = this.findCard(data.color, data.number);
        if( ! card ) {
            person.emitError('Card not found');
            return;
        }
        if( ! card.personCanPlayCard(person) ) {
            person.emitError('Cannot play card');
            return;
        }

        if(!this.roundStarted) {
            if(this.firstCard !== card) {
                person.emitError('That is not the requested card');
                return;
            }

            this.playerTurn = person;

            this.cardToTable(card);

            this.roundStarted = true;

            return;

        } else {

            if(card.state !== 'hand') {
                person.emitError('Card not in hand');
                return;
            }
            if(this.playerTurn !== person) {
                person.emitError('Not your turn');
                return;
            }


            // check if the card can be played
            if(this.cardAllowedOnTable(card)) {
                this.cardToTable(card);
                return;
            }
            person.emitError('Cannot play card');
        }
    }

    cardAllowedOnTable(card) {
        var canPlay = false;
        for(var i in this.cards) {
            var checkCard = this.cards[i];

            // If the check card if not on the table, skip it
            if(checkCard.state !== 'table') {
                continue;
            }

            // Not same color but maybe stem card
            if(checkCard.color !== card.color) {
                if(this.firstCard.number === card.number) {
                    canPlay = true;
                    break;
                }
                continue;
            }

            if(checkCard.number + 1 === card.number || checkCard.number-1 === card.number) {
                canPlay = true;
                break;
            }
        }
        return canPlay;
    }


    passTurn(person) {
        if(this.playerTurn !== person) {
            person.emitError('Not your turn');
            return;
        }
        if(this.roundEnded) {
            person.emitError('Round ended');
            return;
        }
        this.nextPlayerTurn();

        var data = {yourTurn: false};
        this.game.emitToOthers(this.playerTurn,'playerPass',data);
        data.yourTurn = true;
        this.playerTurn.emit('playerPass',data);
    }

    cardToTable(card) {
        this.nextPlayerTurn();

        this.game.updatePlayerList();

        card.play();

        var roundEnd = false;
        this.game.players.forEach(person => {
            if(person.name,this.getPlayerCardCount(person) === 0) {
                roundEnd = true;
            }
        });

        if(roundEnd) {
            this.endRound();
        }

        var data = {
            card: card.export(),
            stem: (card.number === this.firstCard.number),
            yourTurn: false,
            distance: card.number - this.firstCard.number,
        };

        if(roundEnd) {
            this.game.emitToAll('playCard',data);
        } else {
            this.game.emitToOthers(this.playerTurn,'playCard',data);
            data.yourTurn = true;
            this.playerTurn.emit('playCard',data);
        }

        if(roundEnd) {
            this.showScores();
        }
    }

    endRound() {
        this.roundEnded = true;
    }

    showScores() {
        var players = [];
        this.game.players.forEach(player => {

            var score = this.getPlayerHandValue(player);
            player.addRoundScore(score);
            players.push({player:player.name,score:score,total:player.totalScore});

        });

        this.game.emitToAll('showScore',players);
    }



    scoreDone(person) {
        if(!this.roundEnded) {
            person.emitError('Round not ended');
        }
        this.seenScoreCount++;

        if(this.seenScoreCount >= this.game.players.length) {
            this.game.nextGameRound();
        }
    }



    findCard(color, number) {

        var foundCard = null;
        this.cards.forEach(card => {
           if(card.number == number && card.color == color) {
               foundCard = card;
           }
        });

        return foundCard;
    }
}

module.exports = GameRound;