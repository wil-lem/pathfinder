class ChooseFirstCard {
    constructor(wrapper, parent) {

        this.firstCardModal = new Modal(wrapper);
        this.firstCardModal.addClass('choose-first-card');

        this.colorButtons = [];
        this.selectedColor = null;

        this.numberButtons = [];
        this.selectedNumber = null;

        this.preview = null;

        this.parent = parent;


        var text = Interactions.createDiv();
        text.textContent = 'Choose the first card';
        this.firstCardModal.addToLeft(text);

        var chooseColor = Interactions.createDiv({class:'choose-color'});
        var colors = ['red','green','black','blue','orange'];

        colors.forEach((color) => {
            chooseColor.appendChild(this.createColorButton(color));
        });

        this.firstCardModal.addToLeft(chooseColor);

        var chooseNumber = Interactions.createDiv({class:'choose-number'});
        for(var number = 2; number < 10; number++) {
            chooseNumber.appendChild(this.createNumberButton(number));
        }
        this.firstCardModal.appendChild(chooseNumber);

        this.confirmButton = new Button('Choose');
        this.confirmButton.disable();
        this.confirmButton.adFaIcon('check');

        this.confirmButton.onClick(() => {
            this.chooseCard();
        });

        this.firstCardModal.addToLeft(this.confirmButton.getElement());

    }

    createColorButton(color) {
        var element = Interactions.createDiv({class:'color-button'});
        element.style.backgroundColor = color;
        element.onclick = () => {
            this.selectColor(element,color);
        };
        this.colorButtons.push(element);
        return element;
    }

    selectColor(selectedElement,color) {
        if(color === this.selectedColor) {
            return;
        }

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

        this.confirmButton.enable();

        this.preview = new Card(this.selectedNumber,this.selectedColor);
        this.firstCardModal.addToRight(this.preview.getElement());
    }

    chooseCard() {
        if(!this.selectedColor || !this.selectedNumber) {
            return;
        }

        this.parent.chooseFirstCard(this.selectedColor,this.selectedNumber);
    }

    remove() {
        this.firstCardModal.remove();
    }

}