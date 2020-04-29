class Card {
    constructor(number,color,parent) {
        this.number = number;
        this.color = color;

        this.parent = (parent !== undefined) ? parent : null;

        this.element = Interactions.createDiv({class:'card card-color-'+color+' card-number-'+number});


        var numberElement = Interactions.createDiv({class:'card-number'});
        numberElement.textContent = number;
        numberElement.classList.add('top-left');
        this.element.appendChild(numberElement);

        var numberElement = Interactions.createDiv({class:'card-number'});
        numberElement.textContent = number;
        numberElement.classList.add('bottom-right');
        this.element.appendChild(numberElement);


        var animals = {
          red: 'dragon',
          green: 'frog',
          blue: 'hippo',
          orange: 'crow',
          black: 'spider'
        };

        this.picture = Interactions.createDiv({class:'animal fa fa-' + animals[this.color]},this.element);



        this.element.onclick = () => {
            this.element.style.transform
            if(this.parent.clickCard !== undefined) {
                this.parent.clickCard(this);
            }
        }

        this.offsetX = Math.random() - .5;
        this.offsetY = Math.random() - .5;
        this.rotate = Math.random() * 10 - 5;

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

    updateCss(x,y,w,h) {
        this.element.style.top = (x + this.offsetX * .1*w) + 'px';
        // card.element.style.top = cardH + 'px';
        this.element.style.left = (y + this.offsetY * .1*w) + 'px';
        // if(this.distance === 0) {
        // }
        this.element.style.transform = 'rotate(' + this.rotate + 'deg)';
    }

    setDistance(distance) {
        this.distance = distance;
        this.element.style.zIndex = Math.abs(distance)+10;

        if(this.distance === 0) {
            this.rotate = Math.random() * 10 - 5 + 90;
        }
    }

    // randomRotate() {
    //     // if(!this.rotated) {
    //     //     if(this.distance !== 0) {
    //     //         this.element.style.transform = 'rotate(' + (Math.random() * 4-2) + 'deg)'
    //     //     } else {
    //     //         this.element.style.transform = 'rotate(' + (90 + Math.random() * 4-2) + 'deg)'
    //     //     }
    //     //     this.rotated = true;
    //     //
    //     //     this.offsetX = (Math.random() * 4-2);
    //     //     this.offsetY = (Math.random() * 4-2);
    //     // }
    // }

    setWidth(w) {


        this.getElement().style.width = w + 'px';
        this.getElement().style.height = w * 140/90 + 'px';

        this.getElement().classList.remove('small');
        this.getElement().classList.remove('medium');
        this.getElement().classList.remove('large');

        this.picture.style.fontSize = w/2 + 'px';
        if(w < 60) {
            this.getElement().classList.add('small');
        }

    }

}