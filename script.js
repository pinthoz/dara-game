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
    const sideBoard1 = document.querySelector('.side_board_1'); 
    const sideBoard2 = document.querySelector('.side_board_2'); 
    const selectedOpponent = document.getElementById('.opponent');
    const level = document.getElementById('level');




    //Para em vez de aparecer 1 ou 2 aparecer branco ou preto no html
    const playerNames = {
        '1': 'Branco',
        '2': 'Preto'
    };

    // Variáveis globais
    let username = '';
    let user = null;
    let player1;
    let boardSize = boardSizeSelect;
    let currentPlayer = player1;
    let board;
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
    let userWins = 0;
    let moves_available_1 = [];
    let moves_available_2 = [];
    let currentPlayer_copy = -1;
    let bot = false;
    let numRows = 6; // Defina o número de linhas
    let numCols = 6; // Defina o número de colunas


    
    

    class User {
        constructor(username, totalGames, victories) {
            this.username = username;
            this.totalGames = totalGames;
            this.victories = victories;
        }
    }


    class Board{
        constructor(numRows, numCols){
            this.numRows = numRows;
            this.numCols = numCols;
            this.board = this.createBoard(this.numRows, this.numCols);
            this.playerBpieces = 12;
            this.playerWpieces = 12;
            this.finalWpieces = 12;
            this.finalBpieces = 12;
            this.LastPlay1 = {
                row: -1,
                col: -1,
                rowSelected: -1,
                colSelected: -1,
            };
            
            this.LastPlay2 = {
                row: -1,
                col: -1,
                rowSelected: -1,
                colSelected: -1,
            };

        }
        createBoard(rows, cols){
            let board = new Array(rows).fill(0).map(() => new Array(cols).fill(0));
            return board;
        }
        renderBoard() {
            if (boardSize === 6) {
                for (let row = 0; row < this.numRows;   row++) {
                    for (let col = 0; col < this.numCols; col++) {
                        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                        cell.textContent = '';
                        cell.style.backgroundImage = 'none'; // Remova a imagem de fundo
        
                        if (this.board[row][col] === '1') {
                            cell.style.backgroundImage = 'url("/assets/white.png")';
                        }
                        if (this.board[row][col] === '2') {
                            cell.style.backgroundImage = 'url("/assets/black.png")';
                        }
                    }
                }
            } else {
                for (let row = 0; row <  this.numRows; row++) {
                    for (let col = 0; col < this.numCols; col++) {
                        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                        cell.textContent = '';
                        cell.style.backgroundImage = 'none'; // Remova a imagem de fundo
        
                        if (this.board[row][col] === '1') {
                            cell.style.backgroundImage = 'url("/assets/white.png")';
                        } else if (this.board[row][col] === '2') {
                            cell.style.backgroundImage = 'url("/assets/black.png")';
                        }
                    }
                }
            }
        }

    }
    // Função para gerar o tabuleiro com base no tamanho selecionado
    function generateBoard() {
        isGameActive = true;
        //board = [];
        putPhase = true;
        if (boardSize === 6) {
            playerBpieces = 12;
            playerWpieces = 12;
            finalWpieces = 12;
            finalBpieces = 12;

            numRows = 6; // Defina o número de linhas
            numCols = 6; // Defina o número de colunas
            gameContainer.innerHTML = '';
            board = new Board(numRows, numCols);
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
        } else {           
            playerBpieces = 12;
            playerWpieces = 12;
            finalWpieces = 12;
            finalBpieces = 12;

            numRows = 6; // Defina o número de linhas
            numCols = 5; // Defina o número de colunas
    
            gameContainer.innerHTML = '';
            board = new Board(numRows, numCols);
    
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


    function updateSideBoards() {
        updateSideBoard(1, 'side_board_1');
        updateSideBoard(2, 'side_board_2');
    }
    
    // Function to update a specific side board
    function updateSideBoard(player, sideBoardId) {
        if (putPhase) {
        const sideBoard = document.querySelector(`.${sideBoardId}`);
        const piecesCount = player === 1 ? playerBpieces : playerWpieces;
        
        sideBoard.innerHTML = ''; // Clear the side board
    
        for (let i = 0; i < piecesCount; i++) {
            const piece = document.createElement('div');
            piece.classList.add(player === 1 ? 'white-piece' : 'black-piece');
            sideBoard.appendChild(piece);
        }
    } else {
        const side = player === 1 ? 'side_board_2' : 'side_board_1';
        const sideBoard = document.querySelector(`.${side}`);
        const piecesCount = player === 1 ? finalBpieces : finalWpieces;
        
        sideBoard.innerHTML = ''; // Clear the side board
        let npieces = 12 - piecesCount;
    
        for (let i = 0; i < npieces; i++) {
            const piece = document.createElement('div');
            piece.classList.add(player === 1 ? 'black-piece' : 'white-piece');
            sideBoard.appendChild(piece);
        }
    }
    }


    
    // Função para lidar com o clique em uma célula
let bot_can_play = false;

    function handleCellClick(row, col) {
        if (!isGameActive) return;
    
        if (putPhase) {

            handlePlacementPhase(row, col);

            if (currentPlayer === '2' && bot === true && putPhase === true && level.value === 'easy') {
                console.log("BOT MOVE 1111");
                makeBotMove();
            }
            
            if (currentPlayer === '2' && bot === true && putPhase === true && level.value === 'medium') {
                console.log("MEDIUM MOVE");
                makeBotMoveM();
                
            }
            if (putPhase === false && player1 == '2') {
                console.log("AQUUDSADUUADUAD " + currentPlayer)
                performBotMove();
            }
        
        console.log(bot_can_play);
        } else{
            console.log("ACABOU A PUT PHASE E JOGA O " + currentPlayer)
            possible_win();
            if (!pieceSelected) {
                handlePieceSelection(row, col);
            } else {
                if (!moved_piece) {
                    handlePieceMovement(row, col);
                }
                console.log("currentPlayer: " + currentPlayer)
                console.log("currentPlayerCopy: " + currentPlayer_copy)
                //moves_available(currentPlayer_copy);
            }
    
            if (moved_piece) {
                if (canRemove) {
                    handleRemovePiece(row, col, currentPlayer_copy);
                    removeDisplay.style.display = 'none';
                    moveDisplay.style.display = 'block';
                    possible_win();
                    //currentPlayer = currentPlayer === '1' ? '2' : '1';
                } else {
                    if (possible_remove(row, col, currentPlayer_copy)) {
                        canRemove = true;
                    } else {
                        //currentPlayer = currentPlayer === '1' ? '2' : '1';
                        currentPlayerDisplay.textContent = playerNames[currentPlayer];
                        moved_piece = false;
                        pieceSelected = false;
                        canRemove = false;
                        bot_can_play = true;
                        possible_win();   
                        

                    }
                }
            }
            if (currentPlayer === '2' && bot === true && bot_can_play === true && level.value === 'easy') {
                console.log("BOT MOVE AAAAA");
                makeBotMove(); // Se for a fase de colocação e o jogador é o bot, faça o bot jogar imediatamente.
                moved_piece = false;
                pieceSelected = false;
                canRemove = false;
                bot_can_play = false;
                currentPlayerDisplay.textContent = playerNames[1];
                console.log("bot_can_play" + bot_can_play);
                possible_win();
            }
            if (currentPlayer === '2' && bot === true && bot_can_play === true && level.value === 'medium') {
                console.log("MINIMAX MOVE");
                makeBotMoveM(); // Se for a fase de colocação e o jogador é o bot, faça o bot jogar imediatamente.
                moved_piece = false;
                pieceSelected = false;
                canRemove = false;
                bot_can_play = false;
                currentPlayerDisplay.textContent = playerNames[1];
                possible_win();
            }
        }
    } 
    

    // Função para simular um clique para o bot
    function performBotMove() {
        console.log("BOT MOVE AUTOMÁTICO NA PRIMEIRA JOGADA");
        // Defina as coordenadas da célula para o primeiro movimento do bot
        const botRow = 1;
        const botCol = 1;
        // Dispare o evento de clique na célula desejada
        const targetCell = document.querySelector(`[data-row="${botRow}"][data-col="${botCol}"]`);
        targetCell.dispatchEvent(clickEvent);
        isFirstBotMove = false; // Marque que o primeiro movimento do bot já ocorreu
        
    }

    //_____________________________________________________________________________________________________________

    function makeBotMove() {
        if (putPhase) {
            const availableCells = getAvailableCells(); // Função para obter células disponíveis
            if (availableCells.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableCells.length);
                const randomCell = availableCells[randomIndex];

                console.log("randomCell: " + randomCell.row + " " + randomCell.col);
                // Simula o clique na célula escolhida pelo bot
                handlePlacementPhase(randomCell.row, randomCell.col);
            }
        }else{
            console.log("BOT MOVE 2222")
            const movesBot = moves_available('2');
            console.log("movesBot: " + movesBot);
            for (let i = 0; i < 6; i++) {
                console.log(board.board[i][0] + " " + board.board[i][1] + " " + board.board[i][2] + " " + board.board[i][3] + " " + board.board[i][4]);
            }
            if (movesBot.length > 0) {
                const randomIndex = Math.floor(Math.random() * movesBot.length);
                const randomMove = movesBot[randomIndex];
                console.log("randomMove: " + randomMove);
                handlePieceSelection(randomMove[0], randomMove[1]);
                console.log("Selecionou a peça");
                handlePieceMovement(randomMove[2], randomMove[3]);
                console.log("Moveu a peça");
                //for (let i = 0; i < 6; i++) {
                    //console.log(board.board[i][0] + " " + board.board[i][1] + " " + board.board[i][2] + " " + board.board[i][3] + " " + board.board[i][4]);
                //}
                
                if (possible_remove(randomMove[2], randomMove[3], '2')){
                    const piecesToRemove = getPlayerCells('1');
                    const randomIndex = Math.floor(Math.random() * piecesToRemove.length);
                    const randomCell = piecesToRemove[randomIndex];
                    handleRemovePiece(randomCell.row, randomCell.col, '2');
                    moveDisplay.style.display = 'block';
                    removeDisplay.style.display = 'none';
                    possible_win();

                }
                    
            }
            
        console.log("PLAYER AFTER MOVE DENTRO DO BOT: " + currentPlayer);

        }
    }

 
    function makeBotMoveM() {
        if (putPhase) {
            const availableCells = getAvailableCells(); // Função para obter células disponíveis
            if (availableCells.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableCells.length);
                const randomCell = availableCells[randomIndex];
    
                console.log("randomCell: " + randomCell.row + " " + randomCell.col);
                // Simula o clique na célula escolhida pelo bot
                handlePlacementPhase(randomCell.row, randomCell.col);
            }
        } else {
            const movesBot = moves_available('2');
            const winningMoves = [];
            let randomMove; // Defina randomMove antes do uso
            
            for (let i = 0; i < movesBot.length; i++) {
                const [startRow, startCol, endRow, endCol] = movesBot[i];
                // Faça uma cópia temporária do tabuleiro
                const boardCopy = JSON.parse(JSON.stringify(board.board));
    
                // Simule a jogada do bot
                boardCopy[endRow][endCol] = '2';
    
                // Verifique se essa jogada resulta em uma linha de 3 para o bot
                if (possible_remove2(endRow, endCol, '2', boardCopy)) {
                    winningMoves.push(movesBot[i]);
                    console.log("Move de 3 : " + winningMoves[i]);
                }
            }
    
            if (winningMoves.length > 0) {
                // Se houver jogadas vencedoras, escolha uma delas
                const randomIndex = Math.floor(Math.random() * winningMoves.length);
                randomMove = winningMoves[randomIndex]; // Atribua randomMove aqui
                // Realize a jogada vencedora
                handlePieceSelection(randomMove[0], randomMove[1]);
                handlePieceMovement(randomMove[2], randomMove[3]);
            } else {
                // Caso contrário, escolha uma jogada aleatória
                const randomIndex = Math.floor(Math.random() * movesBot.length);
                randomMove = movesBot[randomIndex]; // Atribua randomMove aqui
    
                // Realize a jogada aleatória
                handlePieceSelection(randomMove[0], randomMove[1]);
                handlePieceMovement(randomMove[2], randomMove[3]);
            }
    
            if (possible_remove(randomMove[2], randomMove[3], '2')) {
                const piecesToRemove = getPlayerCells('1');
                const randomIndex = Math.floor(Math.random() * piecesToRemove.length);
                const randomCell = piecesToRemove[randomIndex];
                handleRemovePiece(randomCell.row, randomCell.col, '2');
                moveDisplay.style.display = 'block';
                removeDisplay.style.display = 'none';
                possible_win();
            }
        }
    }
    

    function getPlayerCells(player) {
        // colocar depois se o bot é o primeiro a jogar ou nao
        const cellsInBoard = [];
        for (let row = 0; row < board.numRows; row++) {
            for (let col = 0; col < board.numCols; col++) {
                if (board.board[row][col] === player) {
                    cellsInBoard.push({ row, col });
                }
            }
        }
        return cellsInBoard;
    }

    
    function getAvailableCells() {
        const availableCells = [];
        for (let row = 0; row < board.numRows; row++) {
            for (let col = 0; col < board.numCols; col++) {
                let boardCopy = JSON.parse(JSON.stringify(board.board));
                if (possible_play(row, col, currentPlayer, boardCopy,0,0)) {
                    availableCells.push({ row, col });
                }
            }
        }
        return availableCells;
    }


    
    //_____________________________________________________________________________________________________________

    
    // Função para lidar com a fase de colocação de peças
    function handlePlacementPhase(row, col) {
        
        //for (let i = 0; i < 6; i++) {
            //console.log(board.board[i][0] + " " + board.board[i][1] + " " + board.board[i][2] + " " + board.board[i][3] + " " + board.board[i][4]);
        //}
        let canPlacePiece = possible_play(row, col, currentPlayer,board.board,0,0);
        console.log("canPlacePiece: " + canPlacePiece)
        if (canPlacePiece) {
            if (currentPlayer === '1' && playerBpieces > 0) {
                board.renderBoard();
                playerBpieces--;
                updateSideBoards();
            } else if (currentPlayer === '2' && playerWpieces > 0) {
                board.renderBoard();
                playerWpieces--;
                updateSideBoards();
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
            if (bot === true && currentPlayer === '2') {
                currentPlayerDisplay.textContent = playerNames[1];
            }
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
    



function go_back(row,col,rowSelected,colSelected,currentPlayer){
    if (currentPlayer == '1'){
        if (row == board.LastPlay1.row && 
            col == board.LastPlay1.col && 
            rowSelected == board.LastPlay1.rowSelected 
            && colSelected == board.LastPlay1.colSelected)
            return false;
    }else{
        if (row == board.LastPlay2.row && 
            col == board.LastPlay2.col && 
            rowSelected == board.LastPlay2.rowSelected 
            && colSelected == board.LastPlay2.colSelected)
            return false;	
    }
    return true;

}

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
            if (possible_play(row, col, currentPlayer, board.board,rowSelected,colSelected) && possible_move(row, col, rowSelected, colSelected) && go_back(row, col, rowSelected, colSelected, currentPlayer)) {
                board.board[row][col] = currentPlayer;
                board.board[rowSelected][colSelected] = 0; // Tirar a peça da posição anterior
    
                if (currentPlayer == '1') {
                    board.LastPlay1.row = rowSelected;
                    board.LastPlay1.col = colSelected;
                    board.LastPlay1.rowSelected = row;
                    board.LastPlay1.colSelected = col;
                    console.log("board.LastPlay1: " + board.LastPlay1.row + " " + board.LastPlay1.col + " " + board.LastPlay1.rowSelected + " " + board.LastPlay1.colSelected);
                } else {
                    board.LastPlay2.row = rowSelected;
                    board.LastPlay2.col = colSelected;
                    board.LastPlay2.rowSelected = row;
                    board.LastPlay2.colSelected = col;
                    console.log("board.LastPlay2: " + board.LastPlay2.row + " " + board.LastPlay2.col + " " + board.LastPlay2.rowSelected + " " + board.LastPlay2.colSelected);
                }
    
                board.renderBoard();
                updateSideBoards();
                const selectedCell = document.querySelector(`[data-row="${rowSelected}"][data-col="${colSelected}"]`);
                selectedCell.style.backgroundImage = 'none'; // Remova a imagem de fundo da célula de origem
                pieceSelected = false;
                currentPlayer_copy = currentPlayer;
                currentPlayer = currentPlayer === '1' ? '2' : '1';
                moved_piece = true;
            }
        }
    }

    function handleRemovePiece(row, col, Player) {
        let correct_choice = false;
    
        if (Player === '1') {
            if (board.board[row][col] === '2') {
                correct_choice = true;
            }
        } else {
            if (board.board[row][col] === '1') {
                correct_choice = true;
            }
        }
    
        if (correct_choice) {
            board.board[row][col] = 0;
    
            if (Player == '1') {
                finalBpieces--;
            } else {
                finalWpieces--;
            }
    
            console.log("AAA playerBpieces: " + finalBpieces + " playerWpieces: " + finalWpieces);
    
            currentPlayerDisplay.textContent = playerNames[currentPlayer];
            //console.log("You cannot remove a piece - joagdor ativo" + currentPlayer );
            moved_piece = false;
            pieceSelected = false;
            canRemove = false;
    
            // Defina bot_can_play como verdadeiro para permitir que o bot jogue
            bot_can_play = true;
    
            board.renderBoard();
            updateSideBoards();
        }
    }


    //________________________________________________________



    function possible_remove(i,j,currentPlayer) {


        // Check Horizontal
        let leftlim = Math.max(0, j - 3);
        let rightlim = Math.min(board.board[i].length - 1, j + 3);
        
        //console.log("horizontal| top: "  + leftlim + " bottom: " + rightlim)
        
        for (let k = leftlim; k <= rightlim - 2; k++) {
            //console.log("hor row: "  + i + " | " + board.board[i][k] + " " + board.board[i][k + 1] + " " + board.board[i][k + 2]);
            if (
                currentPlayer === (board.board[i][k] || 0) &&
                currentPlayer === (board.board[i][k + 1] || 0) &&
                currentPlayer === (board.board[i][k + 2] || 0)
            ) {
                moveDisplay.style.display = 'none';
                removeDisplay.style.display = 'block';
                return true;
            }
        }
    
        // Check Vertical
        let toplim = Math.max(0, i - 3);
        let bottomlim = Math.min(board.board.length - 1, i + 3);
        
        //console.log("vertical| top: "  + toplim + " bottom: " + bottomlim)
        for (let k = toplim; k <= bottomlim - 2; k++) {
            //console.log("ver col: "  + k + " | " + board.board[k][j] + " " + board.board[k + 1][j] + " " + board.board[k + 2][j])
            if (
                currentPlayer === (board.board[k][j] || 0) &&
                currentPlayer === (board.board[k + 1][j] || 0) &&
                currentPlayer === (board.board[k + 2][j] || 0)
            ) {
                moveDisplay.style.display = 'none';
                removeDisplay.style.display = 'block';
                return true;
            }
        }
        return false;
    }

    function possible_remove2(i,j,currentPlayer, board_i) {

        let leftlim = Math.max(0, j - 3);
        let rightlim = Math.min(board_i[i].length - 1, j + 3);
        
        //console.log("horizontal| top: "  + leftlim + " bottom: " + rightlim)
        
        for (let k = leftlim; k <= rightlim - 2; k++) {
            //console.log("hor row: "  + i + " | " + board[i][k] + " " + board[i][k + 1] + " " + board[i][k + 2]);
            if (
                currentPlayer === (board_i[i][k] || 0) &&
                currentPlayer === (board_i[i][k + 1] || 0) &&
                currentPlayer === (board_i[i][k + 2] || 0)
            ) {

                return true;
            }
        }
    
        let toplim = Math.max(0, i - 3);
        let bottomlim = Math.min(board.length - 1, i + 3);
        
        //console.log("vertical| top: "  + toplim + " bottom: " + bottomlim)
        for (let k = toplim; k <= bottomlim - 2; k++) {
            //console.log("ver col: "  + k + " | " + board[k][j] + " " + board[k + 1][j] + " " + board[k + 2][j])
            if (
                currentPlayer === (board_i[k][j] || 0) &&
                currentPlayer === (board_i[k + 1][j] || 0) &&
                currentPlayer === (board_i[k + 2][j] || 0)
            ) {
                return true;
            }
        }
        return false;
    }




    //________________________________________________________


    function possible_click(i, j, currentPlayer) {
        if (board.board[i][j] === currentPlayer) {
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



    function possible_play(i, j, currentPlayer,board_layout, rowSelected, colSelected) {
        // Check if the cell is out of bounds
        if (i < 0 || i >= board_layout.length || j < 0 || j >= board_layout[i].length) {
            //console.log('false - Cell is out of bounds');
            return false;
        }
    
        // Check if the cell is not empty
        if (board_layout[i][j] !== 0) {
            //console.log('false - Cell is not empty');
            return false;
        }
    
        board_layout[i][j] = currentPlayer;

        if (!putPhase) {
            //console.log( "rowSelected: " + rowSelected + " colSelected: " + colSelected) + " na possible_play";
            board_layout[rowSelected][colSelected] = 0; // tirar a peça da posição anterior
        }
        

        // Check Horizontal
        let leftlim = Math.max(0, j - 3);
        let rightlim = Math.min(board_layout[i].length - 1, j + 3);
        
        //console.log("horizontal| top: "  + leftlim + " bottom: " + rightlim)
        
        for (let k = leftlim; k <= rightlim - 3; k++) {
            //console.log("hor row: "  + i + " | " + board.board[i][k] + " " + board.board[i][k + 1] + " " + board.board[i][k + 2] + " " + board.board[i][k + 3]);
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
                //console.log('false - Cell is 4 in line horizontal');
                return false;
            }
        }
    
        // Check Vertical
        let toplim = Math.max(0, i - 3);
        let bottomlim = Math.min(board_layout.length - 1, i + 3);
        
        //console.log("vertical| top: "  + toplim + " bottom: " + bottomlim)
        for (let k = toplim; k <= bottomlim - 3; k++) {
            //console.log("ver col: "  + k + " | " + board.board[k][j] + " " + board.board[k + 1][j] + " " + board.board[k + 2][j] + " " + board.board[k + 3][j])
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
                //console.log('false - Cell is 4 in line vertical');
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



    function moves_available(Player) {
        let movesAvailable = [];
        let boardCopy = JSON.parse(JSON.stringify(board.board));
        //for (let i = 0; i < 6; i++) {
            //console.log(boardCopy[i][0] + " " + boardCopy[i][1] + " " + boardCopy[i][2] + " " + boardCopy[i][3] + " " + boardCopy[i][4]);
        //}
    
        for (let i = 0; i < boardCopy.length; i++) {
            for (let j = 0; j < boardCopy[0].length; j++) {
                if (boardCopy[i][j] === Player) {
                    let new_colSelected = j;
                    let new_rowSelected = i;
                    if (i > 0) {
                        if (possible_play(i - 1, j, Player, boardCopy, new_rowSelected, new_colSelected) && possible_move(i - 1, j, i, j) && go_back(i - 1, j, i, j, Player)) {
                            movesAvailable.push([i, j, i - 1, j]);
                        }
                    }
                    if (i < boardCopy.length - 1) {
                        if (possible_play(i + 1, j, Player, boardCopy, new_rowSelected, new_colSelected) && possible_move(i + 1, j, i, j) && go_back(i + 1, j, i, j, Player)) {
                            movesAvailable.push([i, j, i + 1, j]);
                        }
                    }
                    if (j > 0) {
                        if (possible_play(i, j - 1, Player, boardCopy, new_rowSelected, new_colSelected) && possible_move(i, j - 1, i, j) && go_back(i, j - 1, i, j, Player)) {
                            movesAvailable.push([i, j, i, j - 1]);
                        }
                    }
                    if (j < boardCopy[0].length - 1) {
                        if (possible_play(i, j + 1, Player, boardCopy, new_rowSelected, new_colSelected) && possible_move(i, j + 1, i, j) && go_back(i, j + 1, i, j, Player)) {
                            movesAvailable.push([i, j, i, j + 1]);
                        }
                    }
                }
            }
        }
        //console.log("movesAvailable for player " + Player + ": " + movesAvailable);
        return movesAvailable;
    }
    


    function possible_win(){
    console.log("POSSIBLE WINNNNNNN");
            console.log("playerBpieces: " + finalBpieces + " playerWpieces: " + finalWpieces);
            moves_available_1 = moves_available('1');
            moves_available_2 = moves_available('2');
            console.log("moves_available_1: " + moves_available_1);
            console.log("moves_available_2: " + moves_available_2);
        if (finalBpieces <= 2 ||  moves_available_2.length == 0){
            winner = 1;
            game_finished(winner);
            return winner;
        }
        else if (finalWpieces <= 2 || moves_available_1.length == 0){
            winner = 2;
            game_finished(winner);
            return winner;
        }
        else{
            return 0;
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
        // Quando o jogo é concluído e o usuário ganha, você pode atualizar as estatísticas
        user.totalGames++; // Incrementa o número total de jogos
        user.victories++; // Incrementa o número de vitórias

        isGameActive = false;
    }



    // Função para renderizar o tabuleiro atual




// Event listener para o botão "Iniciar Jogo"
startGameButton.addEventListener('click', () => {
    sideBoard1.style.display = 'grid';
    sideBoard2.style.display = 'grid';
    boardSize = parseInt(boardSizeSelect.value);
    gameContainer.style.gridTemplateColumns = `repeat(${boardSize}, 50px)`; // Ajusta o número de colunas
    generateBoard();
    updateSideBoards();
    if (firstPlayerSelect.value === 'branco') {
        player1 = '1';
    } else {
        player1 = '2';
    }

    
    currentPlayer = player1;
    currentPlayerDisplay.textContent = playerNames[currentPlayer];
    gameResultDisplay.textContent = '';
    isGameActive = true;

    //verifca se o outro jogador é o bot
    if (opponentSelect.value === 'computer') {
        bot = true;
        if (level.value === 'easy') {
            if (player1 === '2') {
                // Se é o bot a começar ele jogo logo
                makeBotMove();
                bot_can_play = true;
                // tá bug quando o bot começa, na nossa primeira jogada depois da put phase
                // se selecionarmos uma peça temos de a descelecionar e jogar num sitio que nao faça 3 em linha
                // se não o bot não joga e fica muito bugado
                // mas se jogarmos para um sitio onde nao faz 3 em linha o bot joga bem no resto do jogo
            }
        }else if (level.value === 'medium') {
            if (player1 === '2') {
                makeBotMoveM();
                bot_can_play = true; 
            }
        }else{

        }
        
    }else{
        bot = false;
    }




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
    sideBoard1.style.display = 'none';
    sideBoard2.style.display = 'none';

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
    const returnButton = document.getElementById('return-button'); 
    const returnButton2 = document.getElementById('return-button-2'); 

    
    // Adicione um evento de clique ao botão de regras
    rulesButton.addEventListener('click', () => {
        // Alternar a visibilidade da main-section e hidden-section
        mainSection.style.display = 'none'; // Esconde a main-section
        hiddenSection.style.display = 'block'; // Mostra a hidden-section
        loginSection.style.display = 'none';
    });
    
    // Adicione um evento de clique ao botão de retorno
    returnButton.addEventListener('click', () => {
        // Alternar a visibilidade da main-section e hidden-section
        mainSection.style.display = 'block'; // Mostra a main-section
        hiddenSection.style.display = 'none'; // Esconde a hidden-section

    });

    returnButton2.addEventListener('click', () => {
        // Alternar a visibilidade da main-section e hidden-section
        mainSection.style.display = 'block'; // Mostra a main-section
        hiddenSection.style.display = 'none'; // Esconde a hidden-section
        leaderboardSection.style.display = 'none';
        loginSection.style.display = 'none';

    });

    document.querySelector('.img-dara').addEventListener('click', () => {
        // Recarrega a página
        location.reload();
    });

    rulesButton.addEventListener('click', () => {
        // Alternar a visibilidade da main-section e hidden-section
        mainSection.style.display = 'none'; // Esconde a main-section
        hiddenSection.style.display = 'block'; // Mostra a hidden-section
        leaderboardSection.style.display = 'none';
    });

    

    const loginSection = document.getElementById("login-section");
    const loginForm = document.getElementById("login-form");
    const logoutButton = document.getElementById("logout-button");
    const leaderboardButton = document.getElementById("leaderboard");
    const leaderboardSection = document.getElementById("leaderboard-section");

    
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Isso impedirá o envio padrão do formulário que recarrega a página
        // Coloque o código para lidar com o login aqui

        username = document.getElementById("username").value;
        //console.log("username: " + username);
        hiddenSection.style.display = 'none';
        loginSection.style.display = 'none';
        mainSection.style.display = 'block';
        logoutButton.style.display = 'block';
        leaderboardSection.style.display = 'none';

        // Cria um objeto de utilizador para armazenar os dados do utilizador

        user = new User(username, 0, 0);

    });


    logoutButton.addEventListener("click", () => {

        hiddenSection.style.display = 'none';
        loginSection.style.display = 'block';
        mainSection.style.display = 'none';
        logoutButton.style.display = 'none';
        leaderboardSection.style.display = 'none';
    });

    leaderboardButton.addEventListener("click", () => {
        hiddenSection.style.display = 'none';
        loginSection.style.display = 'none';
        mainSection.style.display = 'none';
        leaderboardSection.style.display = 'block';

    });

    const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
    });

});