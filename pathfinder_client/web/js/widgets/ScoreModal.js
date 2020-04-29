class ScoreModal {
    constructor(wrapper, parent) {
        this.parent = parent;
        this.modal = new Modal(wrapper);
        this.modal.addClass('show-score')

        this.hide();

        var text = Interactions.createDiv();
        text.innerHTML = '<h2>Game done</h2>';
        this.modal.addToLeft(text);

        this.scoreWrapper = Interactions.createDiv({class:'score-result'});
        this.modal.addToLeft(this.scoreWrapper);

        this.messages = Interactions.createDiv({class:'messages'});
        this.modal.addToLeft(this.messages);

        this.done = new Button('OK');

        this.modal.addToLeft(this.done.getElement());

        this.done.onClick(() => {
           this.done.disable();
           this.done.setText('Waiting');
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
        this.done.setText('Done');

        this.clearScore();
        this.addScoreHeader();

        var messages = [];
        scoreData.forEach(score => {
            this.addScoreLine(score);
            if(score.illegalPassCount === 1) {
                messages.push( score.player + ' illegally passed once.')
            }
            if(score.illegalPassCount > 1) {
                messages.push( score.player + ' illegally passed ' + score.illegalPassCount + ' times.')
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
        player.textContent = 'Player';
        line.append(player);

        var score = Interactions.createDiv({class:'score'});
        score.textContent = 'Round';
        line.append(score);

        var total = Interactions.createDiv({class:'total'});
        total.textContent = 'Total';
        line.append(total);
    }

    remove() {
        this.wrapper.remove();
    }

}