function init() {

    const config = {
        size: 4,
    };

    const board =  {
        getElement() {
            return document.querySelector('.puzzle-game');
        },
        createBoard() {
            const board = document.createElement('div');
            board.classList.add('board');
            this.getElement().append(board);
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
            const board = this.createBoard();
            board.innerHTML = '';

            const cellsArray = this.generateNumbers();

            for (let i = 0; i < config.size; i++) {
                for (let j = 0; j < config.size; j++) {
                    const cell = document.createElement('div');
                    cell.classList.add('cell');
                    cell.style.left = `${22 + (118 * j) + (10 * j)}px`;
                    cell.style.top = `${22 + (118 * i) + (10 * i)}px`;
                    cell.textContent = cellsArray.shift();
                    board.append(cell);
                };
            };
        },
    };

    board.render();
};

document.addEventListener('DOMContentLoaded', init);