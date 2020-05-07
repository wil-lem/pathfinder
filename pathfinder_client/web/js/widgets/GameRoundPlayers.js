class GameRoundPlayers {
    constructor(wrapper) {
        this.wrapper = Interactions.createDiv({class: 'game-players-wrapper'},wrapper);
        this.players = Interactions.createDiv({class: 'game-players'},this.wrapper);
        this.playerList = Interactions.createElement('ul',{class:'player-list'},this.players);
        this.openTab = Interactions.createDiv({class: 'fa fa-users'},this.players);
        this.openTab.onclick = () => {
            this.toggle();
        };
        this.show = false;
    }

    toggle() {
        if(this.show) {
            this.players.classList.remove('open');
        } else {
            this.players.classList.add('open');
        }
        this.show = (!this.show);
    }

    updatePlayerList(list) {
        this.playerList.innerHTML = '';
        var foundMe = false;
        list.forEach(playerData => {
            // if(foundMe) {
                var playerElement = Interactions.createElement('li',undefined,this.playerList);
                Interactions.createPlayer(playerData,playerElement);
            // } else {
            //     if(playerData.me) {
            //         foundMe = true;
            //     }
            // }
        // });
        // foundMe = false;
        // list.forEach(playerData => {
        //     if(playerData.me) {
        //         foundMe = true;
        //     }
        //     if(!foundMe) {
        //         var playerElement = Interactions.createElement('li',undefined,this.playerList);
        //         Interactions.createPlayer(playerData,playerElement);
        //     }
        });
    }
}