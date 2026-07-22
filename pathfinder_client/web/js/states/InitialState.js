class InitialState extends BaseState {
    createHTML() {
        this.center = new Modal(this.wrapper);

        this.token = undefined;
        this.inputName = Interactions.createInputText({placeholder: this.parent.t('game.yourName')});

        this.center.addToLeft(this.inputName);


        this.startGameButton = new Button(this.parent.t('game.startGame'),this.center);
        this.startGameButton.adFaIcon('hiking');


        super.createHTML();

        this.startGameButton.onClick(() => {
            var data = {
                nickname: this.inputName.value
            };

            var valid = true;
            if(data.nickname.length < 4) {
                this.parent.getMessageHandler().errorMessage(this.parent.t('game.minNameError'));
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
        this.startGameButton.setText(this.parent.t('game.joinGame'));
    }
}
