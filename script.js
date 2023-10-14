document.addEventListener('DOMContentLoaded', () => {
    const boardSizeSelect = document.querySelector('#board-size');
    const startGameButton = document.querySelector('#start-game');
    const gameContainer = document.querySelector('.game-container');
    const currentPlayerDisplay = document.querySelector('#current-player');
    const gameResultDisplay = document.querySelector('#game-result');

    let boardSize = boardSizeSelect;
    let currentPlayer = 'Branco';
    let board = [];
    let isGameActive = false;

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
// Função para lidar com o clique em uma célula
    function handleCellClick(row, col) {
        if (!isGameActive || board[row][col]) return;

        // Exemplo simples: alternar entre "playerB" e "playerW"
        const playerClass = currentPlayer === 'Branco' ? 'playerB' : 'playerW';
        board[row][col] = playerClass;
        renderBoard();
        currentPlayer = currentPlayer === 'Branco' ? 'Preto' : 'Branco';
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
                    if (board[row][col] === 'playerW') {
                        cell.style.backgroundImage = 'url(/assets/"white.png")'; // Substitua o caminho correto da imagem
                    } else if (board[row][col] === 'playerB') {
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
                    if (board[row][col] === 'playerW') {
                        cell.style.backgroundImage = 'url("/assets/white.png")'; // Substitua o caminho correto da imagem
                    } else if (board[row][col] === 'playerB') {
                        cell.style.backgroundImage = 'url("/assets/black.png")'; // Substitua o caminho correto da imagem
                    } else {
                        cell.style.backgroundImage = 'none'; // Limpa o background-image se não houver jogador na célula
                    }
                }
            }
        }
    }

    // Event listener para o botão "Iniciar Jogo"
    startGameButton.addEventListener('click', () => {
        boardSize = parseInt(boardSizeSelect.value);
        gameContainer.style.gridTemplateColumns = `repeat(${boardSize}, 50px)`; // Ajusta o número de colunas
        generateBoard();
        currentPlayer = 'Branco';
        currentPlayerDisplay.textContent = currentPlayer;
        gameResultDisplay.textContent = '';
        isGameActive = true;

        // Adiciona a classe "active" ao elemento ".game-info"
        const gameInfoElement = document.querySelector('.game-info');
        gameInfoElement.classList.add('active');

    });



});