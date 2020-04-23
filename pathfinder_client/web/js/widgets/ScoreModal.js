class ScoreModal {
    constructor(wrapper, parent) {
        this.parent = parent;
        this.wrapper = Interactions.createDiv({class:'center-block show-score'});
        this.hide();
        wrapper.appendChild(this.wrapper);

        var text = Interactions.createDiv();
        text.innerHTML = '<h2>Game done</h2>';
        this.wrapper.appendChild(text);

        this.scoreWrapper = Interactions.createDiv({class:'score-result'});

        this.wrapper.appendChild(this.scoreWrapper);

        this.done = new Button('OK',this.wrapper);

        this.done.onClick(() => {
           this.done.disable();
           this.done.setText('Waiting');
           console.log('this',this.parent);
           this.parent.scoreDone();
        });

    }

    hide() {
        this.wrapper.style.display = 'none';
    }

    show() {
        this.wrapper.style.display = 'block';
    }

    clearScore() {
        this.scoreWrapper.textContent = '';
    }

    showScore(scoreData) {

        this.done.enable();
        this.done.setText('Done');

        this.clearScore();
        this.addScoreHeader();
        scoreData.forEach(score => {
            this.addScoreLine(score);
        });

        this.show();
    }

    addScoreLine(scoreData) {
        var line = Interactions.createDiv({class:'score-line'});
        this.scoreWrapper.append(line);

        var player = Interactions.createDiv({class:'player'});
        player.textContent = scoreData.player;

        player.appendChild(Interactions.createDiv({class:'icon fa fa-user'}));

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