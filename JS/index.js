function init() {

    let gameTimer = 0;
    let totalMoves = 0;

    let resultToWin = [];

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

            gameResults.checkWin();
            moves.changeMove();
        },
    };

    const appElements = {
        getElement() {
            return document.querySelector('.container');
        },
        restartButton() {
            const button = document.createElement('button');
            button.classList.add('button');
            button.textContent = 'Restart Game';
            button.addEventListener('click', () =>  {
                board.render();
                moves.clearMoves();
            });
            this.getElement().append(button);
        },
        timer() {
            const timer = document.createElement('div');
            const timerText = document.createElement('div');
            const timerTime = document.createElement('div');

            timer.classList.add('timer', 'about-game');
            timerTime.classList.add('timer-timer', 'about-game__text')

            timerText.textContent = 'Time:';
            timerTime.textContent = '00:00';

            timer.append(timerText, timerTime);
            document.querySelector('.top-buttons').append(timer);
        },
        moves() {
            const moves = document.createElement('div');
            const movesText = document.createElement('div');
            const movesTotal = document.createElement('div');
            
            moves.classList.add('moves', 'about-game');
            movesTotal.classList.add('moves-moves', 'about-game__text');

            movesText.textContent = 'Moves:';
            movesTotal.textContent = '0';

            moves.append(movesText, movesTotal);
            document.querySelector('.top-buttons').append(moves);
        },
        render() {
            this.restartButton();
            this.timer(); 
            this.moves();
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
                    cell.addEventListener('click', (e) => {
                        move.checkPosition(e);
                    });

                    gameBoard.append(cell);
                };
            };
            timer.gameTime();
        },
    };

    const gameResults = {
        getResultsToWin() {
            for (let i = 1; i <= (config.size ** 2) - 1; i++) {
                resultToWin.push(i);
            };
            resultToWin.push(0)
        },
        getPlayerResult() {
            const playerResult = document.querySelectorAll('.cell');
            return playerResult;
        },
        checkWin() {
            let findBy = '';
            let counter = 0;
            
            for (let i = 0; i < config.size; i++) {
                for (let j = 0; j < config.size; j++) {
                    findBy = `${i}-${j}`;
                    if (+document.getElementById(findBy).textContent !== resultToWin[counter]) {
                        return;
                    };
                    counter+=1;
                };
            };
            gameResults.userWin();
        },
        userWin() {
            console.log('ПОБЕДА!');
        },
    };

    const timer = {
        gameTime() {
            let counter = 0;
            let seconds = 0;
            let minutes = 0;

            const timerBlock = document.querySelector('.timer-timer');
            clearInterval(gameTimer);

            gameTimer = setInterval(() => {
                counter += 1;
                seconds = (counter < 10) ? `0${counter}` : counter;
                if (counter === 60) {
                    counter = 0;
                    seconds = `00`;
                    minutes += 1;
                };
                timerBlock.textContent = `${(minutes < 10) ? `0${minutes}` : minutes}:${seconds}`;
            }, 1000);
        },
    };

    const moves = {
        getElement() {
            return  document.querySelector('.moves-moves');
        },
        changeMove() {
            totalMoves += 1;
            this.getElement().textContent = totalMoves;
        },
        clearMoves() {
            totalMoves = 0;
            this.getElement().textContent = totalMoves;
        },
    };

    appElements.render();
    board.render();
    gameResults.getResultsToWin();
};

document.addEventListener('DOMContentLoaded', init);