class Interactions {

    /**
     * Create a div element
     *
     * @param {} attrs List of attributes that will be added
     * @param {HTMLElement} wrapper
     * @returns {HTMLElement}
     */
    static createDiv(attrs, wrapper) {
        return Interactions.createElement('div', attrs, wrapper);
    }

    /**
     * Create a player <div>
     *
     * @param {} playerData
     * @param {HTMLElement} wrapper optional
     * @returns {HTMLElement} Created div
     */
    static createPlayer(playerData, wrapper) {
        var player = Interactions.createDiv({class:'player'}, wrapper);

        switch (typeof playerData) {
            case 'object':
                player.innerHTML = playerData.name;
                if (playerData.cardCount) {
                    player.innerHTML += ' (' + playerData.cardCount + ')';
                }
                if (playerData.gameTurn) {
                    player.classList.add('game-turn');
                }
                if (playerData.roundTurn) {
                    player.classList.add('round-turn');
                }
                if(playerData.lastAction !== undefined && playerData.lastAction) {
                    this.addLastAction(player,playerData.lastAction);
                }

                break;
            case 'string':
                player.innerHTML = playerData;
                break;
            default:
                break;
        }
        player.appendChild(Interactions.createDiv({class:'icon fa fa-user'}));

        return player;
    }

    static addLastAction(wrapper,actionData) {
        var lastAction = Interactions.createDiv({class: 'last-action'},wrapper);
        console.log(actionData);
        switch (actionData.action) {
            case 'passed':
                lastAction.classList.add('fa');
                lastAction.classList.add('fa-hand-paper');
                break;
            case 'playcard':
                lastAction.classList.add('card');
                lastAction.classList.add('card-color-' + actionData.card.color);
                lastAction.innerHTML = actionData.card.number;
                if(actionData.card.number == 10) {
                    lastAction.classList.add('big-number');
                }

                break;
            default:
                break;
        }
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

    /**
     * Create a basic html element
     * @param string type Element type to create
     * @param {} attrs List of attributes to add to the element
     * @param {HTMLElement} wrapper
     * @returns {HTMLElement}
     */
    static createElement(type,attrs,wrapper) {
        var element = document.createElement(type);
        if(attrs !== undefined) {
            for(var i in attrs) {
                element.setAttribute(i, attrs[i]);
            }
        }
        if(wrapper !== undefined) {
            wrapper.appendChild(element);
        }
        return element;
    }

    static createCopyWidget(text,messageHandler) {
        var element = Interactions.createDiv({class: 'copy-widget'});

        var input = Interactions.createInputText();
        input.readOnly = true;
        input.value = text;
        element.appendChild(input);

        var copy = new Button('Copy',element);
        copy.adFaIcon('copy').addClass('button-blue').addClass('button-small');

        copy.onClick(() => {
            input.select();
            input.setSelectionRange(0,99999);
            document.execCommand('copy');
            document.getSelection().removeAllRanges();
            if(messageHandler !== undefined) {
                messageHandler.addMessage('Copied',1000);
            }
        });



        var whatsapp = new Button('Whatsapp',element);
        whatsapp.setWaShare(text).addClass('button-blue').addClass('button-small');


        var whatsApp = Interactions.createElement('a',{class:'whatsapp-button fa fa-whatsapp'});


        return element;
    }


    static addHeader(element,text, closable, movable) {
        var headerElement = Interactions.createElement('h2');

        headerElement.textContent = text;
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