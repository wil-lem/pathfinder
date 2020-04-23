class Card {
    constructor(number,color,parent) {
        this.number = number;
        this.color = color;
        this.rotated = false;

        this.parent = (parent !== undefined) ? parent : null;

        this.element = Interactions.createDiv({class:'card card-color-'+color+' card-number-'+number});

        this.rotation = 0;

        var numberElement = Interactions.createDiv({class:'card-number'});
        numberElement.textContent = number;
        numberElement.classList.add('top-left');
        this.element.appendChild(numberElement);

        var numberElement = Interactions.createDiv({class:'card-number'});
        numberElement.textContent = number;
        numberElement.classList.add('bottom-right');
        this.element.appendChild(numberElement);

        this.element.onclick = () => {
            this.element.style.transform
            if(this.parent.clickCard !== undefined) {
                this.parent.clickCard(this);
            }
        }

        this.offsetX = 0;
        this.offsetY = 0;
    }

    select() {
        this.element.classList.add('selected');
    }

    deselect() {
        this.element.classList.remove('selected');
    }

    getElement() {
        return this.element;
    }

    remove() {
        this.element.remove();
    }

    setStem(stem) {
        if(stem) {
            this.element.classList.add('stem');
        } else {
            this.element.classList.remove('stem');
        }
    }

    setDistance(distance) {
        this.distance = distance;
        this.element.style.zIndex = Math.abs(distance)+10;
    }

    randomRotate() {
        if(!this.rotated) {
            if(this.distance !== 0) {
                this.element.style.transform = 'rotate(' + (Math.random() * 4-2) + 'deg)'
            } else {
                this.element.style.transform = 'rotate(' + (90 + Math.random() * 4-2) + 'deg)'
            }
            this.rotated = true;

            this.offsetX = (Math.random() * 4-2);
            this.offsetY = (Math.random() * 4-2);
        }
    }
}