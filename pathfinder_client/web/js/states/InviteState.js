class InviteState extends BaseState {

    setData(data) {
        this.name = data.person.name;
        this.token = data.game.token;
    }

    createHTML() {
        this.gameStart = null;

        this.center = Interactions.createDiv({class:'center-block'});

        var token = Interactions.createCopyWidget(this.parent.getBaseURL() + '/?game=' + this.token,this.parent.getMessageHandler());

        var name = Interactions.createDiv();
        name.innerHTML = '<h2>Welcome ' + this.name + '</h2>Share this URL to invite others<br>';

        this.center.appendChild(name);
        this.center.appendChild(token);

        this.addCpu = new Button('Add CPU',this.center);
        this.addCpu.onClick(() => {
           this.addCpuPlayer();
        }).adFaIcon('microchip');



        this.addToWrapper(this.center);

        super.createHTML();
    }

    addCpuPlayer() {
        this.parent.addCpuPlayer();
    }

    enableGameStart(data) {
        if(this.gameStart === null) {
            this.gameStart = Interactions.createDiv({class: 'button'});
            this.center.appendChild(this.gameStart);
            this.gameStart.textContent = 'Start game';

            this.gameStart.onclick = () => {
                this.parent.startTheGame();
            }
        }
    }

    waitGameStart(data) {
        if(this.gameStart === null) {
            this.gameStart = Interactions.createDiv({class: 'wait-text'});
            this.center.appendChild(this.gameStart);

        }
        this.gameStart.innerHTML = 'Wating for <em>' + data.creator + '</em> to start the game.';
    }
}