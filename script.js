document.addEventListener('DOMContentLoaded', () => {
    const boardSizeSelect = document.querySelector('#board-size');
    const startGameButton = document.querySelector('#start-game');
    const gameContainer = document.querySelector('.game-container');
    const currentPlayerDisplay = document.querySelector('#current-player');
    const gameResultDisplay = document.querySelector('#game-result');
    const firstPlayerSelect = document.querySelector('#first-play');

    //Para em vez de aparecer 1 ou 2 aparecer branco ou preto no html
    const playerNames = {
        '1': 'Branco',
        '2': 'Preto'
    };
    
    let player1;
    let boardSize = boardSizeSelect;
    let currentPlayer = player1;
    let board = [];
    let isGameActive = false;
    let putPhase = true;
    let rowSelected = 0;
    let colSelected = 0;
    let playerBpieces = 12;
    let playerWpieces = 12;
    let pieceSelected = false;
    let past_moves = [-1,-1,-1,-1,-1,-1,-1,-1];
    let canRemove = false;
    let win = 0;


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
            playerBpieces = 12;
            playerWpieces = 12;
            if (!pieceSelected) {
                handlePieceSelection(row, col);
            } else {
                if(canRemove){
                    console.log('chegou aqui');
                    handleRemovePiece(row, col, currentPlayer);
                    possible_win();
                }
                else{
                    if (possible_remove(row,col,currentPlayer)){
                        canRemove = true;
                        console.log("podes remover a peça");
                    }else{
                        handlePieceMovement(row, col);
                    }
                }
                
            }
        }
    }
    // Esta função já não tem o bug de não aparecer a peça selecionada, mas tem outros bugs....
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
            currentPlayerDisplay.textContent = playerNames[currentPlayer];
        } else {
            console.log('Jogada Inválida');
        }
    
        console.log('Peças restantes - Jogador 1:', playerBpieces, 'Jogador 2:', playerWpieces);
    
        if (playerBpieces === 0 && playerWpieces === 0) {
            putPhase = false;
            console.log('Você já colocou todas as peças permitidas durante a fase de colocação.');
            if (player1 === '2'){
                currentPlayer = '2'; // jogador preto
            }else{
            currentPlayer = '1'; // jogador branco
            }
            currentPlayerDisplay.textContent = playerNames[currentPlayer];
        }
    }
    
    // Função para lidar com a seleção de peças
    // Function to handle piece selection
    function handlePieceSelection(row, col) {
        if (possible_click(row, col, currentPlayer)) {
            rowSelected = row;
            colSelected = col;
            pieceSelected = true;
            // Atualize a classe da imagem da peça selecionada
            const selectedCell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (currentPlayer === '1') {
                selectedCell.style.backgroundImage = 'url("/assets/white-selected.png")';
            } else {
                selectedCell.style.backgroundImage = 'url("/assets/black-selected.png")';
            }
            // Atualize o estado da peça no tabuleiro
            board[row][col] = currentPlayer;
    
            console.log('Piece selected');
            console.log('Piece selected - Row:', rowSelected, 'Column:', colSelected);
            
            selectedCell.addEventListener('click', function handlePieceDeselection(event) {
                pieceSelected = false;
    
                // Restore the default background image
                if (currentPlayer === '1') {
                    selectedCell.style.backgroundImage = 'url("/assets/white.png")';
                } else {
                    selectedCell.style.backgroundImage = 'url("/assets/black.png")';
                }
    
                // Remove the deselection click event
                selectedCell.removeEventListener('click', handlePieceDeselection);
            });
        } else {
            console.log('Piece cannot be selected');
        }
    }

/*
    function handlePieceSelection(row, col) {

        if (possible_click(row, col, currentPlayer)) {
            rowSelected = row;
            colSelected = col;
            pieceSelected = true;
            
            console.log('Peça selecionada')
            console.log('Peça selecionada - Linha:', rowSelected, 'Coluna:', colSelected)
            // Adicione uma classe de seleção visual
            const selectedCellsClass = currentPlayer === '1' ? 'selected-cell-white' : 'selected-cell-black';
            const selectedCells = document.querySelectorAll(`.${selectedCellsClass}`);
    
            // Remova a classe de seleção da célula não selecionada
            for (let i = 0; i < selectedCells.length; i++) {
                if (selectedCells[i].dataset.row !== row || selectedCells[i].dataset.col !== col) {
                    selectedCells[i].classList.remove(selectedCellsClass);
                }
            }
    
            // Atualize a imagem de fundo da célula selecionada para a imagem da peça selecionada
            const selectedCell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (currentPlayer === '1') {
                selectedCell.style.backgroundImage = 'url("/assets/white-selected.png")'; 
            } else {
                selectedCell.style.backgroundImage = 'url("/assets/black-selected.png")'; 
            }
    
            // Adiciona um evento click à célula selecionada
            selectedCell.addEventListener('click', () => {
                // Verifique se a peça selecionada é a mesma peça que foi clicada
                if (rowSelected === row && colSelected === col) {
                // Remova a classe de seleção da célula
                if (currentPlayer === '1') {
                    selectedCell.style.backgroundImage = 'url("/assets/white.png")';
                }
                else{
                    selectedCell.style.backgroundImage = 'url("/assets/black.png")';
                }
    
            }
        });
        } else {
            console.log('Peça não pode ser selecionada');
        }
    }
*/
    
const LastPlay1 = {
    row: -1,
    col: -1,
    rowSelected: -1,
    colSelected: -1,
};

const LastPlay2 = {
    row: -1,
    col: -1,
    rowSelected: -1,
    colSelected: -1,
};





function go_back(row,col,rowSelected,colSelected,currentPlayer){
    if (currentPlayer == 1){
        if (row == LastPlay1.row && 
            col == LastPlay1.col && 
            rowSelected == LastPlay1.rowSelected 
            && colSelected == LastPlay1.colSelected)
            return false;
    }else{
        if (row == LastPlay2.row && 
            col == LastPlay2.col && 
            rowSelected == LastPlay2.rowSelected 
            && colSelected == LastPlay2.colSelected)
            return false;	
    }
    return true;

}
    // Função para lidar com o movimento de peças
    function handlePieceMovement(row, col) {
        if (row === rowSelected && col === colSelected) {
            pieceSelected = false;
        } else {
            console.log("possible_play " + possible_play(row, col, currentPlayer) + " possible_move " + possible_move(row, col, rowSelected, colSelected) + " go_back " + go_back(row, col, rowSelected, colSelected, currentPlayer));
            if (possible_play(row, col, currentPlayer) && possible_move(row, col, rowSelected, colSelected) && go_back(row, col, rowSelected, colSelected, currentPlayer)) {
                if (board[row][col] === 0) {
                    board[row][col] = currentPlayer;
                }
    
                if (currentPlayer == 1) {
                    LastPlay1.row = rowSelected;
                    LastPlay1.col = colSelected;
                    LastPlay1.rowSelected = row;
                    LastPlay1.colSelected = col;
                    console.log("LastPlay1: " + LastPlay1.row + " " + LastPlay1.col + " " + LastPlay1.rowSelected + " " + LastPlay1.colSelected);
                } else {
                    LastPlay2.row = rowSelected;
                    LastPlay2.col = colSelected;
                    LastPlay2.rowSelected = row;
                    LastPlay2.colSelected = col;
                    console.log("LastPlay2: " + LastPlay2.row + " " + LastPlay2.col + " " + LastPlay2.rowSelected + " " + LastPlay2.colSelected);
                }
    
                if (rowSelected !== row || colSelected !== col) {
                    board[rowSelected][colSelected] = 0;
                }

                renderBoard();
                pieceSelected = false;
                currentPlayer = currentPlayer === '1' ? '2' : '1';
                currentPlayerDisplay.textContent = playerNames[currentPlayer];
            } else {
                console.log('Não é possível mover a peça para essa posição');
            }
        }
    
        for (let i = 0; i < 6; i++) {
            console.log(board[i][0] + " " + board[i][1] + " " + board[i][2] + " " + board[i][3] + " " + board[i][4]);
        }
    }

    function handleRemovePiece(row, col, currentPlayer) {
            if(board[row][col] === 3 - currentPlayer){
                board[row][col] = 0;
            
            
            // Remova a classe que torna a peça visível
            const selectedCellsClass = currentPlayer === '1' ? 'selected-cell-black' : 'selected-cell-white';
            const selectedCells = document.querySelectorAll(`.${selectedCellsClass}`);
            selectedCells.forEach(cell => cell.classList.remove(selectedCellsClass));
            currentPlayer = '3' - currentPlayer;
            currentPlayerDisplay.textContent = playerNames[currentPlayer];
            if(currentPlayer === 1){
                playerBpieces--;
            }else{
                playerWpieces--;
            }
            pieceSelected = false;
            canRemove = false;
            renderBoard();
        }
    }


    //________________________________________________________



    function possible_remove(i,j,currentPlayer) {


        // Check Horizontal
        let leftlim = Math.max(0, j - 3);
        let rightlim = Math.min(board[i].length - 1, j + 3);
        
        //console.log("horizontal| top: "  + leftlim + " bottom: " + rightlim)
        
        for (let k = leftlim; k <= rightlim - 2; k++) {
            //console.log("hor row: "  + i + " | " + board[i][k] + " " + board[i][k + 1] + " " + board[i][k + 2]);
            if (
                currentPlayer === (board[i][k] || 0) &&
                currentPlayer === (board[i][k + 1] || 0) &&
                currentPlayer === (board[i][k + 2] || 0)
            ) {
                return true;
            }
        }
    
        // Check Vertical
        let toplim = Math.max(0, i - 3);
        let bottomlim = Math.min(board.length - 1, i + 3);
        
        //console.log("vertical| top: "  + toplim + " bottom: " + bottomlim)
        for (let k = toplim; k <= bottomlim - 2; k++) {
            //console.log("ver col: "  + k + " | " + board[k][j] + " " + board[k + 1][j] + " " + board[k + 2][j])
            if (
                currentPlayer === (board[k][j] || 0) &&
                currentPlayer === (board[k + 1][j] || 0) &&
                currentPlayer === (board[k + 2][j] || 0)
            ) {
                return true;
            }
        }
        return false;
    }
        /*// Verificar horizontal
        for (let i = 0; i < board.length; i++){
            for (let j = 0; j <= board[0].length-3; j++){
                if (currentPlayer === board[i][j] && 
                    currentPlayer === board[i][j+1] && 
                    currentPlayer === board[i][j+2]){
                    console.log("existe linha 3 horizontal");
                    return true;
                }
            }
        }
        
        // Verificar vertical
        for (let i = 0; i <= board.length-3; i++){
            for (let j = 0; j < board[0].length; j++){
                if (currentPlayer === board[i][j] && 
                    currentPlayer === board[i+1][j] && 
                    currentPlayer === board[i+2][j]){
                    console.log("existe linha 3 vertical");
                    return true;
                }
            }
        }
            return false;
        */
    
    


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

    function moves_available(currentPlayer, lastmove, numRows, numCols){
        for (let i = 0; i< numRows ; i++){
            for (let j = 0; j< numCols ; j++){
                if (board[i][j]==currentPlayer){
                    if (i>0){
                        if (possible_play(i+1,j,currentPlayer) && !repeat(lastmove,i+1,j,i,j,currentPlayer)){
                            return true;
                        }
                    }if (i<numRows-1){
                        if (possible_play(i-1,j,currentPlayer) && !repeat(lastmove,i-1,j,i,j,currentPlayer)){
                            return true;
                        }
                    }if (j>0){
                        if (possible_play(i,j+1,currentPlayer) && !repeat(lastmove,i,j+1,i,j,currentPlayer)){
                            return true;
                        }
                    }
                    if (j<numCols-1){
                        if (possible_play(i,j-1,currentPlayer) && !repeat(lastmove,i,j-1,i,j,currentPlayer)){
                            return true;
                        }
                    }
        }
    }
    }
    return false;
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
    
        board[i][j] = currentPlayer;
        
        if (!putPhase) {
            board[i][j] = 0;
        }

        // Check Horizontal
        let leftlim = Math.max(0, j - 3);
        let rightlim = Math.min(board[i].length - 1, j + 3);
        
        //console.log("horizontal| top: "  + leftlim + " bottom: " + rightlim)
        
        for (let k = leftlim; k <= rightlim - 3; k++) {
            console.log("hor row: "  + i + " | " + board[i][k] + " " + board[i][k + 1] + " " + board[i][k + 2] + " " + board[i][k + 3]);
            if (
                currentPlayer === (board[i][k] || 0 ) &&
                currentPlayer === (board[i][k + 1] || 0 ) &&
                currentPlayer === (board[i][k + 2] || 0 ) &&
                currentPlayer === (board[i][k + 3] || 0 )
            ) {
                board[i][j] = 0;  // Set it back to an empty cell
                console.log('false - Cell is 4 in line horizontal');
                return false;
            }
        }
    
        // Check Vertical
        let toplim = Math.max(0, i - 3);
        let bottomlim = Math.min(board.length - 1, i + 3);
        
        //console.log("vertical| top: "  + toplim + " bottom: " + bottomlim)
        for (let k = toplim; k <= bottomlim - 3; k++) {
            console.log("ver col: "  + k + " | " + board[k][j] + " " + board[k + 1][j] + " " + board[k + 2][j] + " " + board[k + 3][j])
            if (
                currentPlayer === (board[k][j] || 0) &&
                currentPlayer === (board[k + 1][j] || 0) &&
                currentPlayer === (board[k + 2][j] || 0) &&
                currentPlayer === (board[k + 3][j] || 0)
            ) {
                board[i][j] = 0;  // Set it back to an empty cell
                console.log('false - Cell is 4 in line vertical');
                return false;
            }
        }
    
        if (!putPhase) {
            board[i][j] = 0;
        }
    
        console.log('true - Move is possible');
        return true;
    }  

    function possible_win(){
        if (currentPlayer == 1){
            if (playerBpieces <= 2 || !moves_available(1,past_moves,board.length,board[0].length)){
                winner = 2;
                game_finished(winner);
            }
            return;
        }
        if (currentPlayer == 2){
            if (playerWpieces <= 2 || !moves_available(1,past_moves,board.length,board[0].length)){
                winner = 1;
                game_finished(winner);
            }
            return;
        }
    }    

    function game_finished(winner) {
        let win = document.getElementById("winner");
        if (winner==1) {
            win.innerText = "Red Wins";             
        } else {
            win.innerText = "Yellow Wins";
        }
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
        if (firstPlayerSelect.value === 'branco') {
            player1 = '1';
        } else {
            player1 = '2';
        }
        currentPlayer = player1;
        currentPlayerDisplay.textContent = playerNames[currentPlayer];
        gameResultDisplay.textContent = '';
        isGameActive = true;

        // Adiciona a classe "active" ao elemento ".game-info"
        const gameInfoElement = document.querySelector('.game-info');
        gameInfoElement.classList.add('active');

        // Altera o texto do botão "Iniciar Jogo" para "Desistir"
        const start_button = document.getElementById('start-game');
        start_button.textContent = 'Desistir';


    });

    const opponentSelect = document.querySelector('#opponent');
    const levelLabel = document.getElementById('level-label');
    const levelSelect = document.getElementById('level');

    // Adicione um ouvinte de evento à seleção do oponente
    opponentSelect.addEventListener('change', () => {
        const selectedOption = opponentSelect.value;

        // Verifique se a opção selecionada é 'computer' para mostrar ou ocultar a label de nível e o campo de seleção de nível
        if (selectedOption === 'computer') {
            levelLabel.style.display = 'block'; // Mostrar a label de nível
            levelSelect.style.display = 'block'; // Mostrar o campo de seleção de nível
        } else {
            levelLabel.style.display = 'none'; // Ocultar a label de nível
            levelSelect.style.display = 'none'; // Ocultar o campo de seleção de nível
        }
    });

    const mainSection = document.getElementById('main-section');
    const hiddenSection = document.getElementById('additional-section');
    const rulesButton = document.getElementById('rules-button');
    const returnButton = document.getElementById('return-button'); // Seleciona o botão de retorno
    
    // Adicione um evento de clique ao botão de regras
    rulesButton.addEventListener('click', () => {
        // Alternar a visibilidade da main-section e hidden-section
        mainSection.style.display = 'none'; // Esconde a main-section
        hiddenSection.style.display = 'block'; // Mostra a hidden-section
    });
    
    // Adicione um evento de clique ao botão de retorno
    returnButton.addEventListener('click', () => {
        // Alternar a visibilidade da main-section e hidden-section
        mainSection.style.display = 'block'; // Mostra a main-section
        hiddenSection.style.display = 'none'; // Esconde a hidden-section
    });

});