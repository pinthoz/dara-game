document.addEventListener('DOMContentLoaded', () => {
    const boardSizeSelect = document.querySelector('#board-size');
    const startGameButton = document.querySelector('#start-game');
    const gameContainer = document.querySelector('.game-container');
    const currentPlayerDisplay = document.querySelector('#current-player');
    const gameResultDisplay = document.querySelector('#game-result');
    const removeDisplay = document.querySelector('#remove-display');
    const firstPlayerSelect = document.querySelector('#first-play');
    const start_button = document.getElementById('start-game');
    const quit_button = document.getElementById('quit-game');
    const gameSettings = document.getElementById('game-settings');
    const moveDisplay = document.getElementById("move-piece-display");
    const putDisplay = document.getElementById("place-piece-display");

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
    let finalWpieces = 12;
    let finalBpieces = 12;
    let pieceSelected = false;
    let canRemove = false;
    let win = 0;
    let moved_piece = false;


    function tupleToString(tuple) {
        return JSON.stringify(tuple);
    }
    
    // Function to convert a string back to a tuple
    function stringToTuple(str) {
        return JSON.parse(str);
    }


    // Função para gerar o tabuleiro com base no tamanho selecionado
    function generateBoard() {
        isGameActive = true;
        board = [];
        putPhase = true;
        if (boardSize === 6) {
            playerBpieces = 12;
            playerWpieces = 12;
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
                    putDisplay.style.display = 'block';
                }
            }
        } else {           
            playerBpieces = 12;
            playerWpieces = 12;
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
                    putDisplay.style.display = 'block';
                }
            }
        }
    }


    
    // Função para lidar com o clique em uma célula
    function handleCellClick(row, col) {
        //console.log("pieceSelected: " + pieceSelected + " moved_piece: " + moved_piece + " canRemove: " + canRemove);
        //console.log(" jogador " + currentPlayer);
        
        if (!isGameActive) return;
    
        if (putPhase) {
            handlePlacementPhase(row, col);
        } else {
            //console.log("boas")
            if (!pieceSelected) {
                //console.log("seleciono a peça")
                handlePieceSelection(row, col);

            } else {
                if (!moved_piece) {
                    //console.log("movo a peça")
                    handlePieceMovement(row, col);
                    
                }
                moves_available(currentPlayer_copy);
            }
            // já moveu a peça, ver se consegue remover agora
            if (moved_piece) {

                //console.log("ola")

                if (canRemove) {
                    //console.log("You can remove a piece");
                    handleRemovePiece(row, col, currentPlayer_copy);
                    removeDisplay.style.display = 'none';
                    moveDisplay.style.display = 'block';
                    possible_win();

                }

                else {
                    if (possible_remove(row, col, currentPlayer_copy)) {
                        //console.log("o possible_remove retornou true");
                        canRemove = true;
                    
                    } else {
                    //currentPlayer = currentPlayer === '1' ? '2' : '1';
                    //console.log("############ JOGADOR ATIVO: " + currentPlayer + " #############")
                    currentPlayerDisplay.textContent = playerNames[currentPlayer];
                    moved_piece = false;
                    pieceSelected = false;
                    canRemove = false;
                    //possible_win();
                    //console.log("You cannot remove a piece");
                    }
                
                }
            }
        }
    }
    
    // Função para lidar com a fase de colocação de peças
    function handlePlacementPhase(row, col) {
        let canPlacePiece = possible_play(row, col, currentPlayer,board);
    
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
            putDisplay.style.display = 'none';
            moveDisplay.style.display = 'block';
        }
    }
    

    function handlePieceSelection(row, col) {
        if (possible_click(row, col, currentPlayer)) {
            if (canRemove) {
                console.log("You cannot select a new piece after removing one.");
                return;
            }
    
            rowSelected = row;
            colSelected = col;
            pieceSelected = true;
    
            console.log('Peça selecionada');
            console.log('Peça selecionada - Linha:', rowSelected, 'Coluna:', colSelected);
    
            // Atualize a imagem de fundo da célula selecionada para a imagem da peça selecionada
            const selectedCell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (currentPlayer === '1') {
                selectedCell.style.backgroundImage = 'url("/assets/white-selected.png")';
            } else {
                selectedCell.style.backgroundImage = 'url("/assets/black-selected.png")';
            }
        } else {
            console.log('Peça não pode ser selecionada');
        }
    }
    
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

    let currentPlayer_copy = -1;
    // Função para lidar com o movimento de peças
    function handlePieceMovement(row, col) {
        if (row === rowSelected && col === colSelected) {
            const selectedCell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            pieceSelected = false;
            if (currentPlayer === '1') {
                selectedCell.style.backgroundImage = 'url("/assets/white.png")';
            }
            else{
                selectedCell.style.backgroundImage = 'url("/assets/black.png")';
            }
        } else {

            
            console.log("possible_play " + possible_play(row, col, currentPlayer,board) + " possible_move " + possible_move(row, col, rowSelected, colSelected) + " go_back " + go_back(row, col, rowSelected, colSelected, currentPlayer));
            if (possible_play(row, col, currentPlayer,board) && possible_move(row, col, rowSelected, colSelected) && go_back(row, col, rowSelected, colSelected, currentPlayer)) {
   
                board[row][col] = currentPlayer;
                board[rowSelected][colSelected] = 0; // tirar a peça da posição anterior

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
    
                

                renderBoard();
                /*pieceSelected = false;*/
                currentPlayer_copy = currentPlayer;
                currentPlayer = currentPlayer === '1' ? '2' : '1';
                //currentPlayerDisplay.textContent = playerNames[currentPlayer];
                moved_piece = true;
            }
        
            
        for (let i = 0; i < 6; i++) {
            console.log(board[i][0] + " " + board[i][1] + " " + board[i][2] + " " + board[i][3] + " " + board[i][4]);
        }

        }
    
    }

    function handleRemovePiece(row, col, currentPlayer) {
    
            let correct_choice = false;

            if (currentPlayer === '1') {
                if (board[row][col] === '2') {
                    correct_choice = true;
                }
            } else {
                if (board[row][col] === '1') {
                    correct_choice = true;
                }
            }

            if(correct_choice){
                //console.log("You can remove the piece dentro de handleremovepiece");
                board[row][col] = 0;
            
                for (let i = 0; i < 6; i++) {
                    console.log(board[i][0] + " " + board[i][1] + " " + board[i][2] + " " + board[i][3] + " " + board[i][4]);
                }
        

            if(currentPlayer === 1){
                finalBpieces--;
            }else{
                finalWpieces--;
            }

            currentPlayer = currentPlayer === '1' ? '2' : '1';
            
            currentPlayerDisplay.textContent = playerNames[currentPlayer];
            moved_piece = false;
            pieceSelected = false;
            canRemove = false;
            //console.log("You cannot remove a piece - joagdor ativo" + currentPlayer );
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
                moveDisplay.style.display = 'none';
                removeDisplay.style.display = 'block';
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
                moveDisplay.style.display = 'none';
                removeDisplay.style.display = 'block';
                return true;
            }
        }
        return false;
    }




    //________________________________________________________


    function possible_click(i, j, currentPlayer) {
        if (board[i][j] === currentPlayer) {
            //console.log('true - Cell is yours');
            return true;
        }
        //console.log('false - Cell is not yours');
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





    function possible_play(i, j, currentPlayer,board_layout) {
        // Check if the cell is out of bounds
        if (i < 0 || i >= board_layout.length || j < 0 || j >= board_layout[i].length) {
            console.log('false - Cell is out of bounds');
            return false;
        }
    
        // Check if the cell is not empty
        if (board_layout[i][j] !== 0) {
            //console.log('false - Cell is not empty');
            return false;
        }
    
        board_layout[i][j] = currentPlayer;

        if (!putPhase) {
            console.log( "rowSelected: " + rowSelected + " colSelected: " + colSelected) + " na possible_play";
            board_layout[rowSelected][colSelected] = 0; // tirar a peça da posição anterior
        }
        

        // Check Horizontal
        let leftlim = Math.max(0, j - 3);
        let rightlim = Math.min(board_layout[i].length - 1, j + 3);
        
        //console.log("horizontal| top: "  + leftlim + " bottom: " + rightlim)
        
        for (let k = leftlim; k <= rightlim - 3; k++) {
            //console.log("hor row: "  + i + " | " + board[i][k] + " " + board[i][k + 1] + " " + board[i][k + 2] + " " + board[i][k + 3]);
            if (
                currentPlayer === (board_layout[i][k] || 0 ) &&
                currentPlayer === (board_layout[i][k + 1] || 0 ) &&
                currentPlayer === (board_layout[i][k + 2] || 0 ) &&
                currentPlayer === (board_layout[i][k + 3] || 0 )
            ) {
                board_layout[i][j] = 0;  // Set it back to an empty cell
                if (!putPhase) {
                    board_layout[rowSelected][colSelected] = currentPlayer; // tirar a peça da posição anterior
                }
                console.log('false - Cell is 4 in line horizontal');
                return false;
            }
        }
    
        // Check Vertical
        let toplim = Math.max(0, i - 3);
        let bottomlim = Math.min(board_layout.length - 1, i + 3);
        
        //console.log("vertical| top: "  + toplim + " bottom: " + bottomlim)
        for (let k = toplim; k <= bottomlim - 3; k++) {
            //console.log("ver col: "  + k + " | " + board[k][j] + " " + board[k + 1][j] + " " + board[k + 2][j] + " " + board[k + 3][j])
            if (
                currentPlayer === (board_layout[k][j] || 0) &&
                currentPlayer === (board_layout[k + 1][j] || 0) &&
                currentPlayer === (board_layout[k + 2][j] || 0) &&
                currentPlayer === (board_layout[k + 3][j] || 0)
            ) {
                board_layout[i][j] = 0;  // Set it back to an empty cell
                if (!putPhase) {
                    board_layout[rowSelected][colSelected] = currentPlayer; // tirar a peça da posição anterior
                }
                console.log('false - Cell is 4 in line vertical');
                return false;
            }
        }
    
        if (!putPhase) {
            board_layout[i][j] = 0;
            board_layout[rowSelected][colSelected] = currentPlayer;
        }
    
        //console.log('true - Move is possible');
        return true;
    }  




    let moves_available_1 = [];
    let moves_available_2 = [];


    function moves_available(currentPlayer){
        let moves_available = [];
        let board_copy = JSON.parse(JSON.stringify(board));

        if (currentPlayer == 1){
            moves_available = JSON.parse(JSON.stringify(moves_available_1));
        }else{
            moves_available = JSON.parse(JSON.stringify(moves_available_2));
        }
        for (let i = 0; i< board.length ; i++){
            for (let j = 0; j< board[0].length ; j++){
                if (board[i][j]==currentPlayer){
                    if (i>0){
                        if (possible_play(i-1,j, currentPlayer,board_copy) && possible_move(i-1, j, i, j) && go_back(i-1, j, i, j, currentPlayer)){
                            moves_available.push([i,j,i-1,j]);
                        }
                    }if (i<board.length-1){
                        if (possible_play(i+1,j,currentPlayer,board_copy) && possible_move(i+1, j, i, j) && go_back(i+1, j, i, j, currentPlayer)){
                            moves_available.push([i,j,i+1,j]);
                        }
                    }if (j>0){
                        if (possible_play(i,j-1,currentPlayer,board_copy) && possible_move(i, j-1, i, j) && go_back(i, j-1, i, j, currentPlayer)){
                            moves_available.push([i,j,i,j-1]);
                        }
                    }
                    if (j<board[0].length-1){
                        if (possible_play(i,j+1,currentPlayer,board_copy) && possible_move(i, j+1, i, j) && go_back(i, j+1, i, j, currentPlayer)){
                            moves_available.push([i,j,i,j+1]);
                        }
                    }
                }
            }
        }
        
        console.log("moves_available for player " + currentPlayer + ": " + moves_available );
        if (currentPlayer == 1){
            moves_available_1 = JSON.parse(JSON.stringify(moves_available));
        }else{
            moves_available_2 = JSON.parse(JSON.stringify(moves_available));
        }

        if (moves_available.length === 0) return false;
        return true;
    }


    function possible_win(){
    console.log("POSSIBLE WINNNNNNN");
            console.log("playerBpieces: " + finalBpieces + " playerWpieces: " + finalWpieces);
        if (finalBpieces <= 2 || !moves_available(2)){
            winner = 2;
            game_finished(winner);
            return;
        }
        else if (finalWpieces <= 2 || !moves_available(1)){
            winner = 1;
            game_finished(winner);
            return;
        }

    } 


    function game_finished(winner) {
        let win_text = document.getElementById("game-result");
        if (winner==1) {
            win_text.innerText = "Ganhou o Branco";             
        } else {
            isGameActive = false;
            win_text.innerText = "Ganhou o Preto";
        }
        isGameActive = false;
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
                    }
                    if (board[row][col] === '2') {
                        cell.style.backgroundImage = 'url("/assets/black.png")';
                    } 
                    if (board[row][col] === '0'){
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


    start_button.style.display = 'none';
    quit_button.style.display = 'block';
    gameSettings.style.display = 'none';

});

quit_button.addEventListener('click', () => {
    // Esconde o tabuleiro
    gameContainer.innerHTML = '';

    // Oculta a classe "active" do elemento ".game-info"
    const gameInfoElement = document.querySelector('.game-info');
    gameInfoElement.classList.remove('active');
    moveDisplay.style.display = 'none';
    removeDisplay.style.display = 'none';

    // Mostra o botão "Iniciar Jogo" e oculta o botão "Desistir"
    start_button.style.display = 'block';
    quit_button.style.display = 'none';
    gameSettings.style.display = 'block';

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

    document.querySelector('.img-dara').addEventListener('click', () => {
        // Recarrega a página
        location.reload();
    });

});