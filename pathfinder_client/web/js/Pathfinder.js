class Pathfinder {
    constructor() {
        var url = this.getBaseURL();
        var parsed = this.parseURL(url);
        var socketUrl = parsed.protocol + '//' + parsed.hostname + ':3000';

        switch (parsed.hostname) {
            case 'pathfinder.modusoft.nl':
                socketUrl = 'https://pathfinder.api.modusoft.nl/'
                break;
            default:
                break;
        }
        
        this.socket = io(socketUrl);

        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('game-wrapper');
        this.stateWrapper = Interactions.createDiv({class:'state-wrapper'});
        this.wrapper.appendChild(this.stateWrapper);

        this.message = new Messages(this);
        this.players = new Players(this);


        this.state = new InitialState(this.stateWrapper,this);
        this.state.createHTML();


        document.body.appendChild(this.wrapper);

        var gameToken = this.getGameCodeFromUrl();

        if(gameToken) {
            this.state.setGameToken(gameToken);
        }

        this.socket.on('joinGame', data => {
            this.state = new InviteState(this.stateWrapper,this);
            this.state.setData(data);
            this.state.createHTML();
        });

        this.socket.on('enableGameStart', data => {
            if(this.state.enableGameStart !== undefined) {
                this.state.enableGameStart(data);
            }
        });

        this.socket.on('waitGameStart', data => {
            if(this.state.waitGameStart !== undefined) {
                this.state.waitGameStart(data);
            }
        });

        this.socket.on('dealCards', data => {
            this.state = new RoundState(this.stateWrapper,this);
            this.state.setData(data);
            this.state.createHTML();

        });

        this.socket.on('playFirstCard', data => {
            if(this.state.notifyFirstCard !== undefined) {
                this.state.notifyFirstCard(data.color,data.number,data.person);
            }
        });

        this.socket.on('playCard', data => {
            if(this.state.moveCardToTable !== undefined) {
                this.state.moveCardToTable(data.card.color,data.card.number,data.stem,data.distance);
                this.state.setTurn(data.yourTurn);
            }
        });

        this.socket.on('playerPass', data => {
            this.state.setTurn(data.yourTurn);
        });

        this.socket.on('showScore', data => {
            this.state.showScore(data);
        });

    }

    getMessageHandler() {
        return this.message;
    }


    startNewGame(data) {
        this.socket.emit('startNewGame',data);
    }

    startTheGame() {
        this.socket.emit('startTheGame');
    }

    addCpuPlayer() {
        this.socket.emit('addCpuPlayer');
    }

    joinGame(data) {
        this.socket.emit('joinGame',data);
    }

    chooseFirstCard(color, number) {
        this.socket.emit('chooseFirstCard',{color:color,number: number});
    }

    playCard(data) {
        this.socket.emit('playCard',data);
    }

    passTurn() {
        this.socket.emit('passTurn');
    }

    scoreDone() {
        this.socket.emit('scoreDone');
    }



    /**
     * Get game token from url
     *
     * @returns boolean|string Game code
     */
    getGameCodeFromUrl() {
        var urlInfo  = this.parseURL(window.location.href);
        if(urlInfo.searchObject.game !== undefined) {
            return urlInfo.searchObject.game;
        }
        return false;
    }

    getBaseURL() {
        var urlInfo  = this.parseURL(window.location.href);
        return urlInfo.protocol + '//' + urlInfo.host;
    }

    /**
     * Parse url into its componenents
     * @param url
     * @returns {{searchObject, protocol: string | RTCIceProtocol | * | number, hostname: string | *, search: *, port: string | MessagePort | number | string | *, host: string | Element | *, hash: string | KeyAlgorithm | HashAlgorithmIdentifier | Algorithm, pathname: string}}
     */
    parseURL(url) {
        var parser = document.createElement('a'),
            searchObject = {},
            queries, split, i;
        // Let the browser do the work
        parser.href = url;
        // Convert query string to object
        queries = parser.search.replace(/^\?/, '').split('&');
        for( i = 0; i < queries.length; i++ ) {
            split = queries[i].split('=');
            searchObject[split[0]] = split[1];
        }
        return {
            protocol: parser.protocol,
            host: parser.host,
            hostname: parser.hostname,
            port: parser.port,
            pathname: parser.pathname,
            search: parser.search,
            searchObject: searchObject,
            hash: parser.hash
        };
    }
}

