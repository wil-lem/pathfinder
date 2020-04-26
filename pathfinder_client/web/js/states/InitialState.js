class InitialState extends BaseState {
    createHTML() {
        this.token = undefined;

        this.inputName = Interactions.createInputText({placeholder: 'Your name'});

        this.inputName.value = 'willem ' + Math.round(Math.random() * 100);

        this.center = Interactions.createDiv({class:'center-block'});
        this.center.appendChild(this.inputName);

        this.startGameButton = new Button('Start game',this.center);
        this.startGameButton.adFaIcon('hiking');

        this.addToWrapper(this.center);



        super.createHTML();

        this.startGameButton.onClick(() => {
            var data = {
                nickname: this.inputName.value
            };

            var valid = true;
            if(data.nickname.length < 4) {
                this.parent.getMessageHandler().errorMessage('Please enter a name of at least 4 characters.');
                valid = false;
            }

            if(valid) {
                if(this.token) {
                    data.token = this.token;
                    this.parent.joinGame(data);
                } else {
                    this.parent.startNewGame(data);
                }
            }
        });

    }

    setGameToken(token) {
        this.token = token;
        this.startGameButton.textContent = 'Join game';
    }
}
