const Player = function (name, token) {
    const getName = () => name;
    const getToken = () => token;
    const changeName = function (newName) {
        name = newName;
    };
    return { getName, getToken, changeName };
};

Player.prototype.changeName = function (newName) {
    this.name = newName;
};

const player1 = Player("Player 1", "X");
const player2 = Player("Player 2", "O");

const Gameboard = (function () {
    const rows = 3;
    const columns = 3;
    const boardArray = [];

    let c1, c2, c3, c4, c5, c6, c7, c8, c9;

    for (let i = 0; i < rows; i++) {
        boardArray[i] = [];
        for (let j = 0; j < columns; j++) {
            boardArray[i].push("");
        }
    }

    const updateCellVar = function () {
        c1 = boardArray[0][0];
        c2 = boardArray[0][1];
        c3 = boardArray[0][2];
        c4 = boardArray[1][0];
        c5 = boardArray[1][1];
        c6 = boardArray[1][2];
        c7 = boardArray[2][0];
        c8 = boardArray[2][1];
        c9 = boardArray[2][2];

        return [c1, c2, c3, c4, c5, c6, c7, c8, c9];
    };

    const changeCell = function (row, column, token) {
        boardArray[row][column] = token;
    };

    const IsEmpty = function (row, column) {
        return boardArray[row][column] == "";
    };

    const renderBoard = function () {
        console.table(boardArray);
    };

    const IsGameOver = function () {
        updateCellVar();

        checkArray = [checkHorizontals(), checkVerticals(), checkDiagonals()];

        if (isTokenInArray(checkArray, player1.getToken())) {
            return true;
        } else if (isTokenInArray(checkArray, player2.getToken())) {
            return true;
        } else if (isTied()) {
            return undefined;
        }

        return false;
    };

    const isTokenInArray = function (arr, token) {
        return arr.some((row) => row.includes(token));
    };

    const checkHorizontals = function () {
        h1 = CheckThreeCells(c1, c2, c3);
        h2 = CheckThreeCells(c4, c5, c6);
        h3 = CheckThreeCells(c7, c8, c9);

        return [h1, h2, h3];
    };

    const checkVerticals = function () {
        v1 = CheckThreeCells(c1, c4, c7);
        v2 = CheckThreeCells(c2, c5, c8);
        v3 = CheckThreeCells(c3, c6, c9);

        return [v1, v2, v3];
    };

    const checkDiagonals = function () {
        d1 = CheckThreeCells(c1, c5, c9);
        d2 = CheckThreeCells(c7, c5, c3);

        return [d1, d2];
    };

    const CheckThreeCells = function (a, b, c) {
        token1 = player1.getToken();
        token2 = player2.getToken();

        if (a == token1 && b == token1 && c == token1) {
            return token1;
        } else if (a == token2 && b == token2 && c == token2) {
            return token2;
        } else {
            return false;
        }
    };

    const isTied = function () {
        if (isTokenInArray(boardArray, "")) {
            return false;
        }

        return true;
    };

    const convert1Dto2D = function (str) {
        index = parseInt(str) - 1;
        row = Math.floor(index / 3);
        column = index % 3;

        return [row, column];
    };

    return { changeCell, IsEmpty, IsGameOver, updateCellVar, convert1Dto2D };
})();

const GameController = (function () {
    let currentTurn = player1;
    let winner;

    const getWinner = () => winner;

    const getTurn = () => currentTurn;

    const switchTurn = function () {
        currentTurn = currentTurn === player1 ? player2 : player1;
    };

    const startRound = function (row, column) {
        if (Gameboard.IsEmpty(row, column)) {
            Gameboard.changeCell(row, column, currentTurn.getToken());
            outcome = Gameboard.IsGameOver();
            if (outcome == true) {
                winner = currentTurn.getName();
                screenController.createWinnerDiv();
            } else if (outcome == undefined) {
                winner = currentTurn.getName();
                screenController.createWinnerDiv();
            } else switchTurn();
        } else {
            console.log(
                "This cell has already been picked, please choose another."
            );
        }
    };

    return { startRound, getWinner, getTurn };
})();

const screenController = (function () {
    const grid_container = document.querySelector(".grid-container");
    const context_text = document.querySelector(".game-context p");
    const form = document.querySelector("#myForm");

    const createGridDivs = function () {
        for (let i = 0; i < 3 * 3; i++) {
            const newDiv = document.createElement("div");
            newDiv.id = `c${i + 1}`;
            grid_container.appendChild(newDiv);
        }
    };

    const updateCellDivs = function () {
        cellValues = Gameboard.updateCellVar();
        grid_cells = [...grid_container.querySelectorAll(":scope > div")];

        i = 0;
        grid_cells.forEach((cell) => {
            cell.innerHTML = cellValues[i];
            i += 1;
        });

        return grid_cells;
    };

    createGridDivs();
    grid_cells = updateCellDivs();

    grid_cells.forEach((cell) => {
        cell.addEventListener("click", divClicked);
    });

    function divClicked() {
        if (GameController.getWinner() == undefined) {
            index = Gameboard.convert1Dto2D(this.id.charAt(1));

            GameController.startRound(index[0], index[1]);
            updateCellDivs();
            updateTurnText();
        }
    }

    function updateTurnText() {
        context_text.innerHTML = `${GameController.getTurn().getName()}'s turn`;
    }

    function createWinnerDiv() {
        const newDiv = document.createElement("div");
        newDiv.id = "winner";

        p = document.createElement("p");
        winner = GameController.getWinner();
        p.innerHTML = winner;

        newDiv.appendChild(p);
        document.body.appendChild(newDiv);
    }

    return { createWinnerDiv, updateTurnText };
})();

const form = document.querySelector("#myForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    let name1 = document.querySelector('[id = "player 1"]').value;
    let name2 = document.querySelector('[id = "player 2"]').value;

    player1.changeName(name1);
    player2.changeName(name2);

    screenController.updateTurnText();
});
