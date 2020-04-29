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

        this.players = new GameRoundPlayers(this.wrapper);

        this.parent.players.subscribe(this.players);


        this.playAreaWrapper = Interactions.createDiv({class:'play-area-wrapper'});
        this.playArea = Interactions.createDiv({class:'play-area'});
        this.addToWrapper(this.playAreaWrapper);
        this.playAreaWrapper.appendChild(this.playArea);


        this.handArea = new Hand(this)
        this.addToWrapper(this.handArea.getElement());


        for(var i in this.cards) {
            this.handArea.addCard(this.cards[i]);
        }

        if(this.startGame) {
            this.chooseFirstCardElement = new ChooseFirstCard(this.playAreaWrapper,this);
        }
        this.buttons = Interactions.createDiv({class:'hand-buttons'});
        this.wrapper.appendChild(this.buttons);


        this.passButton = new Button('Pass',this.buttons);
        this.passButton.addClass('pass-button').disable().onClick(()=>{
            this.passTurn();
        });
        this.passButton.adFaIcon('hand-paper');

        this.playButton = new Button('Play',this.buttons);
        this.playButton.addClass('play-button').disable().onClick(()=>{
           this.playCard();
        });
        this.playButton.adFaIcon('play');

        this.scoreModal = new ScoreModal(this.wrapper,this);

        this.handArea.resize();
        window.addEventListener("resize",() => {
            this.resize()
        });
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
                this.handArea.removeCard(this.cards[i]);
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



    }

    resize() {

        var bbWindow = document.body.getBoundingClientRect();
        var bbHand = this.handArea.getElement().getBoundingClientRect();
        var h = bbWindow.height - bbHand.height;
        var bbPlay = this.playArea.getBoundingClientRect();
        var w = bbPlay.width;

        var padding = 10;
        var stemSpacing = 5;
        var verticalSpacingFactor = .2;
        var verticalStemSpacingFactor = .65;
        h -= 2*padding;
        w -= 2*padding;

        var cardH = (w - 4 * stemSpacing) / 5;
        var cardRatio = 140/90;
        var cardW = cardH / cardRatio;

        // We know card size based on the width of the container, but we may be wrong
        // check what this meanse for the height
        var targetH = 0;
        var stemNumber = null;

        var baseX = 0;
        var baseY = 0;

        // In a full set to 1 and the 10 have to be fully shown
        targetH += 2*cardH;
        // There's always 1 stem card all others take up the vertical spacing
        targetH += 7*verticalSpacingFactor * cardH;
        // Add spacing to keep middle card visible
        targetH += verticalStemSpacingFactor * cardW

        if(targetH > h) {

            // Recalculate everything based on height
            // h = 2 * cardH + 7 * verticalSpacing * cardH + verticalStemSpacingFactor * cardW
            // cardW = cardH / cardRatio
            // h = 2 * cardH + 7 * verticalSpacing * cardH + verticalStemSpacingFactor * cardH *  1/cardRatio
            // h = (2 + 7 * verticalSpacing + verticalStemSpacingFactor / cardRatio) * cardH
            // h/(2 + 7 * verticalSpacing + verticalStemSpacingFactor / cardRatio) = cardH
            cardH = h / (2 + 7 * verticalSpacingFactor + verticalStemSpacingFactor / cardRatio);
            cardW = cardH/cardRatio;

            baseX = (w - cardH * 5 - stemSpacing * 4) / 2;
        } else {
            baseY = (h - targetH) / 2;
        }

        // if(cardW > 100) {
        //     cardW = 100;
        //     cardH = cardW * cardRatio;
        // }


        this.playArea.style.height = h + 'px';

        this.tableCards.forEach(card => {
            card.setWidth(cardW);
            if(card.distance === 0) {
                stemNumber = card.number;
            }
        });


        var colors = [];

        this.tableCards.forEach(card => {
            if(colors.indexOf(card.color) < 0) {
                colors.push(card.color);
            }

            var top = padding + baseY;
            var topDistance = 10-card.number;
            top += topDistance * cardH * verticalSpacingFactor;


            if(card.number === stemNumber) {
                top += cardW / 2;
                top += verticalStemSpacingFactor * cardW / 2;
            }

            if(card.number < stemNumber) {
                // top += verticalStemSpacingFactor * cardW;
                top += cardH;
            }

            var left = baseX + padding + (cardH/2 - cardW/2) + colors.indexOf(card.color) * (cardH + stemSpacing);

            card.updateCss(top,left,cardW,cardH);
        });

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