class Interactions {

    static createDiv(attrs) {
        return Interactions.createElement('div', attrs);
    }

    static createInput(attrs) {
        return Interactions.createElement('input', attrs);
    }

    static createInputText(attrs) {
        if(attrs === undefined) {
            attrs = {};
        }
        attrs.type = 'text';
        return Interactions.createInput(attrs);
    }

    static createElement(type,attrs) {
        var element = document.createElement(type);
        if(attrs !== undefined) {
            for(var i in attrs) {
                element.setAttribute(i, attrs[i]);
            }
        }
        return element;
    }

    static createCopyWidget(text,messageHandler) {
        var element = Interactions.createDiv({class: 'copy-widget'});

        var input = Interactions.createInputText();
        input.readOnly = true;
        input.value = text;

        var copy = Interactions.createDiv({class:'copy-button fa fa-copy'});

        element.appendChild(input);
        element.appendChild(copy);

        copy.onclick = () => {
          input.select();
          input.setSelectionRange(0,99999);
          document.execCommand('copy');
          document.getSelection().removeAllRanges();
          if(messageHandler !== undefined) {
              messageHandler.addMessage('Copied',1000);
          }
        };

        return element;
    }

    static addHeader(element,text, closable, movable) {
        var headerElement = Interactions.createElement('h2');

        element.textContent = text;
        element.appendChild(headerElement);

        if(closable) {
            Interactions.closable(element,headerElement);
        }
        if(movable) {
            Interactions.movable(element,headerElement);
        }
    }


    static movable(element, header) {

    }

    static closable(element, header) {
        header.onclick = () => {
            var bb = element.boundingClientRect;
            var header = header.boundingClientRect;
            console.log(eleme)
        }
    }

    static fadeOut(element) {
        if(element.style.opacity == '') {
            element.style.opacity = 1;
        }
        var opacity = element.style.opacity - .1;
        if(opacity <= 0) {
            element.remove();
        } else {
            element.style.opacity = opacity;
            setTimeout(()=>Interactions.fadeOut(element),500 / 10);
        }
    }
}