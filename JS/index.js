function init() {

    let gameTimer = 0;
    let totalMoves = (localStorage.getItem('moves')) ? +localStorage.getItem('moves') : 0;

    let player = new Audio('./assets/audio/audio-cell.mp3');
    let clickSound = new Audio('./assets/audio/clickSound.mp3');

    let resultToWin = [];

    const config = {
        size: 3,
    }; 

    let counter = (localStorage.getItem('counter')) ? +localStorage.getItem('counter') : 0;
    let seconds = (localStorage.getItem('seconds')) ? +localStorage.getItem('seconds') : 0;
    let minutes = (localStorage.getItem('minutes')) ? +localStorage.getItem('minutes') : 0;

    if (localStorage.getItem('size')) config.size = +localStorage.getItem('size');

    const TOTAL_GAME_SIZES = ['3x3', '4x4', '5x5', '6x6', '7x7', '8x8'];

    const saving = {
        saveBoard() {
            const currentBoard = [];

            for (let i = 0; i < config.size; i++) {
                for (let j = 0; j < config.size; j++) {
                    let cell = +document.getElementById(`${i}-${j}`).textContent;
                    (cell === 0) ? currentBoard.push(null) : currentBoard.push(cell);
                };
            };

            localStorage.setItem('board', JSON.stringify(currentBoard));

            localStorage.setItem('size', config.size);
            localStorage.setItem('moves', totalMoves);
            
            localStorage.setItem('counter', counter);
            localStorage.setItem('seconds', seconds);
            localStorage.setItem('minutes', minutes);
        },
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
            player.play();  
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
                timer.resetTimer();
                board.render(true);
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
            movesTotal.textContent = totalMoves;

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
            const container = document.querySelector('.container');
            container.classList.remove('board-very-small', 'board-small', 'board-medium', 'board-standart', 'board-large', 'board-very-large');
            const board = document.createElement('div');

            switch (config.size) {
                case 3: 
                    board.classList.add('board-very-small');
                    container.classList.add('board-very-small');
                    break;
                case 4:
                    board.classList.add('board-small');
                    container.classList.add('board-small');
                    break;
                case 5:
                    board.classList.add('board-medium');
                    container.classList.add('board-medium');
                    break;
                case 6:
                    board.classList.add('board-standart');
                    container.classList.add('board-standart');
                    break;
                case 7:
                    board.classList.add('board-large');
                    container.classList.add('board-large');
                    break;
                case 8:
                    board.classList.add('board-very-large');
                    container.classList.add('board-very-large');
                    break;
            };
            
            board.classList.add('board');
            return board;
        },
        generateNumbers() {
            let genereatedArray = [null];

            for (let i = 1; i <= (config.size ** 2) - 1; i++) {
                genereatedArray.push(i);
            };

            genereatedArray = genereatedArray.sort(() => Math.random() - 0.5);

            let counter = 0;
            for (let i = 0; i < genereatedArray.length; i++) {
                let currentCounter = 0;
                let nestedArray = genereatedArray.concat().slice(i + 1);
                for (let j = 0; j < nestedArray.length; j++) {
                    if (genereatedArray[i] > nestedArray[j] && nestedArray[j] !== null) currentCounter += 1;
                };
                counter += currentCounter;
                currentCounter = 0;
            };
            if (counter % 2 === 0) {
                return genereatedArray
            } else {
                return this.generateNumbers();
            }

        },
        render(reset) {
            const puzzleGame = board.getElement();
            const gameBoard = board.createBoard();

            puzzleGame.innerHTML = '';
            puzzleGame.append(gameBoard);

            gameBoard.innerHTML = '';

            let cellsArray = [];

            if (reset) {
                cellsArray = board.generateNumbers();
            } else {
                cellsArray = (localStorage.getItem('board')) ? JSON.parse(localStorage.getItem('board')) : board.generateNumbers();
            };

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
        resetTimer() {
            counter = 0;
            minutes = 0;
            seconds = 0;
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

    const settings = {
        createSettings() {
            const settings = document.createElement('div');
            const settingHeading = document.createElement('h3');    
            const sizeList = document.createElement('ul');

            for (let key of TOTAL_GAME_SIZES) {
                const sizeItem = document.createElement('li');
                const sizeButton = document.createElement('button');

                sizeItem.classList.add('settings-item');
                sizeButton.classList.add('size-button');
                if (+key[0] === config.size) sizeButton.classList.add('size-button_active');

                sizeButton.addEventListener('click', this.changeSize);
                sizeButton.textContent = key;
                sizeButton.value = +key[0];

                sizeItem.append(sizeButton);
                sizeList.append(sizeItem);
            };

            settings.classList.add('game-settings');
            sizeList.classList.add('settings-list');
            settingHeading.classList.add('settings-heading');

            settingHeading.textContent = 'Board size:';

            settings.append(settingHeading, sizeList);
            return settings;
        },
        changeSize(e) {
            document.querySelectorAll('.size-button').forEach((item => item.classList.remove('size-button_active')));
            e.target.classList.add('size-button_active');
            config.size = +e.target.value;
            board.render(true);
            timer.resetTimer();
            moves.clearMoves();
        },
        render() {
            const container = document.querySelector('.container');
            const settingsButton = document.querySelector('.settings-button');

            settingsButton.addEventListener('click', () => {
                clickSound.play();
                document.querySelector('.game-settings').classList.toggle('game-settings_open');
                document.querySelector('.wrapper').classList.toggle('wrapper_open');
            });

            container.append(this.createSettings())
        },
    };

    window.addEventListener('beforeunload', () => saving.saveBoard());

    appElements.render();
    board.render();
    gameResults.getResultsToWin();
    settings.render();
};

document.addEventListener('DOMContentLoaded', init);