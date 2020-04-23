class BaseState {

    constructor(wrapper, parent) {
        this.wrapper = wrapper;
        this.parent = parent;
        this.wrapper.innerHTML = '';
    }

    createHTML() {

    }

    addToWrapper(element,wrapper) {
        if(wrapper === undefined) {
            wrapper = this.wrapper;
        }
        wrapper.appendChild(element);
    }

    remove() {
        this.wrapper.remove();
    }
}