var CPUSocket = require('./CPUSocket');

class CPUPerson {
    constructor(globalId) {
        this.id =globalId.getNext();

        this.name = this.randomName();
        this.socket = new CPUSocket(this);
        this.game = null;
        this.timeout = 500;


        this.scores = [];
        this.totalScore = 0;


        // this.socket.on('chooseFirstCard', data => {
        //     this.game.chooseFirstCard(data,this);
        // });
        // this.socket.on('playCard', data => {
        //     this.game.playCard(data,this);
        // });
        // this.socket.on('passTurn', data => {
        //     this.game.passTurn(this);
        // });

    }

    addRoundScore(score) {
        this.scores.push(score);
        this.totalScore += score;
    }

    resetName() {
        this.name = this.randomName();
    }

    randomName() {
        var action = [
          'finder','burner','starter','shouter','listener','instigator','seeker','saboteur','leader','camper'
        ];
        var noun = [
          'knife','fire','rope','brick','tree','forest','path','plane','mountain','hill','cave','cavern','pit','camp'
        ];
        return noun[Math.round(Math.random() * (noun.length-1))] + '-' + action[Math.round(Math.random() * (action.length-1))];
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

    hasSocket(socket) {
        return (socket === this.socket);
    }

    emit(type,data) {
        // Make sure we have our own data
        data = JSON.parse(JSON.stringify(data));

        setTimeout(() => {
            switch (type) {
                case 'dealCards':
                    this.reactDealCards(data);
                    break;
                case 'playFirstCard':
                    this.reactPlayFirstCard(data);
                    break;
                case 'playCard':
                    this.reactPlayCard(data);
                    break;
                case 'playerPass':
                    this.reactPlayerPass(data);
                    break;
                case 'showScore':
                    this.reactShowScore(data);
                    break;
                default:
                    console.log('CPU emit' ,type,data);
            }
        },this.timeout);

    }

    reactDealCards(data) {
        this.cards = data.cards;
        if(data.startGame) {
            setTimeout(() => {
                this.chooseFirstCard();
            },this.timeout);
        }
    }

    reactPlayFirstCard(data) {
        var card = this.game.gameRound.findCard(data.color, data.number);
        if( ! card.personCanPlayCard(this) ) {
            return;
        }
        this.game.playCard(data,this);
    }

    reactPlayCard(data) {
        if(data.yourTurn) {
            this.takeTurn();
        }
    }

    reactPlayerPass(data) {
        if(data.yourTurn) {
            this.takeTurn();
        }
    }

    reactShowScore(data) {
        this.game.scoreDone(this);
    }

    takeTurn() {
        var cards = this.game.gameRound.getPlayerHand(this);
        console.log('play',cards);
        var cards = cards.filter(card => {
            return this.game.gameRound.cardAllowedOnTable(card);
        });
        if(cards.length > 0) {

            this.game.playCard(cards[Math.round(Math.random() * (cards.length - 1))].export(),this);
        } else {
            this.game.passTurn(this);
        }
    }

    chooseFirstCard() {
        var colors = this.game.gameRound.colors;
        var color = colors[Math.floor(Math.random() * colors.length)];
        var number = Math.round(Math.random() * 7) + 2;

        this.game.chooseFirstCard({color:color,number:number},this);


    }
}

module.exports = CPUPerson;