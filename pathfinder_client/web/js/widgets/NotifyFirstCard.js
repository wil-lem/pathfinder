class NotifyFirstCard {
    constructor(wrapper, color, number, userName) {
        this.wrapper = Interactions.createDiv({class:'center-block notify-first-card'});

        wrapper.appendChild(this.wrapper);


        var text = Interactions.createDiv();
        text.innerHTML = '<em>' + userName + '</em> asked for the ' + color + ' ' + number;
        this.wrapper.appendChild(text);

        var card = new Card(number,color);
        this.wrapper.appendChild(card.getElement());


    }

    remove() {
        this.wrapper.remove();
    }

}