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
    let pieceSelected = false;
    let past_moves = [-1,-1,-1,-1,-1,-1,-1,-1];



    function tupleToString(tuple) {
        return JSON.stringify(tuple);
    }
    
    // Function to convert a string back to a tuple
    function stringToTuple(str) {
        return JSON.parse(str);
    }


    // Função para gerar o tabuleiro com base no tamanho selecionado
    function generateBoard() {
        if (boardSize === 6){
        gameContainer.innerHTML = '';
        board = new Array(boardSize).fill(0).map(() => new Array(boardSize).fill(0));
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
        board = new Array(numRows).fill(0).map(() => new Array(numCols).fill(0));

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
        if (!isGameActive) return;
    
        if (putPhase) {
            handlePlacementPhase(row, col);
        } else {
            if (!pieceSelected) {
                handlePieceSelection(row, col);
            } else {
                handlePieceMovement(row, col);
            }
        }
    }
    
    function handlePlacementPhase(row, col) {
        let canPlacePiece = possible_play(row, col, currentPlayer);
    
        if (canPlacePiece) {
            if (currentPlayer === '1' && playerBpieces > 0) {
                renderBoard();
                playerBpieces--;
            } else if (currentPlayer === '2' && playerWpieces > 0) {
                renderBoard();
                playerWpieces--;
            }
    
            currentPlayer = currentPlayer === '1' ? '2' : '1';
            currentPlayerDisplay.textContent = currentPlayer;
        } else {
            console.log('Jogada Inválida');
        }
    
        console.log('Peças restantes - Jogador 1:', playerBpieces, 'Jogador 2:', playerWpieces);
    
        if (playerBpieces === 0 && playerWpieces === 0) {
            putPhase = false;
            console.log('Você já colocou todas as peças permitidas durante a fase de colocação.');
            currentPlayer = '1'; // jogador branco
            currentPlayerDisplay.textContent = currentPlayer;
        }
    }
    
    function handlePieceSelection(row, col) {
        if (possible_click(row, col, currentPlayer)) {
            rowSelected = row;
            colSelected = col;
            pieceSelected = true;
    
            // Adiciona uma classe de seleção visual
            const selectedCellsClass = currentPlayer === '1' ? 'selected-cell-white' : 'selected-cell-black';
            const selectedCells = document.querySelectorAll(`.${selectedCellsClass}`);
            selectedCells.forEach(cell => cell.classList.remove(selectedCellsClass));
    
            // Adiciona a classe de seleção à célula atual
            const selectedCell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            selectedCell.classList.add(selectedCellsClass);
        } else {
            console.log('Peça não pode ser selecionada');
        }
    }
    
    
    function handlePieceMovement(row, col) {
        if (row == rowSelected && col == colSelected) {
            pieceSelected = false;
            const selectedCellsClass = currentPlayer === '1' ? 'selected-cell-white' : 'selected-cell-black';
            const selectedCell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            selectedCell.classList.remove(selectedCellsClass);
        } else {
            if (possible_play(row, col, currentPlayer) && possible_move(row, col, rowSelected, colSelected) && !repeat(past_moves, row, col, rowSelected, colSelected, currentPlayer)) {
                board[row][col] = currentPlayer;
                board[rowSelected][colSelected] = 0;
                renderBoard();
                past_moves[(currentPlayer - 1) * 4] = rowSelected;
                past_moves[(currentPlayer - 1) * 4 + 1] = colSelected;
                past_moves[(currentPlayer - 1) * 4 + 2] = row;
                past_moves[(currentPlayer - 1) * 4 + 3] = col;
                pieceSelected = false;
                currentPlayer = currentPlayer === '1' ? '2' : '1';
                currentPlayerDisplay.textContent = currentPlayer;
            } else {
                console.log('Não é possível mover a peça para essa posição');
            }
        }
    } 
    
    
    
    
    
    




function possiblePlays(currentPlayer) {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (board[i][j] === currentPlayer) {
                checkDirections(i, j, i + 1, j, currentPlayer);
                checkDirections(i, j, i, j + 1, currentPlayer);
                checkDirections(i, j, i - 1, j, currentPlayer);
                checkDirections(i, j, i, j - 1, currentPlayer);
            }
        }
    }
}



    function possible_click(i, j, currentPlayer) {
        if (board[i][j] === currentPlayer) {
            console.log('true - Cell is yours');
            return true;
        }
        console.log('false - Cell is not yours');
        return false;
    }

function possible_move(i,j, rowSelected, colSelected){
    if (i === rowSelected && Math.abs(j -colSelected) === 1) {
        return true;
    }else if(j === colSelected && Math.abs(i - rowSelected) === 1){
        return true;    
    }else{
        return false;
    }
}

function repeat(lastmove,r,c,rselected,cselected,currPlayer){
    return lastmove[(currPlayer-1)*4]==rselected && lastmove[(currPlayer-1)*4+1]==cselected && lastmove[(currPlayer-1)*4+2]==r && lastmove[(currPlayer-1)*4+3]==c;
}


    function possible_play(i, j, currentPlayer) {
        // Check is Empty
        if (board[i][j] !== 0) {
            console.log('false - Cell is not empty');
            return false;
        }
    
        if (!putPhase) {
            board[rowSelected][colSelected] = 0;
        }
    
        board[i][j] = currentPlayer;
    
        // Check Horizontal
        let leftlim = Math.max(0, j - 3);
        let rightlim = Math.min(boardSize - 1, j);

        console.log("leftlim " + leftlim + " rightlim " + rightlim);

        for (let k = leftlim; k <= rightlim; k++) {
            console.log("|" + currentPlayer + "|" + board[i][k] + "|" + board[i][k + 1] + "|" +  board[i][k + 2] + "|" + board[i][k + 3]) + "|";
            if (
            currentPlayer === board[i][k] &&
            currentPlayer === board[i][k + 1] &&
            currentPlayer === board[i][k + 2] &&
            currentPlayer === board[i][k + 3]
        ) {
            board[i][j] = 0;
            return false;
        }
        }
    
        // Check Vertical
        leftlim = Math.max(0, i - 3);
        rightlim = Math.min(boardSize - 1, i);
    
        for (let k = leftlim; k <= rightlim; k++) {
            if (
            currentPlayer === board[k][j] &&
            currentPlayer === board[k + 1][j] &&
            currentPlayer === board[k + 2][j] &&
            currentPlayer === board[k + 3][j]
        ) {
            board[i][j] = '';
            return false;
        }
        }
        
        if (!putPhase) {
            board[rowSelected][colSelected] = currentPlayer;
        }
        console.log('true - Move is possible');
        return true;
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
                        cell.style.backgroundImage = 'url(/assets/"white.png")'; // Substitua o caleftlimho correto da imagem
                    } else if (board[row][col] === '2') {
                        cell.style.backgroundImage = 'url("/assets/black.png")'; // Substitua o caleftlimho correto da imagem
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
                        cell.style.backgroundImage = 'url("/assets/white.png")'; // Substitua o caleftlimho correto da imagem
                    } else if (board[row][col] === '2') {
                        cell.style.backgroundImage = 'url("/assets/black.png")'; // Substitua o caleftlimho correto da imagem
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
        currentPlayer = '1';
        currentPlayerDisplay.textContent = currentPlayer;
        gameResultDisplay.textContent = '';
        isGameActive = true;

        // Adiciona a classe "active" ao elemento ".game-info"
        const gameInfoElement = document.querySelector('.game-info');
        gameInfoElement.classList.add('active');

    });



});
