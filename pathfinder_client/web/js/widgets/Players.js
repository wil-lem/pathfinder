class Players {
    constructor(parent, socket) {
        this.parent = parent;
        this.players = [];
        if(socket === undefined) {
            socket = this.parent.socket;
        }
        this.socket = socket;

        this.subscribed = [];;


        this.socket.on('updatePlayerList', data => {
            this.updatePlayersList(data);
        });
    }

    updatePlayersList(list) {
        this.players = list;

        this.subscribed.forEach(subscriber => {
            if (subscriber.updatePlayerList !== undefined) {
                subscriber.updatePlayerList(list);
            }
        });
    }

    subscribe(subscriber) {
        if(this.subscribed.indexOf(subscriber) < 0) {
            this.subscribed.push(subscriber);

            if (subscriber.updatePlayerList !== undefined) {
                subscriber.updatePlayerList(this.players);
            }
        }
    }

    unsubscribe(subscriber) {
        var index = this.subscribed.indexOf(subscriber);
        if(index >= 0) {
            this.subscribed.splice(index,1);
        }
    }
}
