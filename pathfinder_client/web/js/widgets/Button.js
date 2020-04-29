class Button {
    constructor(text,wrapper) {
        this.active = true;
        this.element = Interactions.createDiv({class:'button'});
        this.element.textContent = text;
        if(wrapper !== undefined) {
            wrapper.appendChild(this.element);
        }
    }

    setWaShare(shareText) {
        var text = this.element.textContent;

        var parent = this.element.parentNode;

        this.element.remove();

        this.element = Interactions.createElement('a',{class: 'button'});
        this.element.textContent = text;

        this.element.setAttribute('href','whatsapp://send?text=' + encodeURIComponent(shareText));
        this.element.setAttribute('data-action','hatsapp://send?text=' + encodeURIComponent(shareText));

        this.adFabIcon('whatsapp');
        parent.appendChild(this.element);

        return this;
    }

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
        return this;
    }

    adFabIcon(type) {
        var icon = Interactions.createDiv({class:'fab fa-'+type});
        this.element.append(icon);
        return this;
    }

    setText(text) {
        this.element.textContent = text;
        return this;
    }

    getElement() {
        return this.element;
    }

    hide(){
        this.element.style.display = 'none';
    }
}