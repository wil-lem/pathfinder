class Pathfinder {
    constructor() {
        // Connect to socket.io on the same origin
        // The server will handle the connection regardless of port
        this.socket = io();

        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('game-wrapper');
        this.stateWrapper = Interactions.createDiv({class:'state-wrapper'});
        this.wrapper.appendChild(this.stateWrapper);

        this.message = new Messages(this);
        this.players = new Players(this);
        this.players.subscribe(this);

        this.trackingPlayersInitialized = false;
        this.trackedPlayerIds = [];
        this.latestPlayers = [];
        this.gameStartedTracked = false;
        this.roundCounter = 0;


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
            if(!this.gameStartedTracked) {
                this.gameStartedTracked = true;
                var mode = this.getGameMode();
                this.trackEvent('Game', 'Started', mode, this.latestPlayers.length);
                this.trackEvent('Game', 'Mode', mode);
            }

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
            this.roundCounter++;
            this.trackEvent('Round', 'Finished', this.getGameMode(), this.roundCounter);
            this.state.showScore(data);
        });

    }

    getMessageHandler() {
        return this.message;
    }

    updatePlayerList(list) {
        this.latestPlayers = list;

        if(!this.trackingPlayersInitialized) {
            this.trackingPlayersInitialized = true;
            this.trackedPlayerIds = list.map(player => player.id);
            return;
        }

        var knownPlayers = this.trackedPlayerIds.slice(0);
        list.forEach(player => {
            if(knownPlayers.indexOf(player.id) < 0) {
                var type = (player.isCpu) ? 'cpu' : 'human';
                this.trackEvent('Game Lobby', 'Player Added', type);
                this.trackedPlayerIds.push(player.id);
            }
        });
    }

    getGameMode() {
        if(!this.latestPlayers || this.latestPlayers.length === 0) {
            return 'unknown';
        }
        var hasCpu = this.latestPlayers.some(player => player.isCpu);
        return hasCpu ? 'vs_cpu' : 'multiplayer';
    }

    trackEvent(category, action, name, value) {
        if(!window._paq) {
            return;
        }

        var event = [category, action];
        if(name !== undefined) {
            event.push(name);
        }
        if(value !== undefined) {
            event.push(value);
        }
        window._paq.push(['trackEvent'].concat(event));
    }

    t(key, params) {
        if(window.PathfinderI18n) {
            return window.PathfinderI18n.t(key, params);
        }
        return key;
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

