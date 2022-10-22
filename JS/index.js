function init() {

    const mq = window.matchMedia('(max-width: 1078px)')

    let gameTimer = 0;
    let isWin = false;
    let totalMoves = (localStorage.getItem('moves')) ? +localStorage.getItem('moves') : 0;

    let cellSound = new Audio('./assets/audio/audio-cell.mp3');
    let clickSound = new Audio('./assets/audio/clickSound.m4a');
    let restartSound = new Audio('./assets/audio/restartSound.m4a');
    let tabSound = new Audio('./assets/audio/tabSound.m4a');

    let resultToWin = [];
    let leaderboard = (localStorage.getItem('leaderboard')) ? JSON.parse(localStorage.getItem('leaderboard')) : [];

    const config = {
        size: 3,
        sound: true,
    }; 

    let counter = (localStorage.getItem('counter')) ? +localStorage.getItem('counter') : 0;
    let seconds = (localStorage.getItem('seconds')) ? +localStorage.getItem('seconds') : 0;
    let minutes = (localStorage.getItem('minutes')) ? +localStorage.getItem('minutes') : 0;

    if (localStorage.getItem('size')) config.size = +localStorage.getItem('size');

    const TOTAL_GAME_SIZES = ['3x3', '4x4', '5x5', '6x6', '7x7', '8x8'];

    const createApp = {
        createMainElements() {
            const main = document.createElement('main');
            const wrapper = document.createElement('div');
            const container = document.createElement('div');
            const gameHeading = document.createElement('div');
            const gameTop = document.createElement('div');
            const topButtons = document.createElement('div');
            const settingButton = document.createElement('button');
            const volumeButton = document.createElement('button');
            const puzzleGame = document.createElement('div');
            const topButtonsMenu = document.createElement('div');

            wrapper.classList.add('wrapper');
            container.classList.add('container');
            puzzleGame.classList.add('puzzle-game');
            gameHeading.classList.add('puzzle-game__heading');
            gameTop.classList.add('puzzle-game__top');
            topButtons.classList.add('top-buttons');
            topButtonsMenu.classList.add('top-buttons-menu');
            settingButton.classList.add('settings-button');
            volumeButton.classList.add('volume-button');

            topButtonsMenu.append(volumeButton, settingButton)
            gameTop.append(topButtons, topButtonsMenu);
            container.append(gameHeading, gameTop, puzzleGame);
            main.append(container);

            document.body.append(wrapper, main);
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

            button.addEventListener('click', () => {
                if (config.sound) restartSound.play();
                gameResults.resetGame();
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
        leaderboardButton() {
            const leaderboards = document.createElement('div');

            const button = document.createElement('button');
            const list = document.createElement('ul');

            leaderboards.classList.add('leaderboards');
            list.classList.add('leaderboards-list');

            button.classList.add('leaderboard-button');
            button.textContent = 'Leaderboard';

            button.addEventListener('click', () => {
                if (config.sound) tabSound.play();
                list.classList.toggle('leaderboards-list_active');
                button.classList.toggle('leaderboard-button_active');
            });

            leaderboards.append(button, list);
            this.getElement().append(leaderboards);
            this.createLeaderBoards();
        },
        createLeaderBoards() {
            const list = document.querySelector('.leaderboards-list');
            list.innerHTML = '';

            let leaderboard = this.sortLeaderboards();

            const itemMain = document.createElement('li');
            const scoreMain = document.createElement('div');
            const positionMain = document.createElement('div');
            const timeMain = document.createElement('div');
            const moveMain = document.createElement('div');

            scoreMain.classList.add('leaderboards-score');
            itemMain.classList.add('leaderboards-item');

            scoreMain.classList.add('leaderboards-score');
            itemMain.classList.add('leaderboards-item');

            positionMain.textContent = 'Position';
            timeMain.textContent = 'Total Time';
            moveMain.textContent = 'Total Moves';

            positionMain.classList.add('leaderboards-score-position');

            scoreMain.append(timeMain, moveMain);
            itemMain.append(positionMain, scoreMain);
            list.append(itemMain);

            for (let i = 0; i < leaderboard.length; i++) {
                const item = document.createElement('li');
                const score = document.createElement('div');
                const position = document.createElement('div');
                const time = document.createElement('div');
                const move = document.createElement('div');

                score.classList.add('leaderboards-score');
                item.classList.add('leaderboards-item');
                position.classList.add('leaderboards-score-position');

                position.textContent = i + 1;
                time.textContent = leaderboard[i].time;
                move.textContent = leaderboard[i].moves;

                score.append(time, move);
                item.append(position, score);
                list.append(item);
            };
        },
        sortLeaderboards() {
            leaderboard = leaderboard.sort((a,b) => a.moves - b.moves).slice(0,10);
            return leaderboard;
        },
        render() {
            this.restartButton();
            this.leaderboardButton();
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
            const board = document.createElement('div');

            container.classList.remove('board-very-small', 'board-small', 'board-medium', 'board-standart', 'board-large', 'board-very-large');
        
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

            // validation

            let counter = 0;
            
            for (let i = 0; i < genereatedArray.length; i++) {
                let numberCounter = 0;
                let nestedArray = genereatedArray.concat().slice(i + 1);
                for (let j = 0; j < nestedArray.length; j++) {
                    if (genereatedArray[i] > nestedArray[j] && nestedArray[j] !== null) numberCounter += 1;
                };
                counter += numberCounter;
                numberCounter = 0;
            };

            if (counter % 2 === 0) {
                return genereatedArray
            } else {
                return this.generateNumbers();
            };

        },
        render(reset) {
            isWin = false;

            const puzzleGame = board.getElement();
            const gameBoard = board.createBoard();

            puzzleGame.innerHTML = '';
            gameBoard.innerHTML = '';

            puzzleGame.append(gameBoard);

            let cellsArray = [];

            if (reset) {
                cellsArray = board.generateNumbers();
            } else {
                cellsArray = (localStorage.getItem('board')) ? JSON.parse(localStorage.getItem('board')) : board.generateNumbers();
            };

            for (let i = 0; i < config.size; i++) {
                for (let j = 0; j < config.size; j++) {
                    const cell = document.createElement('div');
                    const cellNumber = cellsArray.shift();

                    if (cellNumber === null) {
                        cell.classList.add('cell-empty');
                        cell.dataset.isEmpty = 'empty';

                        const allowDrop = (e) => e.preventDefault();
                        const drop = (e) => move.checkDragable(e.dataTransfer.getData('id'));

                        cell.ondragover = allowDrop;
                        cell.ondrop = drop;

                    } else {
                        cell.textContent = cellNumber;
                    };

                    cell.id = `${i}-${j}`;

                    if (mq.matches) {
                        cell.style.left = `${(100 / 1078 * (22 + (118 * j) + (10 * j))).toFixed(1)}vw`;
                        cell.style.top = `${(100 / 1078 * (22 + (118 * i) + (10 * i))).toFixed(1)}vw`;
                    } else {
                        cell.style.left = `${22 + (118 * j) + (10 * j)}px`;
                        cell.style.top = `${22 + (118 * i) + (10 * i)}px`;
                    };
                    
                    cell.classList.add('cell');

                    const drag = (e) => e.dataTransfer.setData('id', e.target.id);

                    cell.draggable = true;
                    cell.ondragstart = drag;

                    cell.addEventListener('click', (e) => {
                        move.checkPosition(e);
                    });

                    gameBoard.append(cell);
                };
            };

            timer.gameTime();
        },
    };

    const move = {
        checkDragable(id) {
            currentCell = id;

            const currentI = +currentCell.split('-')[0];
            const currentJ = +currentCell.split('-')[1];

            const checkLeft = document.getElementById(`${currentI}-${currentJ - 1}`);
            const checkRight = document.getElementById(`${currentI}-${currentJ + 1}`);
            const checkTop = document.getElementById(`${currentI - 1}-${currentJ}`);
            const checkBottom = document.getElementById(`${currentI + 1}-${currentJ}`);

            if (checkLeft && checkLeft.dataset.isEmpty)  {
                move.nextPosition(checkLeft, document.getElementById(id));
            } else if (checkRight && checkRight.dataset.isEmpty) {
                move.nextPosition(checkRight, document.getElementById(id));
            } else if (checkTop && checkTop.dataset.isEmpty) {
                move.nextPosition(checkTop, document.getElementById(id));
            } else if (checkBottom && checkBottom.dataset.isEmpty) {
                move.nextPosition(checkBottom, document.getElementById(id));
            };

            
        },
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

            moves.changeMove();
            if (config.sound) cellSound.play(); 

            if (isWin) {
                isWin = false;
                gameResults.resetGame();
            };
            gameResults.checkWin();
        },
    };

    const gameResults = {
        getResultsToWin() {
            resultToWin = [];
            
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
                    if (+document.getElementById(findBy).textContent !== resultToWin[counter]) return;
                    counter += 1;
                };
            };
            gameResults.userWin();
        },
        userWin() {
            const winTitle = document.createElement('h2');

            winTitle.classList.add('win-title');
            winTitle.textContent = `Hooray! You solved the puzzle in ${(minutes < 10) ? `0${minutes}` : minutes}:${seconds} and ${totalMoves} moves!`;

            leaderboard.push({time: `${(minutes < 10) ? `0${minutes}` : minutes}:${seconds}`, moves: totalMoves});
            localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

            appElements.createLeaderBoards();

            isWin = true;
            clearInterval(gameTimer);

            document.querySelector('.puzzle-game__heading').prepend(winTitle);
            leaderboards.leaderboardOpen();
        },
        resetGame() {
            timer.resetTimer();
            board.render(true);
            moves.clearMoves();

            isWin = false;

            document.querySelector('.puzzle-game__heading').innerHTML = '';
            leaderboards.leaderboardClose();
        },
    };

    const saving = {
        saveBoard() {
            const currentBoard = [];

            for (let i = 0; i < config.size; i++) {
                for (let j = 0; j < config.size; j++) {
                    let cell = +document.getElementById(`${i}-${j}`).textContent;
                    (cell === 0) ? currentBoard.push(null) : currentBoard.push(cell);
                };
            };

            if (!isWin) {
                localStorage.setItem('board', JSON.stringify(currentBoard));

                localStorage.setItem('size', config.size);
                localStorage.setItem('moves', totalMoves);
                
                localStorage.setItem('counter', counter);
                localStorage.setItem('seconds', seconds);
                localStorage.setItem('minutes', minutes);
            } else {
                localStorage.removeItem('board');

                localStorage.removeItem('size');
                localStorage.removeItem('moves');
                
                localStorage.removeItem('counter');
                localStorage.removeItem('seconds');
                localStorage.removeItem('minutes');
            };
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

                sizeButton.addEventListener('click', (e) => {
                    if (config.sound) clickSound.play();
                    this.changeSize(e);
                });
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
            gameResults.getResultsToWin();
            board.render(true);
            timer.resetTimer();
            moves.clearMoves();
        },
        render() {
            const container = document.querySelector('.container');
            const settingsButton = document.querySelector('.settings-button');

            settingsButton.addEventListener('click', () => {
                if (config.sound) clickSound.play();
                document.querySelector('.game-settings').classList.toggle('game-settings_open');
                document.querySelector('.wrapper').classList.toggle('wrapper_open');
            });

            container.append(this.createSettings())
        },
    };

    const sound = {
        getElement() {
            return document.querySelector('.volume-button');
        },
        changeSound() {
            this.getElement().addEventListener('click', () => {
                if (config.sound) clickSound.play();
                config.sound = !config.sound;
                this.getElement().classList.toggle('volume-button_disabled');
            });
        },
    };

    const leaderboards = {
        getElement() {
            return {
                list: document.querySelector('.leaderboards-list'),
                button: document.querySelector('.leaderboard-button'),
            };
        },
        leaderboardOpen() {
            this.getElement().list.classList.add('leaderboards-list_active');
            this.getElement().button.classList.add('leaderboard-button_active');
        },
        leaderboardClose() {
            this.getElement().list.classList.remove('leaderboards-list_active');
            this.getElement().button.classList.remove('leaderboard-button_active');
        },
    };

    window.addEventListener('beforeunload', () => saving.saveBoard());

    createApp.createMainElements();
    appElements.render();
    board.render();
    gameResults.getResultsToWin();
    settings.render();
    sound.changeSound();

    const mediaQuery = window.matchMedia('(max-width: 1078px)')
    function handleTabletChange(e) {
      if (e.matches) {
        gameResults.resetGame();
      } else {
        gameResults.resetGame();
      };
    };
    mediaQuery.addListener(handleTabletChange)
    handleTabletChange(mediaQuery)
};

document.addEventListener('DOMContentLoaded', init);