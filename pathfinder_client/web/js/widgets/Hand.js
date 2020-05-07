class Hand {
    constructor(wrapper) {
        this.wrapper = Interactions.createDiv({class:'hand-area'});
        this.slider  = Interactions.createDiv({class:'card-slider'},this.wrapper);
        this.cards = [];
        this.endSpacer = Interactions.createDiv({class:'end-spacer'},this.slider);

        window.addEventListener("resize",() => {
            this.resize()
        });
    }

    addCard(card) {
        this.cards.push(card);
        this.slider.appendChild(card.getElement());
    }

    getElement() {
        return this.wrapper;
    }

    resize() {
        var distance = 30;
        var count = 1;
        this.cards.forEach(card => {
            card.getElement().style.left = (distance*count) + 'px';
            count++;
        });
        this.endSpacer.style.left = distance*count + 'px';
    }

    removeCard(card) {
        this.cards.splice(this.cards.indexOf(card),1);
        this.resize();
    }

    enable() {
        this.wrapper.classList.remove('disabled')
    }

    disable() {
        this.wrapper.classList.add('disabled');
    }
}