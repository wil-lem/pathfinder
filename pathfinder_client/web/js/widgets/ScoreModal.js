class ScoreModal {
    constructor(wrapper, parent) {
        this.parent = parent;
        this.modal = new Modal(wrapper);
        this.modal.addClass('show-score')

        this.hide();

        var text = Interactions.createDiv();
    text.innerHTML = '<h2>' + this.t('game.gameDone') + '</h2>';
        this.modal.addToLeft(text);

        this.scoreWrapper = Interactions.createDiv({class:'score-result'});
        this.modal.addToLeft(this.scoreWrapper);

        this.messages = Interactions.createDiv({class:'messages'});
        this.modal.addToLeft(this.messages);

        this.done = new Button(this.t('game.ok'));

        this.modal.addToLeft(this.done.getElement());

        this.done.onClick(() => {
           this.done.disable();
              this.done.setText(this.t('game.waiting'));
           this.parent.scoreDone();
        });

    }

    hide() {
        this.modal.hide();
    }

    show() {
        this.modal.show();
    }

    clearScore() {
        this.scoreWrapper.textContent = '';
    }

    showScore(scoreData) {
        this.done.enable();
        this.done.setText(this.t('game.done'));

        this.clearScore();
        this.addScoreHeader();

        var messages = [];
        scoreData.forEach(score => {
            this.addScoreLine(score);
            if(score.illegalPassCount === 1) {
                messages.push(this.t('game.illegalOnce', {player: score.player}));
            }
            if(score.illegalPassCount > 1) {
                messages.push(this.t('game.illegalTimes', {player: score.player, count: score.illegalPassCount}));
            }
        });

        this.messages.innerHTML = messages.join('<br>');

        this.show();
    }

    addScoreLine(scoreData) {
        var line = Interactions.createDiv({class:'score-line'});
        this.scoreWrapper.append(line);

        var player = Interactions.createPlayer(scoreData.player);

        line.append(player);

        var score = Interactions.createDiv({class:'score'});
        score.textContent = scoreData.score;
        line.append(score);

        var total = Interactions.createDiv({class:'total'});
        total.textContent = scoreData.total;
        line.append(total);
    }

    addScoreHeader(scoreData) {
        var line = Interactions.createDiv({class:'score-line header'});
        this.scoreWrapper.append(line);

        var player = Interactions.createDiv({class:'player'});
        player.textContent = this.t('game.player');
        line.append(player);

        var score = Interactions.createDiv({class:'score'});
        score.textContent = this.t('game.round');
        line.append(score);

        var total = Interactions.createDiv({class:'total'});
        total.textContent = this.t('game.total');
        line.append(total);
    }

    t(key, params) {
        if(window.PathfinderI18n) {
            return window.PathfinderI18n.t(key, params);
        }
        return key;
    }

    remove() {
        this.wrapper.remove();
    }

}