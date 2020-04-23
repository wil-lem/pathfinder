class ChooseFirstCard {
    constructor(wrapper, parent) {
        this.wrapper = Interactions.createDiv({class:'center-block choose-first-card'});

        this.colorButtons = [];
        this.selectedColor = null;

        this.numberButtons = [];
        this.selectedNumber = null;

        this.preview = null;

        this.parent = parent;

        wrapper.appendChild(this.wrapper);


        var text = Interactions.createDiv();
        text.textContent = 'Choose the first card';
        this.wrapper.appendChild(text);

        var chooseColor = Interactions.createDiv({class:'choose-color'});
        var colors = ['red','green','black','blue','orange'];

        colors.forEach((color) => {
            chooseColor.appendChild(this.createColorButton(color));
        });

        this.wrapper.appendChild(chooseColor);

        var chooseNumber = Interactions.createDiv({class:'choose-number'});
        for(var number = 2; number < 10; number++) {
            chooseNumber.appendChild(this.createNumberButton(number));
        }
        this.wrapper.appendChild(chooseNumber);

        this.confirmButton = Interactions.createDiv({class:'confirm-button disabled'});
        this.confirmButton.textContent = 'Choose';

        this.confirmButton.onclick = () => {
            this.chooseCard();
        };

        this.wrapper.appendChild(this.confirmButton);

    }

    createColorButton(color) {
        var element = Interactions.createDiv({class:'color-button'});
        element.style.backgroundColor = color;
        element.onclick = () => {
            console.log('click color',color);
            this.selectColor(element,color);
        };
        this.colorButtons.push(element);
        return element;
    }

    selectColor(selectedElement,color) {
        if(color === this.selectedColor) {
            return;
        }
        console.log('selectcolor',color);

        this.colorButtons.forEach((element) => {
            if(element !== selectedElement) {
                element.classList.remove('selected');
            }
        });


        this.selectedColor = color;
        selectedElement.classList.add('selected');

        this.updatePreview();
    }

    createNumberButton(number) {
        var element = Interactions.createDiv({class:'number-button'});
        element.onclick = () => {
            this.selectNumber(element,number);
        };
        this.numberButtons.push(element);
        element.textContent = number;
        return element;
    }

    selectNumber(selectedElement,number) {
        if(number === this.selectedNumber) {
            return;
        }

        this.numberButtons.forEach((element) => {
            if(element !== selectedElement) {
                element.classList.remove('selected');
            }
        });
        selectedElement.classList.add('selected');
        this.selectedNumber = number;

        this.updatePreview();
    }


    updatePreview() {
        if(this.preview !== null) {
            this.preview.remove();
            this.preview = null;
        }

        if(!this.selectedColor || !this.selectedNumber) {
            return;
        }

        this.confirmButton.classList.remove('disabled');

        this.preview = new Card(this.selectedNumber,this.selectedColor);
        this.wrapper.appendChild(this.preview.getElement());
    }

    chooseCard() {
        if(!this.selectedColor || !this.selectedNumber) {
            return;
        }

        this.parent.chooseFirstCard(this.selectedColor,this.selectedNumber);
    }

    remove() {
        this.wrapper.remove();
    }

}