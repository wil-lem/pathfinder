(function() {
    var STORAGE_KEY = 'pathfinder-language';
    var DEFAULT_LANGUAGE = 'en';

    var dictionaries = {
        en: {
            language: {
                label: 'Language'
            },
            nav: {
                howToPlay: 'How to play',
                startPlaying: 'Start Playing'
            },
            landing: {
                kicker: 'Card strategy game',
                title: 'Find your path, outplay your friends.',
                subtitle: 'Start a game in seconds, invite players with one link, and race through tactical rounds where every card matters.',
                readRules: 'Read The Rules'
            },
            rules: {
                kicker: 'Rules',
                title: 'How Pathfinder Works',
                line1: 'The game uses cards in five colors (1 to 10 for each color).',
                line2: 'One player starts a round by choosing the first card: number 2 to 9.',
                line3: 'That chosen card becomes the center card and is played first.',
                line4: 'After that, turns rotate one by one among players.',
                line5: 'On your turn, play a card that is legal for the table: either a card with the same number as the center card, or the same color as an existing table card with a number directly above or below it.',
                line6: 'If you truly have no legal move, you may pass your turn.',
                line7: 'The round ends when one player has no cards left in hand.',
                line8: 'Score is the total value of cards left in your hand; lower is better. (Card 1 is worth 15 points.)',
                backToFrontpage: 'Back To Frontpage'
            },
            game: {
                yourName: 'Your name',
                startGame: 'Start game',
                joinGame: 'Join game',
                minNameError: 'Please enter a name of at least 4 characters.',
                welcomeShare: 'Welcome {name} - Share this URL to invite others',
                addCpu: 'Add CPU',
                players: 'Players',
                start: 'Start',
                waitingForStart: 'Waiting for <em>{creator}</em> to start the game.',
                pass: 'Pass',
                play: 'Play',
                chooseFirstCard: 'Choose the first card',
                choose: 'Choose',
                askedForCard: '<em>{user}</em> asked for the {color} {number}',
                gameDone: 'Game done',
                ok: 'OK',
                waiting: 'Waiting',
                done: 'Done',
                player: 'Player',
                round: 'Round',
                total: 'Total',
                illegalOnce: '{player} illegally passed once.',
                illegalTimes: '{player} illegally passed {count} times.',
                copy: 'Copy',
                copied: 'Copied',
                whatsapp: 'Whatsapp'
            }
        },
        nl: {
            language: {
                label: 'Taal'
            },
            nav: {
                howToPlay: 'Spelregels',
                startPlaying: 'Start Spelen'
            },
            landing: {
                kicker: 'Strategisch kaartspel',
                title: 'Vind je pad en speel iedereen eruit.',
                subtitle: 'Start binnen enkele seconden een spel, nodig spelers uit met een link en speel slimme rondes waarin elke kaart telt.',
                readRules: 'Lees De Regels'
            },
            rules: {
                kicker: 'Regels',
                title: 'Hoe Pathfinder Werkt',
                line1: 'Het spel gebruikt kaarten in vijf kleuren (1 t/m 10 per kleur).',
                line2: 'Eén speler start de ronde door de eerste kaart te kiezen: nummer 2 t/m 9.',
                line3: 'Die gekozen kaart wordt de middenkaart en wordt als eerste gespeeld.',
                line4: 'Daarna gaat de beurt om de beurt langs alle spelers.',
                line5: 'In jouw beurt speel je een geldige kaart: ofwel dezelfde waarde als de middenkaart, of dezelfde kleur als een kaart op tafel met een direct hoger of lager nummer.',
                line6: 'Heb je echt geen geldige zet, dan mag je passen.',
                line7: 'De ronde eindigt zodra één speler geen kaarten meer in de hand heeft.',
                line8: 'Je score is de totale waarde van kaarten in je hand; lager is beter. (Kaart 1 is 15 punten waard.)',
                backToFrontpage: 'Terug Naar Voorpagina'
            },
            game: {
                yourName: 'Jouw naam',
                startGame: 'Start spel',
                joinGame: 'Meedoen',
                minNameError: 'Vul een naam in van minimaal 4 tekens.',
                welcomeShare: 'Welkom {name} - Deel deze URL om anderen uit te nodigen',
                addCpu: 'CPU toevoegen',
                players: 'Spelers',
                start: 'Start',
                waitingForStart: 'Wachten op <em>{creator}</em> om het spel te starten.',
                pass: 'Passen',
                play: 'Spelen',
                chooseFirstCard: 'Kies de eerste kaart',
                choose: 'Kies',
                askedForCard: '<em>{user}</em> koos {color} {number}',
                gameDone: 'Spel afgelopen',
                ok: 'OK',
                waiting: 'Wachten',
                done: 'Klaar',
                player: 'Speler',
                round: 'Ronde',
                total: 'Totaal',
                illegalOnce: '{player} heeft 1 keer onterecht gepast.',
                illegalTimes: '{player} heeft {count} keer onterecht gepast.',
                copy: 'Kopieer',
                copied: 'Gekopieerd',
                whatsapp: 'Whatsapp'
            }
        }
    };

    var listeners = [];

    function getByPath(object, path) {
        var keys = path.split('.');
        var value = object;
        for (var i = 0; i < keys.length; i++) {
            if (value === undefined || value === null) {
                return undefined;
            }
            value = value[keys[i]];
        }
        return value;
    }

    function interpolate(template, params) {
        if (!params) {
            return template;
        }
        return template.replace(/\{([a-zA-Z0-9_]+)\}/g, function(match, key) {
            return params[key] !== undefined ? params[key] : match;
        });
    }

    function getLanguage() {
        var stored = localStorage.getItem(STORAGE_KEY);
        if (stored && dictionaries[stored]) {
            return stored;
        }
        return DEFAULT_LANGUAGE;
    }

    function setLanguage(languageCode) {
        if (!dictionaries[languageCode]) {
            return;
        }
        localStorage.setItem(STORAGE_KEY, languageCode);
        listeners.forEach(function(listener) {
            listener(languageCode);
        });
    }

    function t(key, params) {
        var languageCode = getLanguage();
        var dict = dictionaries[languageCode] || dictionaries[DEFAULT_LANGUAGE];
        var value = getByPath(dict, key);

        if (value === undefined) {
            value = getByPath(dictionaries[DEFAULT_LANGUAGE], key);
        }

        if (typeof value !== 'string') {
            return key;
        }

        return interpolate(value, params);
    }

    function applyToDOM(root) {
        var node = root || document;

        node.querySelectorAll('[data-i18n]').forEach(function(element) {
            var key = element.getAttribute('data-i18n');
            element.textContent = t(key);
        });

        node.querySelectorAll('[data-i18n-html]').forEach(function(element) {
            var key = element.getAttribute('data-i18n-html');
            element.innerHTML = t(key);
        });
    }

    function initLanguageSwitcher(selector, root) {
        var node = root || document;
        var select = node.querySelector(selector);
        if (!select) {
            return;
        }

        select.value = getLanguage();
        select.addEventListener('change', function() {
            setLanguage(select.value);
        });

        subscribe(function(lang) {
            select.value = lang;
        });
    }

    function subscribe(listener) {
        listeners.push(listener);
        return function() {
            listeners = listeners.filter(function(item) {
                return item !== listener;
            });
        };
    }

    window.PathfinderI18n = {
        t: t,
        getLanguage: getLanguage,
        setLanguage: setLanguage,
        applyToDOM: applyToDOM,
        initLanguageSwitcher: initLanguageSwitcher,
        subscribe: subscribe
    };
})();
