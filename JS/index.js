function init() {

    const config = {
        size: 4,
    };  

    const move = {
        checkPosition(e) {
            const currentCell = e.target.id;

            const currentI = +currentCell.split('-')[0];
            const currentJ = +currentCell.split('-')[1];

            const checkLeft = document.getElementById(`${currentI}-${currentJ - 1}`);
            const checkRight = document.getElementById(`${currentI}-${currentJ + 1}`);
            const checkTop = document.getElementById(`${currentI - 1}-${currentJ}`);
            const checkBottom = document.getElementById(`${currentI + 1}-${currentJ}`);

            if (checkLeft && checkLeft.dataset.isEmpty)  {
                move.nextPosition(checkLeft, e.target);
            } else if (checkRight && checkRight.dataset.isEmpty) {
                move.nextPosition(checkRight, e.target);
            } else if (checkTop && checkTop.dataset.isEmpty) {
                move.nextPosition(checkTop, e.target);
            } else if (checkBottom && checkBottom.dataset.isEmpty) {
                move.nextPosition(checkBottom, e.target);
            }
        },
        nextPosition(to, from) {
            [to.id, from.id] = [from.id, to.id];
            [to.style.left, from.style.left] = [from.style.left, to.style.left];
            [to.style.top, from.style.top] = [from.style.top, to.style.top];
        },
    };

    const appElements = {
        getElement() {
            return document.querySelector('.container');
        },
        restartButton() {
            const button = document.createElement('button');
            const gameBoard = document.querySelector('.board');
            button.classList.add('button');
            button.textContent = 'Restart Game';
            button.addEventListener('click', () => board.render());
            this.getElement().append(button);
        },
        render() {
            this.restartButton();
        },
    };

    const board =  {
        getElement() {
            return document.querySelector('.puzzle-game');
        },
        createBoard() {
            const board = document.createElement('div');
            board.classList.add('board');
            return board;
        },
        generateNumbers() {
            const genereatedArray = [null];

            for (let i = 1; i <= (config.size ** 2) - 1; i++) {
                genereatedArray.push(i);
            };

            return genereatedArray.sort(() => Math.random() - 0.5);
        },
        render() {
            const puzzleGame = board.getElement();
            const gameBoard = board.createBoard();

            puzzleGame.innerHTML = '';
            puzzleGame.append(gameBoard);

            gameBoard.innerHTML = '';

            const cellsArray = board.generateNumbers();

            for (let i = 0; i < config.size; i++) {
                for (let j = 0; j < config.size; j++) {
                    const cell = document.createElement('div');
                    cell.classList.add('cell');

                    const cellNumber = cellsArray.shift();

                    if (cellNumber === null) {
                        cell.classList.add('cell-empty');
                        cell.dataset.isEmpty = 'empty';
                    } else {
                        cell.textContent = cellNumber;
                    };

                    cell.id = `${i}-${j}`;

                    cell.style.left = `${22 + (118 * j) + (10 * j)}px`;
                    cell.style.top = `${22 + (118 * i) + (10 * i)}px`;
                    cell.addEventListener('click', move.checkPosition);

                    gameBoard.append(cell);
                };
            };

        },
    };

    board.render();
    appElements.render();
};

document.addEventListener('DOMContentLoaded', init);