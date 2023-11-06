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
        constructor(username, totalGames, victories, loses) {
            this.username = username;
            this.totalGames = totalGames;
            this.victories = victories;
            this.loses = loses;
            this.totalGames = this.victories + this.loses;
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
                            cell.style.backgroundImage = 'url("assets/white.png")';
                        }
                        if (this.board[row][col] === '2') {
                            cell.style.backgroundImage = 'url("assets/black.png")';
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
                            cell.style.backgroundImage = 'url("assets/white.png")';
                        } else if (this.board[row][col] === '2') {
                            cell.style.backgroundImage = 'url("assets/black.png")';
                        }
                    }
                }
            }
        }


        possible_remove(i,j,Player) {


            // Check Horizontal
            let leftlim = Math.max(0, j - 3);
            let rightlim = Math.min(this.board[i].length - 1, j + 3);
            
            //console.log("horizontal| top: "  + leftlim + " bottom: " + rightlim)
            
            for (let k = leftlim; k <= rightlim - 2; k++) {
                //console.log("hor row: "  + i + " | " + board.board[i][k] + " " + board.board[i][k + 1] + " " + board.board[i][k + 2]);
                if (
                    Player === (this.board[i][k] || 0) &&
                    Player === (this.board[i][k + 1] || 0) &&
                    Player === (this.board[i][k + 2] || 0)
                ) {
                    moveDisplay.style.display = 'none';
                    removeDisplay.style.display = 'block';
                    return true;
                }
            }
        
            // Check Vertical
            let toplim = Math.max(0, i - 3);
            let bottomlim = Math.min(this.board.length - 1, i + 3);
            
            //console.log("vertical| top: "  + toplim + " bottom: " + bottomlim)
            for (let k = toplim; k <= bottomlim - 2; k++) {
                //console.log("ver col: "  + k + " | " + board.board[k][j] + " " + board.board[k + 1][j] + " " + board.board[k + 2][j])
                if (
                    Player === (this.board[k][j] || 0) &&
                    Player === (this.board[k + 1][j] || 0) &&
                    Player === (this.board[k + 2][j] || 0)
                ) {
                    moveDisplay.style.display = 'none';
                    removeDisplay.style.display = 'block';
                    return true;
                }
            }
            return false;
        }


        getPlayerCells(Player) {
            // colocar depois se o bot é o primeiro a jogar ou nao
            const cellsInBoard = [];
            for (let row = 0; row < this.numRows; row++) {
                for (let col = 0; col < this.numCols; col++) {
                    if (this.board[row][col] === Player) {
                        cellsInBoard.push({ row, col });
                    }
                }
            }
            return cellsInBoard;
        }


        getAvailableCells() {
            const availableCells = [];
            for (let row = 0; row < this.numRows; row++) {
                for (let col = 0; col < this.numCols; col++) {
                    let boardCopy = JSON.parse(JSON.stringify(this.board));
                    if (this.possible_play(row, col, currentPlayer, boardCopy,0,0)) {
                        availableCells.push({ row, col });
                    }
                }
            }
            return availableCells;
        }


        removeLineof2(board_i, opponent) {
            const rows = this.numRows;
            const cols = this.numCols;
            const candidates = [];
        
            // horizontal
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols - 2; j++) {
                    if (
                        board_i[i][j] === opponent && 
                        board_i[i][j + 1] === opponent && 
                        board_i[i][j + 2] !== opponent
                    ) {
                        candidates.push({ i, j });
                    }
                }
            }
        
            // vertical
            for (let i = 0; i < rows - 2; i++) {
                for (let j = 0; j < cols; j++) {
                    if (
                        board_i[i][j] === opponent && 
                        board_i[i + 1][j] === opponent && 
                        board_i[i + 2][j] !== opponent
                    ) {
                        candidates.push({  i,  j });
                        console.log("candidates: " + i + " " + j);
                    }
                }
            }
        
            if (candidates.length > 0) {
                const randomIndex = Math.floor(Math.random() * candidates.length);
                const candidate = candidates[randomIndex];
                return candidate;
            }
            return -1;
        }

        
        go_back(row,col,rowSel,colSel,Player){
            if (Player == '1'){
                if (row == this.LastPlay1.row && 
                    col == this.LastPlay1.col && 
                    rowSel == this.LastPlay1.rowSelected 
                    && colSel == this.LastPlay1.colSelected)
                    return false;
            }else{
                if (row == this.LastPlay2.row && 
                    col == this.LastPlay2.col && 
                    rowSel == this.LastPlay2.rowSelected 
                    && colSel == this.LastPlay2.colSelected)
                    return false;	
            }
            return true;
        
        }


        possible_remove2(i,j,Player, board_i) {

            let leftlim = Math.max(0, j - 3);
            let rightlim = Math.min(board_i[0].length - 1, j + 3);
            
            //console.log("horizontal| top: "  + leftlim + " bottom: " + rightlim)
            
            for (let k = leftlim; k <= rightlim - 2; k++) {
                //console.log("hor row: "  + i + " | " + board[i][k] + " " + board[i][k + 1] + " " + board[i][k + 2]);
                if (
                    Player === (board_i[i][k] || 0) &&
                    Player === (board_i[i][k + 1] || 0) &&
                    Player === (board_i[i][k + 2] || 0)
                ) {
    
                    return true;
                }
            }
        
            let toplim = Math.max(0, i - 3);
            let bottomlim = Math.min(board_i.length - 1, i + 3);
            
            //console.log("vertical| top: "  + toplim + " bottom: " + bottomlim)
            for (let k = toplim; k <= bottomlim - 2; k++) {
                //console.log("ver col: "  + k + " | " + board[k][j] + " " + board[k + 1][j] + " " + board[k + 2][j])
                if (
                    Player === (board_i[k][j] || 0) &&
                    Player === (board_i[k + 1][j] || 0) &&
                    Player === (board_i[k + 2][j] || 0)
                ) {
                    return true;
                }
            }
            return false;
        }

        possible_click(i, j, Player) {
            if (this.board[i][j] === Player) {
                //console.log('true - Cell is yours');
                return true;
            }
            //console.log('false - Cell is not yours');
            return false;
        }

        
        possible_move(i,j, rowSel, colSel){
            if (i === rowSel && Math.abs(j -colSel) === 1) {
                return true;
            }else if(j === colSel && Math.abs(i - rowSel) === 1){
                return true;    
            }else{
                return false;
            }
        }

        possible_play(i, j, Player,board_layout, rowSel, colSel) {
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
        
            board_layout[i][j] = Player;
    
            if (!putPhase) {
                //console.log( "rowSelected: " + rowSelected + " colSelected: " + colSelected) + " na board.possible_play";
                board_layout[rowSel][colSel] = 0; // tirar a peça da posição anterior
            }
            
    
            // Check Horizontal
            let leftlim = Math.max(0, j - 3);
            let rightlim = Math.min(board_layout[i].length - 1, j + 3);
            
            //console.log("horizontal| top: "  + leftlim + " bottom: " + rightlim)
            
            for (let k = leftlim; k <= rightlim - 3; k++) {
                //console.log("hor row: "  + i + " | " + board.board[i][k] + " " + board.board[i][k + 1] + " " + board.board[i][k + 2] + " " + board.board[i][k + 3]);
                if (
                    Player === (board_layout[i][k] || 0 ) &&
                    Player === (board_layout[i][k + 1] || 0 ) &&
                    Player === (board_layout[i][k + 2] || 0 ) &&
                    Player === (board_layout[i][k + 3] || 0 )
                ) {
                    board_layout[i][j] = 0;  // Set it back to an empty cell
                    if (!putPhase) {
                        board_layout[rowSel][colSel] = Player; // tirar a peça da posição anterior
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
                    Player === (board_layout[k][j] || 0) &&
                    Player === (board_layout[k + 1][j] || 0) &&
                    Player === (board_layout[k + 2][j] || 0) &&
                    Player === (board_layout[k + 3][j] || 0)
                ) {
                    board_layout[i][j] = 0;  // Set it back to an empty cell
                    if (!putPhase) {
                        board_layout[rowSel][colSel] = Player; // tirar a peça da posição anterior
                    }
                    //console.log('false - Cell is 4 in line vertical');
                    return false;
                }
            }
        
            if (!putPhase) {
                board_layout[i][j] = 0;
                board_layout[rowSel][colSel] = Player;
            }
        
            //console.log('true - Move is possible');
            return true;
        } 


        moves_available(Player) {
            let movesAvailable = [];
            let boardCopy = JSON.parse(JSON.stringify(this.board));
            //for (let i = 0; i < 6; i++) {
                //console.log(boardCopy[i][0] + " " + boardCopy[i][1] + " " + boardCopy[i][2] + " " + boardCopy[i][3] + " " + boardCopy[i][4]);
            //}
        
            for (let i = 0; i < boardCopy.length; i++) {
                for (let j = 0; j < boardCopy[0].length; j++) {
                    if (boardCopy[i][j] === Player) {
                        let new_colSelected = j;
                        let new_rowSelected = i;
                        if (i > 0) {
                            if (board.possible_play(i - 1, j, Player, boardCopy, new_rowSelected, new_colSelected) && board.possible_move(i - 1, j, i, j) && board.go_back(i - 1, j, i, j, Player)) {
                                movesAvailable.push([i, j, i - 1, j]);
                            }
                        }
                        if (i < boardCopy.length - 1) {
                            if (board.possible_play(i + 1, j, Player, boardCopy, new_rowSelected, new_colSelected) && board.possible_move(i + 1, j, i, j) && board.go_back(i + 1, j, i, j, Player)) {
                                movesAvailable.push([i, j, i + 1, j]);
                            }
                        }
                        if (j > 0) {
                            if (board.possible_play(i, j - 1, Player, boardCopy, new_rowSelected, new_colSelected) && board.possible_move(i, j - 1, i, j) && board.go_back(i, j - 1, i, j, Player)) {
                                movesAvailable.push([i, j, i, j - 1]);
                            }
                        }
                        if (j < boardCopy[0].length - 1) {
                            if (board.possible_play(i, j + 1, Player, boardCopy, new_rowSelected, new_colSelected) && board.possible_move(i, j + 1, i, j) && board.go_back(i, j + 1, i, j, Player)) {
                                movesAvailable.push([i, j, i, j + 1]);
                            }
                        }
                    }
                }
            }
            //console.log("movesAvailable for player " + Player + ": " + movesAvailable);
            return movesAvailable;
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

    function updateLeaderboard(user) {
        const leaderboardTable = document.getElementById('leaderboard-table');
        let existingRow;
    
        // Verifique se o nome do usuário já está na tabela de classificação
        for (let i = 1; i < leaderboardTable.rows.length; i++) {
            const row = leaderboardTable.rows[i];
            const nameCell = row.cells[1];
            if (nameCell.textContent === user.username) {
                existingRow = row;
                break;
            }
        }
    
        if (existingRow) {
            // Se o nome do usuário já estiver na tabela, atualize as células de vitórias, derrotas e total de jogos
            const victoriesCell = existingRow.cells[2];
            const defeatsCell = existingRow.cells[3];
            const totalGamesCell = existingRow.cells[4];
            victoriesCell.textContent = user.victories/2;
            defeatsCell.textContent = user.loses/2;
            totalGamesCell.textContent = (user.victories + user.loses)/2;
        } else {
            // Caso contrário, adicione uma nova linha na tabela
            const newRow = leaderboardTable.insertRow(-1);
            const positionCell = newRow.insertCell(0);
            const nameCell = newRow.insertCell(1);
            const victoriesCell = newRow.insertCell(2);
            const defeatsCell = newRow.insertCell(3);
            const totalGamesCell = newRow.insertCell(4);
            positionCell.textContent = leaderboardTable.rows.length - 1;
            nameCell.textContent = user.username;
            victoriesCell.textContent = user.victories/2;
            defeatsCell.textContent = user.loses /2;
            totalGamesCell.textContent = (user.victories + user.loses)/2;
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

            if (currentPlayer === bot_piece && bot === true && putPhase === true && level.value === 'easy') {
                console.log("BOT MOVE 1111");
                makeBotMove();
            }
            
            if (currentPlayer === bot_piece && bot === true && putPhase === true && level.value === 'medium') {
                console.log("MEDIUM MOVE");
                makeBotMoveM();
                
            }
            if (currentPlayer === bot_piece && bot === true && putPhase === true && level.value === 'hard') {
                console.log("Hard MOVE");
                makeBotMoveM();
                
            }
            if (putPhase === false && player1 == bot_piece) {
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
                    if (board.possible_remove(row, col, currentPlayer_copy)) {
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
            if (currentPlayer === bot_piece && bot === true && bot_can_play === true && level.value === 'easy') {
                console.log("BOT MOVE AAAAA");
                makeBotMove(); // Se for a fase de colocação e o jogador é o bot, faça o bot jogar imediatamente.
                moved_piece = false;
                pieceSelected = false;
                canRemove = false;
                bot_can_play = false;
                currentPlayerDisplay.textContent = playerNames[player_piece];
                console.log("bot_can_play" + bot_can_play);
                possible_win();
            }
            if (currentPlayer === bot_piece && bot === true && bot_can_play === true && level.value === 'medium') {
                console.log("Medium MOVE");
                makeBotMoveM(); // Se for a fase de colocação e o jogador é o bot, faça o bot jogar imediatamente.
                moved_piece = false;
                pieceSelected = false;
                canRemove = false;
                bot_can_play = false;
                currentPlayerDisplay.textContent = playerNames[player_piece];
                possible_win();
            }
            if (currentPlayer === bot_piece && bot === true && bot_can_play === true && level.value === 'hard') {
                console.log("hard MOVE");
                makeBotMoveH(); // Se for a fase de colocação e o jogador é o bot, faça o bot jogar imediatamente.
                moved_piece = false;
                pieceSelected = false;
                canRemove = false;
                bot_can_play = false;
                currentPlayerDisplay.textContent = playerNames[player_piece];
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
        // Dispamoves_availablere o evento de clique na célula desejada
        const targetCell = document.querySelector(`[data-row="${botRow}"][data-col="${botCol}"]`);
        targetCell.dispatchEvent(clickEvent);
        isFirstBotMove = false; // Marque que o primeiro movimento do bot já ocorreu
        
    }

    //_____________________________________________________________________________________________________________

    function makeBotMove() {
        if (putPhase) {
            const availableCells = board.getAvailableCells(); // Função para obter células disponíveis
            if (availableCells.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableCells.length);
                const randomCell = availableCells[randomIndex];

                console.log("randomCell: " + randomCell.row + " " + randomCell.col);
                // Simula o clique na célula escolhida pelo bot
                handlePlacementPhase(randomCell.row, randomCell.col);
            }
        }else{
            console.log("BOT MOVE 2222")
            const movesBot = board.moves_available(bot_piece);
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
                
                if (board.possible_remove(randomMove[2], randomMove[3], bot_piece)){
                    const piecesToRemove = board.getPlayerCells(player_piece);
                    const randomIndex = Math.floor(Math.random() * piecesToRemove.length);
                    const randomCell = piecesToRemove[randomIndex];
                    handleRemovePiece(randomCell.row, randomCell.col, bot_piece);
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
            const availableCells = board.getAvailableCells(); // Função para obter células disponíveis
            if (availableCells.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableCells.length);
                const randomCell = availableCells[randomIndex];
    
                console.log("randomCell: " + randomCell.row + " " + randomCell.col);
                // Simula o clique na célula escolhida pelo bot
                handlePlacementPhase(randomCell.row, randomCell.col);
            }
        } else {
            const movesBot = board.moves_available(bot_piece);
            const winningMoves = [];
            let randomMove; // Defina randomMove antes do uso
            
            for (let i = 0; i < movesBot.length; i++) {
                console.log("i: " + i + " movesBot: " + movesBot[i]);
                const [startRow, startCol, endRow, endCol] = movesBot[i];
                // Faça uma cópia temporária do tabuleiro
                const boardCopy = JSON.parse(JSON.stringify(board.board));
    
                // Simule a jogada do bot
                boardCopy[endRow][endCol] = bot_piece;
                boardCopy[startRow][startCol] = 0;
                // imprime o tabuleiro
                for (let i = 0; i < 6; i++) {
                    console.log(boardCopy[i][0] + " " + boardCopy[i][1] + " " + boardCopy[i][2] + " " + boardCopy[i][3] + " " + boardCopy[i][4]);
                }
                // Verifique se essa jogada resulta em uma linha de 3 para o bot
                if (board.possible_remove2(endRow, endCol, bot_piece, boardCopy)) {
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
    
            if (board.possible_remove(randomMove[2], randomMove[3], bot_piece)) {
                const piecesToRemove = board.getPlayerCells(player_piece);
                const randomIndex = Math.floor(Math.random() * piecesToRemove.length);
                const randomCell = piecesToRemove[randomIndex];
                handleRemovePiece(randomCell.row, randomCell.col, bot_piece);
                moveDisplay.style.display = 'block';
                removeDisplay.style.display = 'none';
                possible_win();
            }
        }
    }
    
    
    function makeBotMoveH() {
        if (putPhase) {
            const availableCells = board.getAvailableCells(); // Função para obter células disponíveis
            if (availableCells.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableCells.length);
                const randomCell = availableCells[randomIndex];
                console.log("randomCell: " + randomCell.row + " " + randomCell.col);
                // Simula o clique na célula escolhida pelo bot
                handlePlacementPhase(randomCell.row, randomCell.col);
            }
        } else {
            const movesBot = board.moves_available(bot_piece);
            const winningMoves = [];
            let randomMove; // Defina randomMove antes do uso
            
            for (let i = 0; i < movesBot.length; i++) {
                console.log("i: " + i + " movesBot: " + movesBot[i]);
                const [startRow, startCol, endRow, endCol] = movesBot[i];
                // Faça uma cópia temporária do tabuleiro
                const boardCopy = JSON.parse(JSON.stringify(board.board));
    
                // Simule a jogada do bot
                boardCopy[endRow][endCol] = bot_piece;
                boardCopy[startRow][startCol] = 0;
                // imprime o tabuleiro
                for (let i = 0; i < 6; i++) {
                    console.log(boardCopy[i][0] + " " + boardCopy[i][1] + " " + boardCopy[i][2] + " " + boardCopy[i][3] + " " + boardCopy[i][4]);
                }
                // Verifique se essa jogada resulta em uma linha de 3 para o bot
                if (board.possible_remove2(endRow, endCol, bot_piece, boardCopy)) {
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
                randomMove = movesBot[randomIndex];
                handlePieceSelection(randomMove[0], randomMove[1]);
                handlePieceMovement(randomMove[2], randomMove[3]);
            }
    
            // Verifique se é possível remover uma peça
            if (board.possible_remove(randomMove[2], randomMove[3], bot_piece)) {
                // Encontre uma peça branca que pertença a uma linhaS de 2 e a remova
                
                const piecesToRemove = board.removeLineof2(board.board, player_piece);
                console.log("piecesToRemove: " + piecesToRemove.i + " " + piecesToRemove.j);

                if (piecesToRemove !== -1) {
                    console.log("isoooooo"+ bot_piece);
                    handleRemovePiece(piecesToRemove.i, piecesToRemove.j, bot_piece);
                    moveDisplay.style.display = 'block';
                    removeDisplay.style.display = 'none';
                    possible_win();
                }else{
                    // Se não houver peças brancas que pertençam a uma linha de 2, remova uma peça branca aleatória
                    const piecesToRemove = board.getPlayerCells(player_piece);
                    const randomIndex = Math.floor(Math.random() * piecesToRemove.length);
                    const randomCell = piecesToRemove[randomIndex];
                    handleRemovePiece(randomCell.row, randomCell.col, bot_piece);
                    moveDisplay.style.display = 'block';
                    removeDisplay.style.display = 'none';
                    possible_win();
                }
            }
        }
    }



    //_____________________________________________________________________________________________________________

    // Função para lidar com a fase de colocação de peças
    function handlePlacementPhase(row, col) {
        
        //for (let i = 0; i < 6; i++) {
            //console.log(board.board[i][0] + " " + board.board[i][1] + " " + board.board[i][2] + " " + board.board[i][3] + " " + board.board[i][4]);
        //}
        let canPlacePiece = board.possible_play(row, col, currentPlayer,board.board,0,0);
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
        currentPlayerDisplay.textContent = playerNames[player_piece];
            }
            putDisplay.style.display = 'none';
            moveDisplay.style.display = 'block';
        }
    }
    

    function handlePieceSelection(row, col) {
        if (board.possible_click(row, col, currentPlayer)) {
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
                selectedCell.style.backgroundImage = 'url("assets/white-selected.png")';
            } else {
                selectedCell.style.backgroundImage = 'url("assets/black-selected.png")';
            }
        } else {
            console.log('Peça não pode ser selecionada');
        }
    }
    

    // Função para lidar com o movimento de peças
    function handlePieceMovement(row, col) {
        if (row === rowSelected && col === colSelected) {
            const selectedCell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            pieceSelected = false;
            if (currentPlayer === '1') {
                selectedCell.style.backgroundImage = 'url("assets/white.png")';
            }
            else{
                selectedCell.style.backgroundImage = 'url("assets/black.png")';
            }
        } else {
            if (board.possible_play(row, col, currentPlayer, board.board,rowSelected,colSelected) && board.possible_move(row, col, rowSelected, colSelected) && board.go_back(row, col, rowSelected, colSelected, currentPlayer)) {
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


    //_______________________________________________________________________________________________________
























    






    






    
    


    function possible_win(){
            console.log("POSSIBLE WINNNNNNN");
            console.log("playerBpieces: " + finalBpieces + " playerWpieces: " + finalWpieces);
            moves_available_1 = board.moves_available('1');
            moves_available_2 = board.moves_available('2');
            console.log("moves_available_1: " + moves_available_1);
            console.log("moves_available_2: " + moves_available_2);
        if (finalBpieces <= 2 ||  moves_available_2.length == 0){
            winner = '1';
            game_finished(winner);
            return winner;
        }
        else if (finalWpieces <= 2 || moves_available_1.length == 0){
            winner = '2';
            game_finished(winner);
            return winner;
        }
        else{
            return 0;
        }
    } 


    function game_finished(winner) {
        let win_text = document.getElementById("game-result");
        if (winner === '1') {
            win_text.innerText = "Ganhou o Branco";
        } else {

            win_text.innerText = "Ganhou o Preto";
        }
    
        if (bot === true) {

            if (winner === player_piece) {
                user.victories++;
            } else {
                user.loses++;
            }
    
            updateLeaderboard(user);
            
        }

        isGameActive = false;
    }



// mudar depois de sitio


let bot_piece = '2'
let player_piece = '1'

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

    } else if (firstPlayerSelect.value === 'preto'){
        player1 = '2';
    }

    if (colorSelect.value === 'branco'){
        bot_piece = '2';
        player_piece = '1';
    } else if (colorSelect.value === 'preto'){
        bot_piece = '1';
        player_piece = '2';
    }


    currentPlayer = player1;
    currentPlayerDisplay.textContent = playerNames[currentPlayer];
    gameResultDisplay.textContent = '';
    isGameActive = true;

    //verifca se o outro jogador é o bot
    if (opponentSelect.value === 'computer') {
        bot = true;
        if (level.value === 'easy') {
            if (player1 === bot_piece) {
                makeBotMove();
                bot_can_play = true;
            }
        }else if (level.value === 'medium') {
            if (player1 === bot_piece) {
                makeBotMoveM();
                bot_can_play = true; 
            }
        }else{
            if (player1 === bot_piece) {
                makeBotMoveH();
                bot_can_play = true; 
            }
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

    const colorSelect = document.querySelector('#color-choice');
    const opponentSelect = document.querySelector('#opponent');
    const levelLabel = document.getElementById('level-label');
    const levelSelect = document.getElementById('level');
    const colorChoiceLabel = document.getElementById('color-choice-set');
    const colorChoice= document.getElementById('color-choice');
    

    // Adicione um ouvinte de evento à seleção do oponente
    opponentSelect.addEventListener('change', () => {
        const selectedOption = opponentSelect.value;
        const colorChoiceLabel = document.getElementById('color-choice-set');
    
        // Verifique se a opção selecionada é 'computer' para mostrar ou ocultar a label de nível e o campo de seleção de nível
        if (selectedOption === 'computer') {
            levelLabel.style.display = 'block'; // Mostrar a label de nível
            levelSelect.style.display = 'block'; // Mostrar o campo de seleção de nível
            colorChoiceLabel.style.display = 'block';
            colorChoice.style.display = 'block';
        } else {
            levelLabel.style.display = 'none'; // Ocultar a label de nível
            levelSelect.style.display = 'none'; // Ocultar o campo de seleção de nível
            colorChoiceLabel.style.display = 'none'; // Ocultar a label de escolha de cor
            colorChoice.style.display = 'none'; // Ocultar o campo de escolha de cor
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

        user = new User(username, 0, 0, 0);

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