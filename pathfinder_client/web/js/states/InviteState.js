class InviteState extends BaseState {

    setData(data) {
        this.name = data.person.name;
        this.token = data.game.token;
    }

    createHTML() {
        this.gameStart = null;

        this.center = new Modal(this.wrapper);

        var token = Interactions.createCopyWidget(this.parent.getBaseURL() + '/?game=' + this.token,this.parent.getMessageHandler());


        var name = Interactions.createDiv();
        name.innerHTML = '<h2>Welcome ' + this.name + '</h2>Share this URL to invite others<br>';

        this.center.addToLeft(name);
        this.center.addToLeft(token);

        this.addCpu = new Button('Add CPU');
        this.addCpu.addClass('buton-blue');
        this.addCpu.onClick(() => {
           this.addCpuPlayer();
        }).adFaIcon('microchip');

        this.center.addToRight(this.addCpu.getElement());

        var playersWrapper = Interactions.createDiv({class: 'players-wrapper fieldset'});
        Interactions.addHeader(playersWrapper,'Players');
        this.playersUL = Interactions.createElement('ul',{class: 'player-list'});
        playersWrapper.appendChild(this.playersUL);
        this.parent.players.subscribe(this);

        this.center.addToRight(playersWrapper);



        super.createHTML();
    }

    updatePlayerList(list) {
        this.playersUL.innerHTML = '';
        list.forEach(player => {
           var playerElement = Interactions.createElement('li',undefined,this.playersUL);
           Interactions.createPlayer(player,playerElement);
        });

    }

    addCpuPlayer() {
        this.parent.addCpuPlayer();
    }

    enableGameStart(data) {
        if(this.gameStart === null) {
            this.gameStart = new Button('Start',this.center);
            this.gameStart.adFaIcon('hiking');
            this.gameStart.onClick(() => {
                this.parent.startTheGame();
            });
        }
    }

    waitGameStart(data) {
        if(this.gameStart === null) {
            this.gameStart = Interactions.createDiv({class: 'wait-text'});
            this.center.appendChild(this.gameStart);

        }
        this.addCpu.hide();
        this.gameStart.innerHTML = 'Wating for <em>' + data.creator + '</em> to start the game.';
    }

    remove() {
        this.parent.players.unsubscribe(this);

        super.remove();
    }
}