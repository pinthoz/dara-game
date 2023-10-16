document.addEventListener('DOMContentLoaded', () => {
    const boardSizeSelect = document.querySelector('#board-size');
    const startGameButton = document.querySelector('#start-game');
    const gameContainer = document.querySelector('.game-container');
    const currentPlayerDisplay = document.querySelector('#current-player');
    const gameResultDisplay = document.querySelector('#game-result');

    let boardSize = boardSizeSelect;
    let currentPlayer = '1';
    let board = [];
    let isGameActive = false;
    let putPhase = true;
    let rowSelected = 0;
    let colSelected = 0;
    let playerBpieces = 12;
    let playerWpieces = 12;
    // Função para gerar o tabuleiro com base no tamanho selecionado
    function generateBoard() {
        if (boardSize === 6){
        gameContainer.innerHTML = '';
        board = new Array(boardSize).fill('').map(() => new Array(boardSize).fill(''));
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', () => handleCellClick(row, col));
                gameContainer.appendChild(cell);
            }
        }
    }else{
        const numRows = 6; // Defina o número de linhas
        const numCols = 5; // Defina o número de colunas

        gameContainer.innerHTML = '';
        board = new Array(numRows).fill('').map(() => new Array(numCols).fill(''));

        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', () => handleCellClick(row, col));
                gameContainer.appendChild(cell);
        }
    }
    
    }
}

        


    // Função para lidar com o clique em uma célula

    function handleCellClick(row, col) {
        let possible = possible_play(row, col, currentPlayer);

        if (!isGameActive || board[row][col]) return;

        if (putPhase) {
            // Verifique se o jogador ainda tem peças disponíveis
            if (currentPlayer === '1' && playerBpieces > 0) {
                if (possible) {
                    const playerClass = '2';
                    board[row][col] = playerClass;
                    renderBoard();
                    playerBpieces--;
                } else {
                    alert('Jogada Inválida');
                }
            } else if (currentPlayer === '2' && playerWpieces > 0) {
                if (possible) {
                    const playerClass = '1';
                    board[row][col] = playerClass;
                    renderBoard();
                    playerWpieces--;
                } else {
                    alert('Jogada Inválida');
                }
            } else {
                alert('Você já colocou todas as peças permitidas durante a fase de colocação.');
            }

            console.log(playerBpieces, playerWpieces);

            if (playerBpieces === 0 && playerWpieces === 0) {
                putPhase = false;
                currentPlayer = '1'; // ou 'Preto', dependendo de quem deve começar após a fase de colocação
                currentPlayerDisplay.textContent = currentPlayer;
            }
        } else {
            alert('Jogada Inválida');
        }

        // Troca o jogador atual
        if (currentPlayer === '1') {
            currentPlayer = '2';
        } else {
            currentPlayer = '1';
        }
        currentPlayerDisplay.textContent = currentPlayer;
    }



    // Função para renderizar o tabuleiro atual
    function renderBoard() {
        if (boardSize === 6) {
            for (let row = 0; row < boardSize; row++) {
                for (let col = 0; col < boardSize; col++) {
                    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                    cell.textContent = '';
    
                    // Verifica a classe da célula e define o background-image correspondente
                    if (board[row][col] === '1') {
                        cell.style.backgroundImage = 'url(/assets/"white.png")'; // Substitua o caminho correto da imagem
                    } else if (board[row][col] === '2') {
                        cell.style.backgroundImage = 'url("/assets/black.png")'; // Substitua o caminho correto da imagem
                    } else {
                        cell.style.backgroundImage = 'none'; // Limpa o background-image se não houver jogador na célula
                    }
                }
            }
        } else {
            const numRows = 6;
            const numCols = 5;
    
            for (let row = 0; row < numRows; row++) {
                for (let col = 0; col < numCols; col++) {
                    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                    cell.textContent = '';
    
                    // Verifica a classe da célula e define o background-image correspondente
                    if (board[row][col] === '1') {
                        cell.style.backgroundImage = 'url("/assets/white.png")'; // Substitua o caminho correto da imagem
                    } else if (board[row][col] === '2') {
                        cell.style.backgroundImage = 'url("/assets/black.png")'; // Substitua o caminho correto da imagem
                    } else {
                        cell.style.backgroundImage = 'none'; // Limpa o background-image se não houver jogador na célula
                    }
                }
            }
        }
    }

    function possible_play(i, j, currentPlayer) {
        // Check is Empty
        if (board[i][j] !== '') {
            console.log('false - Cell is not empty');
            return false;
        }
    
        if (!putPhase) {
            board[rowSelected][colSelected] = 0;
        }
    
        board[i][j] = currentPlayer;
    
        // Check Horizontal
        let min = Math.max(0, j - 3);
        let max = Math.min(boardSize - 1, j);

        for (let k = min; k <= max; k++) {
            if (
            currentPlayer === board[i][k] &&
            board[i][k] === board[i][k + 1] &&
            board[i][k + 1] === board[i][k + 2] &&
            board[i][k + 2] === board[i][k + 3]
        ) {
            board[i][j] = 0;
            if (!putPhase) {
                board[rowSelected][colSelected] = currentPlayer;
            }
            return false;
        }
        }
    
        // Check Vertical
        min = Math.max(0, i - 3);
        max = Math.min(boardSize - 1, i);
    
        for (let k = min; k <= max; k++) {
            if (
            currentPlayer === board[k][j] &&
            board[k][j] === board[k + 1][j] &&
            board[k + 1][j] === board[k + 2][j] &&
            board[k + 2][j] === board[k + 3][j]
        ) {
            board[i][j] = 0;
            if (!putPhase) {
                board[rowSelected][colSelected] = currentPlayer;
            }
            return false;
        }
        }
    
        board[i][j] = '';
        if (!putPhase) {
            board[rowSelected][colSelected] = currentPlayer;
        }
        console.log('true - Move is possible');
        return true;
    }
    

    // Event listener para o botão "Iniciar Jogo"
    startGameButton.addEventListener('click', () => {
        boardSize = parseInt(boardSizeSelect.value);
        gameContainer.style.gridTemplateColumns = `repeat(${boardSize}, 50px)`; // Ajusta o número de colunas
        generateBoard();
        currentPlayer = '1';
        currentPlayerDisplay.textContent = currentPlayer;
        gameResultDisplay.textContent = '';
        isGameActive = true;

        // Adiciona a classe "active" ao elemento ".game-info"
        const gameInfoElement = document.querySelector('.game-info');
        gameInfoElement.classList.add('active');

    });



});