function TicTacToe() {
    this.constants = {
        players: {X: 'X', O: 'O'},
        cellsDefaultClass: 'cell',
        delimeter: '###',
    };
    this.currentTurn = this.constants.players.O;
    this.config = {
        rowsCols: 0,
        container: null,
        boardValues: [],
        winner: null
    };
}

TicTacToe.prototype.createBoard = function(container, rowsCols) {
    this.config.rowsCols = rowsCols;
    this.config.container = container;

    this.config.boardValues = [];
    for (var i = 0; i < rowsCols; i++) {
        this.config.boardValues.push([]);
    }

    var board = "<table id='board' class='board' cellspacing='0' cellpadding='0'>";

    for (i = 0; i < rowsCols; i++) {
        var row = "<tr>";
        var col = "";

        for (var j = 0; j < rowsCols; j++) {
            col += "<td class='" + this.constants.cellsDefaultClass + "' cell-id='" + (i + this.constants.delimeter + j) + "'></td>";
            this.config.boardValues[i][j] = null;
        }

        row += col;

        board += row;
    }

    board += "</table>";

    container.innerHTML = board;

    this.bindEvents();
};

TicTacToe.prototype.toggleTurn = function() {
    this.currentTurn = (this.currentTurn === this.constants.players.O) ? this.constants.players.X: this.constants.players.O;
};

TicTacToe.prototype.bindEvents = function() {

    var that = this;
    var cellClickHandler = function(e) {

        var el = e.target;

        var isCellClicked = el.className.indexOf(that.constants.cellsDefaultClass) !== -1;

        if (isCellClicked) {

            if (el.innerText.length > 0) return;

            el.innerText = that.currentTurn;

            var cellIJ = el.attributes.getNamedItem('cell-id').value.split(that.constants.delimeter);

            that.config.boardValues[parseInt(cellIJ[0])][parseInt(cellIJ[1])] = that.currentTurn;

            if (that.detectWinner()) {
                setTimeout(function() {that.declareWinner()}, 0);
                return;
            }

            that.toggleTurn();
        }
    };

    var board = document.querySelectorAll("#" + this.config.container.attributes.getNamedItem('id').value + ' #board')[0];

    board.addEventListener('click', cellClickHandler);
};

TicTacToe.prototype.detectWinner = function() {
    var that = this;

    var checkRows = function () {
        var player;

        for (var i = 0; i < that.config.rowsCols; i++) {
            player = that.config.boardValues[i][0];
            for (var j = 0; j < that.config.rowsCols; j++) {
                if (player !== that.config.boardValues[i][j]) {
                    player = null;
                    break;
                }
            }
            if (player) {
                that.config.winner = player;
                return player;
            }
        }
        return false;
    };

    var checkColumns = function() {
        var player;

        for (var i = 0; i < that.config.rowsCols; i++) {
            player = that.config.boardValues[0][i];
            // debugger;
            for (var j = 0; j < that.config.rowsCols; j++) {
                if (player !== that.config.boardValues[j][i]) {
                    player = null;
                    break;
                }
            }
            if (player) {
                that.config.winner = player;
                return player;
            }
        }
        return false;
    };

    var checkDiagonal = function () {
        var player = that.config.boardValues[0][0];

        var backColIndex = that.config.rowsCols - 1;

        for (var i = 0; i < that.config.rowsCols; i++) {
            if (player !== that.config.boardValues[i][i]) {
                player = null;
            }
        }
        if (player) {
            that.config.winner = player;
            return player;
        }

        player = that.config.boardValues[0][that.config.rowsCols - 1];
        for (i = 0; i < that.config.rowsCols; i++) {
            if (player !== that.config.boardValues[i][backColIndex]) {
                player = null;
                break;
            }
            backColIndex--;
        }

        if (player) {
            that.config.winner = player;
            return player;
        }

        return false;
    };

    document.getElementById('output').innerHTML = JSON.stringify(this.config.boardValues, null, '\t');

    var result = checkDiagonal();
    if (result) return result;

    result = checkRows();
    if (result) return result;

    result = checkColumns();
    if (result) return result;
};

TicTacToe.prototype.declareWinner = function() {
    alert("Winner is: " + this.config.winner);
    this.resetBoard();
};

TicTacToe.prototype.resetBoard = function() {
    this.config.winner = null;
    this.createBoard(this.config.container, this.config.rowsCols);

    document.getElementById('output').innerHTML = JSON.stringify(this.config.boardValues, null, '\t');
};

TicTacToe.prototype.init = function(container, size) {
    this.createBoard(container, size);
};

(function(){
    var t1 = new TicTacToe();
    t1.init(document.getElementById('app'), 3);

    var t2 = new TicTacToe();
    t2.init(document.getElementById('app2'), 4);
})();