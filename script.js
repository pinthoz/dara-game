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
        if (boardSize === 6) {
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
        } else {
            let numRows = 6; // Defina o número de linhas
            let numCols = 5; // Defina o número de colunas
    
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
                if(!possible_remove(row,col,currentPlayer)){
                    handlePieceMovement(row, col);
                }
                else{
                    handleRemovePiece(row, col, currentPlayer);
                }
                
            }
        }
    }
    
    // Função para lidar com a fase de colocação de peças
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
    
    // Função para lidar com a seleção de peças
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
    
    // Função para lidar com o movimento de peças
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

    function handleRemovePiece(row, col, currentPlayer) {
        if (possible_remove(row, col, currentPlayer)) {
            board[row][col] = 0;

            // Remova a classe que torna a peça visível
            const selectedCellsClass = currentPlayer === '1' ? 'selected-cell-white' : 'selected-cell-black';
            const selectedCells = document.querySelectorAll(`.${selectedCellsClass}`);
            selectedCells.forEach(cell => cell.classList.remove(selectedCellsClass));
            currentPlayer = '3' - currentPlayer;
            currentPlayerDisplay.textContent = currentPlayer;
            pieceSelected = false;
            renderBoard();
        }
    }


    function possible_remove(row,col,currentPlayer){
    
        
        // Verifica Vertical
        let toplim = Math.max(0,row-2)
        let bottomlim = Math.min(3,row)
    
        for (let i=toplim;i<=bottomlim;i++){
            if (currentPlayer == board[i][col] && board[i][col] == board[i+1][col] && board[i+1][col] == board[i+2][col]){
                console.log("É possível remover uma peça")
                return true
            }
        }

        //Verifica Horizontal
        let leftlim = Math.max(0,col-2)
        let rightlim = Math.min(2,col)
        
        for (let i=leftlim;i<=rightlim;i++){
            if (currentPlayer == board[row][i] && board[row][i] == board[row][i+1] && board[row][i+1] == board[row][i+2]){
                return true
            }
        }
        return false
    }
    
    



/*
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
}*/



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
        // Check if the cell is out of bounds
        if (i < 0 || i >= board.length || j < 0 || j >= board[i].length) {
            console.log('false - Cell is out of bounds');
            return false;
        }
    
        // Check if the cell is not empty
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
        let rightlim = Math.min(board[i].length - 1, j + 3);
    
        for (let k = leftlim; k <= rightlim - 3; k++) {
            if (
                currentPlayer === (board[i][k] || 0) &&
                currentPlayer === (board[i][k + 1] || 0) &&
                currentPlayer === (board[i][k + 2] || 0) &&
                currentPlayer === (board[i][k + 3] || 0)
            ) {
                board[i][j] = 0;  // Set it back to an empty cell
                return false;
            }
        }
    
        // Check Vertical
        let toplim = Math.max(0, i - 3);
        let bottomlim = Math.min(board.length - 1, i + 3);
    
        for (let k = toplim; k <= bottomlim - 3; k++) {
            if (
                currentPlayer === (board[k][j] || 0) &&
                currentPlayer === (board[k + 1][j] || 0) &&
                currentPlayer === (board[k + 2][j] || 0) &&
                currentPlayer === (board[k + 3][j] || 0)
            ) {
                board[i][j] = 0;  // Set it back to an empty cell
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
                    if (board[row][col] === '1') {
                        cell.style.backgroundImage = 'url("/assets/white.png")';
                    } else if (board[row][col] === '2') {
                        cell.style.backgroundImage = 'url("/assets/black.png")';
                    } else {
                        cell.style.backgroundImage = 'none';
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
                    if (board[row][col] === '1') {
                        cell.style.backgroundImage = 'url("/assets/white.png")';
                    } else if (board[row][col] === '2') {
                        cell.style.backgroundImage = 'url("/assets/black.png")';
                    } else {
                        cell.style.backgroundImage = 'none';
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
