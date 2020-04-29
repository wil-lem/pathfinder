class Modal {
    constructor(wrapper) {
        this.twoCols = false;
        this.wrapper = Interactions.createDiv({class: 'center-block-wrapper'}, wrapper);
        this.block = Interactions.createDiv({class: 'center-block'},this.wrapper);
        this.left = Interactions.createDiv({class: 'center-block-left'},this.block);
        this.right = Interactions.createDiv({class: 'center-block-right'},this.block);
    }

    addToLeft(element) {
        this.left.append(element);
    }

    addToRight(element) {
        if(!this.twoCols) {
            this.twoCols = true;
            this.block.classList.add('two-cols');
        }
        this.right.append(element);
    }

    appendChild(element) {
        this.addToLeft(element);
    }

    addClass(className) {
        this.wrapper.classList.add(className);
    }

    remove() {
        this.wrapper.remove();
    }


    hide() {
        this.wrapper.style.display = 'none';
    }

    show() {
        this.wrapper.style.display = 'block';
    }
}