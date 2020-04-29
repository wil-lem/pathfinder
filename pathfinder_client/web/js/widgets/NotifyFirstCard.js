class NotifyFirstCard {
    constructor(wrapper, color, number, userName) {
        this.modal = new Modal(wrapper);
        this.modal.addClass('notify-first-card');

        var text = Interactions.createDiv();
        text.innerHTML = '<em>' + userName + '</em> asked for the ' + color + ' ' + number;
        this.modal.addToLeft(text);

        var card = new Card(number,color);
        this.modal.addToLeft(card.getElement());


    }

    remove() {
        this.modal.remove();
    }

}