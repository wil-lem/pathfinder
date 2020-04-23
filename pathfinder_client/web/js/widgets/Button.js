class Button {
    constructor(text,wrapper) {
        this.active = true;
        this.element = Interactions.createDiv({class:'button'});
        this.element.textContent = text;

        console.log(text);
        wrapper.appendChild(this.element);
    }
W
    disable() {
        this.addClass('disabled');
        this.active = false;
        return this;
    }

    enable() {
        this.removeClass('disabled');
        this.active = true;
        return this;
    }

    addClass(className) {
        this.element.classList.add(className);
        return this;
    }

    removeClass(className) {
        this.element.classList.remove(className);
        return this;
    }

    onClick(callback) {
        this.element.onclick = e => {
            if(this.active) {
                callback(e);
            }
        };
        return this;
    }

    adFaIcon(type) {
        var icon = Interactions.createDiv({class:'fa fa-'+type});
        this.element.append(icon);
    }

    setText(text) {
        this.element.textContent = text;
    }
}