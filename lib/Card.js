class Card {
    constructor(number,color) {
        this.color = color;
        this.number = number;
        this.value = (number === 1) ? 15 : number;
        this.state = 'stack';
        this.owner = null;
    }

    setOwner(owner) {
        this.owner = owner;
        this.setState('hand')
        return this;
    }

    setState(state) {
        this.state = state;
        return this;

    }

    getValue() {
        return this.value;
    }

    hasOwner(person) {
        return (person === this.owner);
    }

    isInHand() {
        return (this.state === 'hand');
    }

    isOnTable() {
        return (this.state === 'hand');
    }

    isInHandOfPerson(person) {
        return (this.hasOwner(person) && this.isInHand());
    }

    export() {
        return {
            color: this.color,
            number: this.number,
        }
    }

    personCanPlayCard(person) {
        if(this.owner !== person) {
            return false;
        }
        if(this.state !== 'hand') {
            return false;
        }
        return true;
    }

    play() {
        this.state='table';
    }
}

module.exports = Card;