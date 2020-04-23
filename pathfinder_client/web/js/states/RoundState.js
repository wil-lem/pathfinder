class RoundState extends BaseState {

    setData(data) {
        this.cards = [];
        this.tableCards = [];
        this.selectedCard = null;
        this.startGame = data.startGame;

        this.playing = false;
        this.myTurn = false;

        for(var i in data.cards) {
            this.createCard(data.cards[i].number,data.cards[i].color);
        }

    }

    createHTML() {
        super.createHTML();

        this.playAreaWrapper = Interactions.createDiv({class:'play-area-wrapper'});
        this.playArea = Interactions.createDiv({class:'play-area'});
        this.handArea = Interactions.createDiv({class:'hand-area'});

        this.addToWrapper(this.playAreaWrapper);

        this.playAreaWrapper.appendChild(this.playArea);

        this.addToWrapper(this.handArea);


        for(var i in this.cards) {
            this.addToWrapper(this.cards[i].getElement(),this.handArea);
        }
        if(this.startGame) {
            this.chooseFirstCardElement = new ChooseFirstCard(this.playAreaWrapper,this);
        }

        this.buttons = Interactions.createDiv({class:'hand-buttons'});
        this.handArea.appendChild(this.buttons);

        this.passButton = new Button('Pass',this.buttons);
        this.passButton.addClass('pass-button').disable().onClick(()=>{
            console.log(this);
            this.passTurn();
        });

        this.playButton = new Button('Play',this.buttons);
        this.playButton.addClass('play-button').disable().onClick(()=>{
           this.playCard();
        });

        this.scoreModal = new ScoreModal(this.wrapper,this);


    }

    scoreDone() {
        this.parent.scoreDone();

    }

    createCard(number,color) {
        var card = new Card(number,color,this);
        this.cards.push(card);
    }


    clickCard(card) {
        if(this.selectedCard == card) {
            this.selectedCard.deselect();
            this.selectedCard = null;
            this.playButton.disable();
        } else {
            if(this.selectedCard) {
                this.selectedCard.deselect();
            }
            if(this.myTurn) {
                this.playButton.enable();
            }
            card.select();
            this.selectedCard = card;
        }
    }

    playCard() {
        if(!this.selectedCard) {
            return;
        }
        this.parent.playCard({number:this.selectedCard.number,color:this.selectedCard.color});
        this.selectedCard.deselect();
        this.playButton.disable();
    }

    passTurn() {
        if(!this.myTurn) {
            return;
        }
        this.parent.passTurn();
    }

    chooseFirstCard(color, number) {
        this.chooseFirstCardElement.remove();

        this.parent.chooseFirstCard(color, number);
    }

    notifyFirstCard(color,number,userName) {
        this.askCard = new NotifyFirstCard(this.playAreaWrapper,color,number,userName);
        this.playing = true;
        this.myTurn = true;
    }

    moveCardToTable(color, number, stem, distance) {
        if(this.selectedCard) {
            this.selectedCard.deselect();
        }
        this.askCard.remove();
        this.passButton.disable();


        for(var i in this.cards) {
            if(this.cards[i].color === color && this.cards[i].number === number) {
                this.cards[i].remove();
                break;
            }
        }

        var card = new Card(number,color,parent);
        card.setStem(stem);
        card.setDistance(distance);

        this.playArea.appendChild(card.getElement());
        this.tableCards.push(card);

        this.resize();
        document.addEventListener('resize',() => {
           this.resize();
        });
    }

    resize() {
        var bb = this.playArea.boundingClientRect;

        var colors = [];
        var xPadding = 30;
        var xDistance = 146;
        var yCenter = 200; // Based on 5
        var yFirstStemOffset = 80;
        var yDistance = 27;

        for(var i in this.tableCards) {
            var card = this.tableCards[i];
            if(colors.indexOf(card.color) < 0) {
                colors.push(card.color);
            }
            var left = colors.indexOf(card.color) * xDistance + xPadding;

            var top = card.distance * 30 + 400;
            if(card.distance > 0) {
                top = yCenter - yFirstStemOffset - yDistance * (card.distance-1);
            } else if(card.distance === 0) {
                top = yCenter;
            } else {
                top = yCenter + yFirstStemOffset - yDistance * (card.distance+1)
            }

            card.randomRotate();

            top += card.offsetY;
            left += card.offsetX;



            card.element.style.top = top + 'px';
            card.element.style.left = left + 'px';
        }
    }

    setTurn(turn) {
        this.myTurn = turn;
        if(this.myTurn) {
            this.passButton.enable();
        } else {
            this.passButton.disable();
        }
    }

    showScore(data) {
        this.scoreModal.showScore(data)
    }

}