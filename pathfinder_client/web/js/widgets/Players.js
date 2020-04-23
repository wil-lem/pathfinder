class Players {
    constructor(parent) {
        this.parent = parent;
        this.socket = this.parent.socket;
        this.wrapper = Interactions.createDiv({class:'player-wrapper'});
        this.parent.wrapper.appendChild(this.wrapper);

        this.wrapper.style.display = 'none';

        Interactions.addHeader(this.wrapper,'Players', true, true);

        this.playersList = Interactions.createElement('ul');
        this.wrapper.appendChild(this.playersList);


        this.socket.on('updatePlayerList', data => {
            this.updatePlayersList(data);
        });
    }

    updatePlayersList(list) {
        this.playersList.innerHTML = '';
        for(var i in list) {
            var listItem = Interactions.createElement('li');
            listItem.textContent = list[i];
            this.playersList.appendChild(listItem);
        }

    }

    show() {
        this.wrapper.style.display = 'block';
    }
}