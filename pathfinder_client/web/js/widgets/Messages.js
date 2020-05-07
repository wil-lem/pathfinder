class Messages {
    constructor(parent) {
        this.parent = parent;
        this.socket = this.parent.socket;
        this.wrapper = Interactions.createDiv({class:'error-wrapper'});
        this.parent.wrapper.appendChild(this.wrapper);


        this.socket.on('regularMessage', data => {
            this.addMessage(data.message);
        });

        this.socket.on('errorMessage', data => {
            this.errorMessage(data.message);
        });

    }

    errorMessage(messageText,timeOut) {
        this.addMessage(messageText,timeOut,'error');
    }

    addMessage(messageText, timeOut, type) {
        var message = Interactions.createDiv({class:'message'});
        switch (type) {
            case 'error':
                message.classList.add('error-message');
                break;
            default:
                break;
        }


        message.onclick = () => {
            message.remove();
        };

        message.innerHTML += messageText;

        if(timeOut === undefined) {
            timeOut = 7000;
        }

        this.wrapper.appendChild(message);
        setTimeout(() => Interactions.fadeOut(message),timeOut);


    }

}