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
    const playerput = document.getElementById("player-toplay");
    const playerputonline = document.getElementById("player-toplay-online");

//classe do utilizador
    class User {
        constructor(username, password,totalGames, victories, loses) {
            this.username = username;
            this.password = password;
            this.totalGames = totalGames;
            this.victories = victories;
            this.loses = loses;
            this.totalGames = this.victories + this.loses;
        }
    }

//classe do board
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
            // Cria um array 2D com o número de linhas e colunas especificadas
            let board = new Array(rows).fill(0).map(() => new Array(cols).fill(0));
            return board;
        }
        renderBoard() {
            console.log("Rendering the board...");
        
            for (let row = 0; row < this.numRows; row++) {
                for (let col = 0; col < this.numCols; col++) {
                    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                    console.log(`(${row}, ${col}): ${this.board[row][col]}`);
                    
                    cell.textContent = '';
                    cell.style.backgroundImage = 'none';
        
                    if (this.board[row][col] == '1') {
                        cell.style.backgroundImage = 'url("assets/white.png")';
                    } else if (this.board[row][col] == '2') {
                        cell.style.backgroundImage = 'url("assets/black.png")';
                    }
                }
            }
        }
        


        possible_remove(i,j,Player) {
            // Verifica um possível remove
            // Verifica na horizontal
            let leftlim = Math.max(0, j - 3);
            let rightlim = Math.min(this.board[i].length - 1, j + 3);
            
            for (let k = leftlim; k <= rightlim - 2; k++) {

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
        
            // Verifica na Vertical
            let toplim = Math.max(0, i - 3);
            let bottomlim = Math.min(this.board.length - 1, i + 3);
            
  
            for (let k = toplim; k <= bottomlim - 2; k++) {

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
            // Retorna uma lista de objetos de células que contêm as coordenadas de todas as células ocupadas pelo jogador especificado
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
            // Retorna uma lista de objetos de células que contêm as coordenadas de todas as células do jogador atual
            const availableCells = [];
            for (let row = 0; row < this.numRows; row++) {
                for (let col = 0; col < this.numCols; col++) {
                    let boardCopy = JSON.parse(JSON.stringify(this.board));
                    if (this.possible_play(row, col, game.currentPlayer, boardCopy,0,0)) {
                        availableCells.push({ row, col });
                    }
                }
            }
            return availableCells;
        }


        removeLineof2(board_i, opponent) {
            // Bloqueia uma linha de 2 do oponente
            const rows = this.numRows;
            const cols = this.numCols;
            const candidates = [];
        
            // Horizontal
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
        
            // Vertical
            for (let i = 0; i < rows - 2; i++) {
                for (let j = 0; j < cols; j++) {
                    if (
                        board_i[i][j] === opponent && 
                        board_i[i + 1][j] === opponent && 
                        board_i[i + 2][j] !== opponent
                    ) {
                        candidates.push({  i,  j });
                        
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
            // Verifica se a jogada não é a mesma que a anterior
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
            // Verifica um possível remove para testes
            let leftlim = Math.max(0, j - 3);
            let rightlim = Math.min(board_i[0].length - 1, j + 3);
            
            
            for (let k = leftlim; k <= rightlim - 2; k++) {

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
            

            for (let k = toplim; k <= bottomlim - 2; k++) {

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
            // Verifica se a célula clicada contém uma peça do jogador
            if (this.board[i][j] === Player) {
                return true;
            }
            return false;
        }

        
        possible_move(i,j, rowSel, colSel){
            // Verifica se a célula clicada é adjacente à célula selecionada
            if (i === rowSel && Math.abs(j -colSel) === 1) {
                return true;
            }else if(j === colSel && Math.abs(i - rowSel) === 1){
                return true;    
            }else{
                return false;
            }
        }

        possible_play(i, j, Player,board_layout, rowSel, colSel) {
            // Verifica se a célula clicada é válida para colocar uma peça
            if (i < 0 || i >= board_layout.length || j < 0 || j >= board_layout[i].length) {
                return false;
            }
        
            // Verifica se a célula clicada está vazia
            if (board_layout[i][j] !== 0) {
                return false;
            }
        
            board_layout[i][j] = Player;
    
            if (!game.putPhase) {
                board_layout[rowSel][colSel] = 0; // tirar a peça da posição anterior
            }
            
    
            // Verifica Horizontal
            let leftlim = Math.max(0, j - 3);
            let rightlim = Math.min(board_layout[i].length - 1, j + 3);
            
            
            for (let k = leftlim; k <= rightlim - 3; k++) {
            
                if (
                    Player === (board_layout[i][k] || 0 ) &&
                    Player === (board_layout[i][k + 1] || 0 ) &&
                    Player === (board_layout[i][k + 2] || 0 ) &&
                    Player === (board_layout[i][k + 3] || 0 )
                ) {
                    board_layout[i][j] = 0;  // Põe a célula de volta a uma célula vazia
                    if (!game.putPhase) {
                        board_layout[rowSel][colSel] = Player; // Tirar a peça da posição anterior
                    }
    
                    return false;
                }
            }
        
            // Verifica Vertical
            let toplim = Math.max(0, i - 3);
            let bottomlim = Math.min(board_layout.length - 1, i + 3);
            

            for (let k = toplim; k <= bottomlim - 3; k++) {
            
                if (
                    Player === (board_layout[k][j] || 0) &&
                    Player === (board_layout[k + 1][j] || 0) &&
                    Player === (board_layout[k + 2][j] || 0) &&
                    Player === (board_layout[k + 3][j] || 0)
                ) {
                    board_layout[i][j] = 0;  // Põe a célula de volta a uma célula vazia
                    if (!game.putPhase) {
                        board_layout[rowSel][colSel] = Player; // Tirar a peça da posição anterior
                    }

                    return false;
                }
            }
        
            if (!game.putPhase) {
                board_layout[i][j] = 0;
                board_layout[rowSel][colSel] = Player;
            }
        

            return true;
        } 


        moves_available(Player) {
            // Retorna uma lista de movimentos disponíveis para o jogador
            let movesAvailable = [];
            let boardCopy = JSON.parse(JSON.stringify(this.board));
        
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
            return movesAvailable;
        }

        updateSideBoards() {
            // Função para atualizar os tabuleiros laterais
            this.updateSideBoard(1, 'side_board_1');
            this.updateSideBoard(2, 'side_board_2');
        }
        
    
        updateSideBoard(player, sideBoardId) {
            // Função para atualizar um tabuleiro lateral
            if (game.putPhase) {
            const sideBoard = document.querySelector(`.${sideBoardId}`);
            const piecesCount = player === 1 ? this.playerBpieces : this.playerWpieces;
            let piecesCount2;
            if (game.player1 === '2'){
                piecesCount2 = piecesCount + 1;
            }
            console.log("aquiiiiiiii" + piecesCount2);
            sideBoard.innerHTML = ''; // «Limpa» o tabuleiro lateral
            
            if (game.online){
                if (game.player1 === '1'){
                    for (let i = 0; i < piecesCount; i++) {
                        const piece = document.createElement('div');
                        piece.classList.add(player === 1 ? 'white-piece' : 'black-piece');
                        sideBoard.appendChild(piece);
                    }
                }
                else{
                    for (let i = 0; i < piecesCount2; i++) {
                        const piece = document.createElement('div');
                        piece.classList.add(player === 1 ? 'white-piece' : 'black-piece');
                        sideBoard.appendChild(piece);
                    }
                }
            }else{
                for (let i = 0; i < piecesCount; i++) {
                    const piece = document.createElement('div');
                    piece.classList.add(player === 1 ? 'white-piece' : 'black-piece');
                    sideBoard.appendChild(piece);
                }
            }


        } else {
            const side = player === 1 ? 'side_board_2' : 'side_board_1';
            const sideBoard = document.querySelector(`.${side}`);
            const piecesCount = player === 1 ? this.finalBpieces : this.finalWpieces;
            
            sideBoard.innerHTML = ''; // «Limpa» o tabuleiro lateral
            let npieces = 12 - piecesCount;
        
            for (let i = 0; i < npieces; i++) {
                const piece = document.createElement('div');
                piece.classList.add(player === 1 ? 'black-piece' : 'white-piece');
                sideBoard.appendChild(piece);
            }
        }
        }
    
    

    }


    // Classe do jogo

    class Game {

        constructor(){
            this.currentPlayer = -1;
            this.putPhase = true;
            this.isGameActive = false;
            this.bot = false;
            this.player1 = -1;
            this.player_piece = -1;
            this.bot_piece = -1;
            this.rowSelected = 0;
            this.colSelected = 0;
            this.currentPlayer_copy = -1;
            this.bot_can_play = false;
            this.pieceSelected = false;
            this.canRemove = false;
            this.moved_piece = false;
            this.moves_available_1 = [];
            this.moves_available_2 = [];
            this.game_id = 0;
            this.online = false;
            this.firstPlayerOnline = false;
            this.secondPlayerOnline = false;
            this.onlinePlayer = 1; // 1 é o primeiro
            this.nick = document.getElementById("username").value
        }



        async handleCellClick(row, col) {
            // Funçaõ para lidar com o clique na célula e controla o fluxo do jogo
  
            if (!this.isGameActive) return;
            if (this.putPhase) {
                // Fase de colocação
                //board.renderBoard();
                this.handlePlacementPhase(row, col);
                if (this.online){
                    console.log("ssss")
                    const move = {row:row,column:col}
                    await notify(user.username, user.password, game.game_id, move);
                }
                //board.renderBoard();

                if (this.currentPlayer === this.bot_piece && this.bot === true && this.putPhase === true && level.value === 'easy') {
                    this.makeBotMove();
                }
                
                if (this.currentPlayer === this.bot_piece && this.bot === true && this.putPhase === true && level.value === 'medium') {
                    this.makeBotMoveM();
                    
                }
                if (this.currentPlayer === this.bot_piece && this.bot === true && this.putPhase === true && level.value === 'hard') {
                    this.makeBotMoveM();
                    
                }
                if (this.bot === true && this.putPhase === false && this.player1 == this.bot_piece) {
                    this.performBotMove();
                }

            
            } else{
                this.possible_win();
                console.log("Move Phaseeeeeeee")
                if (!this.pieceSelected) {
                    // Se nenhuma peça foi selecionada, tenta selecionar uma peça
                    this.handlePieceSelection(row, col);

                } else {
                    if (!this.moved_piece) {
                        // Se nenhuma peça foi movida, tenta mover a peça selecionada
                        this.handlePieceMovement(row, col);
                        if (this.online){
                            console.log("ssss")
                            const move = {row:row,column:col}
                            await notify(user.username, user.password, game.game_id, move);
                        }
                    }
                }
        
                if (this.moved_piece) {
                    // Se uma peça foi movida, verifica se é possível remover uma peça
                    if (this.canRemove) {
                        this.handleRemovePiece(row, col, this.currentPlayer_copy);
                        removeDisplay.style.display = 'none';
                        moveDisplay.style.display = 'block';
                        if (this.online){
                            console.log("ssss")
                            const move = {row:row,column:col}
                            await notify(user.username, user.password, game.game_id, move);
                        }
                        this.possible_win();

                    } else {
                        if (board.possible_remove(row, col, this.currentPlayer_copy)) {
                            this.canRemove = true;
                        } else {

                            currentPlayerDisplay.textContent = playerNames[this.currentPlayer];
                            this.moved_piece = false;
                            this.pieceSelected = false;
                            this.canRemove = false;
                            this.bot_can_play = true;
                            this.possible_win();   
                            
                        }
                    }
                }
                // Bots
                if (this.currentPlayer === this.bot_piece && this.bot === true && this.bot_can_play === true && level.value === 'easy') {

                    this.makeBotMove();
                    this.moved_piece = false;
                    this.pieceSelected = false;
                    this.canRemove = false;
                    this.bot_can_play = false;
                    currentPlayerDisplay.textContent = playerNames[this.player_piece];
                    this.possible_win();
                }
                if (this.currentPlayer === this.bot_piece && this.bot === true && this.bot_can_play === true && level.value === 'medium') {

                    this.makeBotMoveM(); 
                    this.moved_piece = false;
                    this.pieceSelected = false;
                    this.canRemove = false;
                    this.bot_can_play = false;
                    currentPlayerDisplay.textContent = playerNames[this.player_piece];
                    this.possible_win();
                }
                if (this.currentPlayer === this.bot_piece && this.bot === true && this.bot_can_play === true && level.value === 'hard') {

                    this.makeBotMoveH(); 
                    this.moved_piece = false;
                    this.pieceSelected = false;
                    this.canRemove = false;
                    this.bot_can_play = false;
                    currentPlayerDisplay.textContent = playerNames[this.player_piece];
                    this.possible_win();
                }
            }

        } 
    




        async handlePlacementPhase(row, col) {
            // Função para lidar com a fase de colocação
            console.log("kkkk- " + this.player1 + " " + this.currentPlayer)
            let canPlacePiece = board.possible_play(row, col, this.currentPlayer,board.board,0,0);
            console.log("canPlacePiece: " + canPlacePiece)
            if (canPlacePiece ) {
                if (this.currentPlayer === '1' && board.playerBpieces > 0) {
                    if (!this.online)board.renderBoard();
                    board.playerBpieces--;
                    if (!this.online)board.updateSideBoards();
                    else{
                        if (this.player1 === '1'){
                            board.updateSideBoard(1, 'side_board_1');
                        }
                    }   
                } else if (this.currentPlayer === '2' && board.playerWpieces > 0) {
                    if (!this.online)board.renderBoard();
                    board.playerWpieces--;
                    if (!this.online)board.updateSideBoards();
                    else{
                        if (this.player1 === '2'){
                            board.updateSideBoard(2, 'side_board_2');
                        }
                    }   
                }
        
                this.currentPlayer = this.currentPlayer === '1' ? '2' : '1';
                currentPlayerDisplay.textContent = playerNames[this.currentPlayer];
                

            } else {
                console.log('Jogada Inválida');
            }
        
            console.log('Peças restantes - Jogador 1:', board.playerBpieces, 'Jogador 2:', board.playerWpieces);
        
            if (board.playerBpieces === 0 && board.playerWpieces === 0) {
                this.putPhase = false;
                console.log('Já colocou todas as peças permitidas durante a fase de colocação.');
                if (this.player1 === '2'){
                    this.currentPlayer = '2'; // jogador preto
                }else{
                    this.currentPlayer = '1'; // jogador branco
                }
                currentPlayerDisplay.textContent = playerNames[this.currentPlayer];
                if (this.bot === true && this.currentPlayer === this.bot_piece) {
                    currentPlayerDisplay.textContent = playerNames[this.player_piece];
                }
                putDisplay.style.display = 'none';
                moveDisplay.style.display = 'block';
            }
            
        }


        handlePieceSelection(row, col) {
            // Função para lidar com a seleção de peças
            if (board.possible_click(row, col, this.currentPlayer)) {
                if (this.canRemove) {
                    console.log("Não podes selecionar uma peça porque já removes-te uma peça");
                    return;
                }
        
                this.rowSelected = row;
                this.colSelected = col;
                this.pieceSelected = true;
        
                console.log('Peça selecionada');
                console.log('Peça selecionada - Linha:', this.rowSelected, 'Coluna:', this.colSelected);
        
                // Atualize a imagem de fundo da célula selecionada para a imagem da peça selecionada
                const selectedCell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                if (this.currentPlayer === '1') {
                    selectedCell.style.backgroundImage = 'url("assets/white-selected.png")';
                } else {
                    selectedCell.style.backgroundImage = 'url("assets/black-selected.png")';
                }
            } else {
                console.log('Peça não pode ser selecionada');
            }
        }


        handlePieceMovement(row, col) {
            // Função para lidar com o movimento de peças
            if (row === this.rowSelected && col === this.colSelected) {
                const selectedCell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                this.pieceSelected = false;
                if (this.currentPlayer === '1') {
                    selectedCell.style.backgroundImage = 'url("assets/white.png")';
                }
                else{
                    selectedCell.style.backgroundImage = 'url("assets/black.png")';
                }
            } else {
                // Verifique se a célula clicada é válida para mover a peça selecionada
                if (board.possible_play(row, col, this.currentPlayer, board.board,this.rowSelected,this.colSelected) && board.possible_move(row, col, this.rowSelected, this.colSelected) && board.go_back(row, col, this.rowSelected, this.colSelected, this.currentPlayer)) {
                    board.board[row][col] = this.currentPlayer;
                    board.board[this.rowSelected][this.colSelected] = 0; // Tirar a peça da posição anterior
        
                    if (this.currentPlayer == '1') {
                        board.LastPlay1.row = this.rowSelected;
                        board.LastPlay1.col = this.colSelected;
                        board.LastPlay1.rowSelected = row;
                        board.LastPlay1.colSelected = col;
                        console.log("LastPlay1: " + board.LastPlay1.row + " " + board.LastPlay1.col + " " + board.LastPlay1.rowSelected + " " + board.LastPlay1.colSelected);
                    } else {
                        board.LastPlay2.row = this.rowSelected;
                        board.LastPlay2.col = this.colSelected;
                        board.LastPlay2.rowSelected = row;
                        board.LastPlay2.colSelected = col;
                        console.log("LastPlay2: " + board.LastPlay2.row + " " + board.LastPlay2.col + " " + board.LastPlay2.rowSelected + " " + board.LastPlay2.colSelected);
                    }
        
                    board.renderBoard();
                    board.updateSideBoards();
                    const selectedCell = document.querySelector(`[data-row="${this.rowSelected}"][data-col="${this.colSelected}"]`);
                    selectedCell.style.backgroundImage = 'none'; // Remova a imagem de fundo da célula de origem
                    this.pieceSelected = false;
                    this.currentPlayer_copy = this.currentPlayer;
                    this.currentPlayer = this.currentPlayer === '1' ? '2' : '1';
                    this.moved_piece = true;
                }
            }
        }


        handleRemovePiece(row, col, Player) {
            // Função para lidar com a remoção de peças
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
                    board.finalBpieces--;
                } else {
                    board.finalWpieces--;
                }
    
        
                currentPlayerDisplay.textContent = playerNames[this.currentPlayer];
                //console.log("You cannot remove a piece - joagdor ativo" + currentPlayer );
                this.moved_piece = false;
                this.pieceSelected = false;
                this.canRemove = false;
        
                // Defina this.bot_can_play como verdadeiro para permitir que o bot jogue
                this.bot_can_play = true;
        
                board.renderBoard();
                board.updateSideBoards();
            }
        }


        performBotMove() {
            // Crie um evento de clique simulado
            const botRow = 1;
            const botCol = 1;
            const targetCell = document.querySelector(`[data-row="${botRow}"][data-col="${botCol}"]`);
            targetCell.dispatchEvent(clickEvent);
            
            
        }

        makeBotMove() {
            // Move do Bot dificuldade fácil
            if (this.putPhase) {
                const availableCells = board.getAvailableCells(); // Função para obter células disponíveis
                if (availableCells.length > 0) {
                    const randomIndex = Math.floor(Math.random() * availableCells.length);
                    const randomCell = availableCells[randomIndex];
                    // Simula o clique na célula escolhida pelo bot
                    this.handlePlacementPhase(randomCell.row, randomCell.col);
                }
            }else{
                const movesBot = board.moves_available(this.bot_piece);
            
                if (movesBot.length > 0) {
                    const randomIndex = Math.floor(Math.random() * movesBot.length);
                    const randomMove = movesBot[randomIndex];

                    this.handlePieceSelection(randomMove[0], randomMove[1]);
                    this.handlePieceMovement(randomMove[2], randomMove[3]);
                    
                    if (board.possible_remove(randomMove[2], randomMove[3], this.bot_piece)){
                        const piecesToRemove = board.getPlayerCells(this.player_piece);
                        const randomIndex = Math.floor(Math.random() * piecesToRemove.length);
                        const randomCell = piecesToRemove[randomIndex];
                        this.handleRemovePiece(randomCell.row, randomCell.col, this.bot_piece);
                        moveDisplay.style.display = 'block';
                        removeDisplay.style.display = 'none';
                        this.possible_win();
    
                    }
                        
                }
                
    
            }
        }
    
        makeBotMoveM() {
            // Move do Bot dificuldade média

            if (this.putPhase) {
                const availableCells = board.getAvailableCells(); // Função para obter células disponíveis
                if (availableCells.length > 0) {
                    const randomIndex = Math.floor(Math.random() * availableCells.length);
                    const randomCell = availableCells[randomIndex];
        
                    // Simula o clique na célula escolhida pelo bot
                    this.handlePlacementPhase(randomCell.row, randomCell.col);
                }
            } else {
                const movesBot = board.moves_available(this.bot_piece);
                const winningMoves = [];
                let randomMove; // Defina randomMove antes do uso
                
                for (let i = 0; i < movesBot.length; i++) {
                    const [startRow, startCol, endRow, endCol] = movesBot[i];
                    // Faz uma cópia temporária do tabuleiro
                    const boardCopy = JSON.parse(JSON.stringify(board.board));
        
                    // Simula a jogada do bot
                    boardCopy[endRow][endCol] = this.bot_piece;
                    boardCopy[startRow][startCol] = 0;
                    // imprime o tabuleiro
                    for (let i = 0; i < 6; i++) {
                        console.log(boardCopy[i][0] + " " + boardCopy[i][1] + " " + boardCopy[i][2] + " " + boardCopy[i][3] + " " + boardCopy[i][4]);
                    }
                    // Verifica se essa jogada resulta em uma linha de 3 para o bot
                    if (board.possible_remove2(endRow, endCol, this.bot_piece, boardCopy)) {
                        winningMoves.push(movesBot[i]);
                    }
                }
        
                if (winningMoves.length > 0) {
                    // Se houver jogadas vencedoras, escolha uma delas
                    const randomIndex = Math.floor(Math.random() * winningMoves.length);
                    randomMove = winningMoves[randomIndex]; // Atribua randomMove aqui
                    // Realiza a jogada vencedora
                    this.handlePieceSelection(randomMove[0], randomMove[1]);
                    this.handlePieceMovement(randomMove[2], randomMove[3]);
                } else {
                    // Caso contrário, escolha uma jogada aleatória
                    const randomIndex = Math.floor(Math.random() * movesBot.length);
                    randomMove = movesBot[randomIndex]; // Atribua randomMove aqui
        
                    // Realiza a jogada aleatória
                    this.handlePieceSelection(randomMove[0], randomMove[1]);
                    this.handlePieceMovement(randomMove[2], randomMove[3]);
                }
        
                if (board.possible_remove(randomMove[2], randomMove[3], this.bot_piece)) {
                    const piecesToRemove = board.getPlayerCells(this.player_piece);
                    const randomIndex = Math.floor(Math.random() * piecesToRemove.length);
                    const randomCell = piecesToRemove[randomIndex];
                    this.handleRemovePiece(randomCell.row, randomCell.col, this.bot_piece);
                    moveDisplay.style.display = 'block';
                    removeDisplay.style.display = 'none';
                    this.possible_win();
                }
            }
        }


        makeBotMoveH() {
            // Move do Bot dificuldade difícil
            if (this.putPhase) {
                const availableCells = board.getAvailableCells(); // Função para obter células disponíveis
                if (availableCells.length > 0) {
                    const randomIndex = Math.floor(Math.random() * availableCells.length);
                    const randomCell = availableCells[randomIndex];
                    console.log("randomCell: " + randomCell.row + " " + randomCell.col);
                    // Simula o clique na célula escolhida pelo bot
                    this.handlePlacementPhase(randomCell.row, randomCell.col);
                }
            } else {
                const movesBot = board.moves_available(this.bot_piece);
                const winningMoves = [];
                let randomMove; // Defina randomMove antes do uso
                
                for (let i = 0; i < movesBot.length; i++) {
                    console.log("i: " + i + " movesBot: " + movesBot[i]);
                    const [startRow, startCol, endRow, endCol] = movesBot[i];
                    // Faça uma cópia temporária do tabuleiro
                    const boardCopy = JSON.parse(JSON.stringify(board.board));
        
                    // Simule a jogada do bot
                    boardCopy[endRow][endCol] = this.bot_piece;
                    boardCopy[startRow][startCol] = 0;
                    // imprime o tabuleiro
                    for (let i = 0; i < 6; i++) {
                        console.log(boardCopy[i][0] + " " + boardCopy[i][1] + " " + boardCopy[i][2] + " " + boardCopy[i][3] + " " + boardCopy[i][4]);
                    }
                    // Verifique se essa jogada resulta em uma linha de 3 para o bot
                    if (board.possible_remove2(endRow, endCol, this.bot_piece, boardCopy)) {
                        winningMoves.push(movesBot[i]);
                        console.log("Move de 3 : " + winningMoves[i]);
                    }
                }
        
                if (winningMoves.length > 0) {
                    // Se houver jogadas vencedoras, escolha uma delas
                    const randomIndex = Math.floor(Math.random() * winningMoves.length);
                    randomMove = winningMoves[randomIndex]; // Atribua randomMove aqui
                    // Realize a jogada vencedora
                    this.handlePieceSelection(randomMove[0], randomMove[1]);
                    this.handlePieceMovement(randomMove[2], randomMove[3]);
                } else {
                    // Caso contrário, escolha uma jogada aleatória
                    const randomIndex = Math.floor(Math.random() * movesBot.length);
                    randomMove = movesBot[randomIndex];
                    this.handlePieceSelection(randomMove[0], randomMove[1]);
                    this.handlePieceMovement(randomMove[2], randomMove[3]);
                }
        
                // Verifique se é possível remover uma peça
                if (board.possible_remove(randomMove[2], randomMove[3], this.bot_piece)) {
                    // Encontre uma peça branca que pertença a uma linhaS de 2 e a remova
                    
                    const piecesToRemove = board.removeLineof2(board.board, this.player_piece);
                    console.log("piecesToRemove: " + piecesToRemove.i + " " + piecesToRemove.j);
    
                    if (piecesToRemove !== -1) {
                        console.log("isoooooo"+ this.bot_piece);
                        this.handleRemovePiece(piecesToRemove.i, piecesToRemove.j, this.bot_piece);
                        moveDisplay.style.display = 'block';
                        removeDisplay.style.display = 'none';
                        this.possible_win();
                    }else{
                        // Se não houver peças brancas que pertençam a uma linha de 2, remova uma peça branca aleatória
                        const piecesToRemove = board.getPlayerCells(this.player_piece);
                        const randomIndex = Math.floor(Math.random() * piecesToRemove.length);
                        const randomCell = piecesToRemove[randomIndex];
                        this.handleRemovePiece(randomCell.row, randomCell.col, this.bot_piece);
                        moveDisplay.style.display = 'block';
                        removeDisplay.style.display = 'none';
                        this.possible_win();
                    }
                }
            }
        }

        performOnlineMove() {

        }

        possible_win(){
            // Verifica se há um possível vencedor
            let winner = 0;
            this.moves_available_1 = board.moves_available('1');
            this.moves_available_1 = board.moves_available('2');
            if (board.finalBpieces <= 2 ||  this.moves_available_1.length == 0){
                winner = '1';
                this.game_finished(winner);
                return winner;
            }
            else if (board.finalWpieces <= 2 || this.moves_available_1.length == 0){
                winner = '2';
                this.game_finished(winner);
                return winner;
            }
            else{
                return 0;
            }
        }

        game_finished(winner) {
            // Função para lidar com o fim do jogo
            let win_text = document.getElementById("game-result");
            if (winner === '1') {
                win_text.innerText = "Ganhou o Branco!";

            } else {

                win_text.innerText = "Ganhou o Preto!";
            }
        moveDisplay.style.display = 'none';
        removeDisplay.style.display = 'none';
        playerput.style.display = 'none';


            if (this.bot === true) {

                if (winner === game.player_piece) {
                    user.victories++;
                } else {
                    user.loses++;
                }
        
                //this.updateLeaderboard(user);
                
            }

            this.isGameActive = false;
        }

        generateBoard() {
            // Função para gerar o tabuleiro com base no tamanho selecionado
            game.isGameActive = true;
            
            game.putPhase = true;
            if (boardSize === 5) {
                this.generate_tiles(6,5); 
            } else if (boardSize === 6) {          
                this.generate_tiles(6,6);
            }
        }

        generate_tiles(numRows, numCols) {
            // Função para gerar as células do tabuleiro
            gameContainer.innerHTML = '';
                board = new Board(numRows, numCols);
                for (let row = 0; row < numRows; row++) {
                    for (let col = 0; col < numCols; col++) {
                        const cell = document.createElement('div');
                        cell.classList.add('cell');
                        cell.dataset.row = row;
                        cell.dataset.col = col;
                        cell.addEventListener('click', () => game.handleCellClick(row, col));
                        gameContainer.appendChild(cell);
                        putDisplay.style.display = 'block';
                    }
                }
        }

        /*updateLeaderboard(user) {
            // Função para atualizar a tabela de classificação
            const leaderboardTable = document.getElementById('leaderboard-table');
            let existingRow;
        
            // Verifica se o nome do utilizador já está na tabela de classificação
            for (let i = 1; i < leaderboardTable.rows.length; i++) {
                const row = leaderboardTable.rows[i];
                const nameCell = row.cells[1];
                if (nameCell.textContent === user.username) {
                    existingRow = row;
                    break;
                }
            }
        
            if (existingRow) {
                // Se o nome do utilizador já estiver na tabela, atualiza as células de vitórias, derrotas e total de jogos
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
        }*/

    };
    
    


//Para em vez de aparecer 1 ou 2 aparecer branco ou preto no html
const playerNames = {
    '1': 'Branco',
    '2': 'Preto'
};


let boardSize = boardSizeSelect.value;
let user;
let board;
let game;
let IsOnlineGame = 0; // Só para o alerta aparecer uma vez

// Event listener para o botão "Iniciar Jogo"
startGameButton.addEventListener('click', async () => {
    game = new Game();
    sideBoard1.style.display = 'grid';
    sideBoard2.style.display = 'grid';
    boardSize = parseInt(boardSizeSelect.value);
    gameContainer.style.gridTemplateColumns = `repeat(${boardSize}, 50px)`; // Ajusta o número de colunas
    game.generateBoard(); // meti aqui por agora para criar o board para dar como parametro ao update
    board.updateSideBoards();
    putDisplay.style.display = 'none';

    if (opponentSelect.value === 'online') {
        playerput.style.display = 'none';
        playerputonline.style.display = 'block';
        game.isGameActive = false;
        game.bot = false;
        game.online = true;
        const group = 4;
        const new_cols = parseInt(boardSize);
        const new_rows = 6;
        const size = { rows: new_rows, columns: new_cols };

    try {

        await join(group,user.username , user.password, size, game);
        // The `game.game_id` should be set now
        await new Promise(resolve => setTimeout(resolve, 600));

        // Agora, game.game_id deve ser definido corretamente
        await update(game.game_id, user.username, IsOnlineGame, game, board);
        
        // Other code here

    } catch (error) {
        console.error("Error joining or updating the game:", error.message);
        return; // If there is an error, don't proceed with the rest of the code
    }

    }
    else{
        game.bot = false;
        game.online = false;
        putDisplay.style.display = 'block';
        playerput.style.display = 'block';
    }
    

    if (firstPlayerSelect.value === 'branco') {
        game.player1 = '1';

    } else if (firstPlayerSelect.value === 'preto'){
        game.player1 = '2';
    }

    if (colorSelect.value === 'branco'){
        game.bot_piece = '2';
        game.player_piece = '1';
    } else if (colorSelect.value === 'preto'){
        game.bot_piece = '1';
        game.player_piece = '2';
    }

    game.currentPlayer = game.player1;
    currentPlayerDisplay.textContent = playerNames[game.currentPlayer];
    gameResultDisplay.textContent = '';
    if(!game.online)game.isGameActive = true;

    //verifca se o outro jogador é o bot
    if (opponentSelect.value === 'computer') {
        game.bot = true;
        if (level.value === 'easy') {
            if (game.player1 === game.bot_piece) {
                game.makeBotMove();
                game.bot_can_play = true;
            }
        }else if (level.value === 'medium') {
            if (game.player1 === game.bot_piece) {
                game.makeBotMoveM();
                game.bot_can_play = true; 
            }
        }else{
            if (game.player1 === game.bot_piece) {
                game.makeBotMoveH();
                game.bot_can_play = true; 
            }
        }
        
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

    if (game.isGameActive && game.bot === true) {
        user.loses += 2;
    }

    if (game.online === true){
        leave(game.game_id, user.username, user.password);
    }
    game.isGameActive = false;
    playerputonline.style.display = 'none';
    //game.updateLeaderboard(user);

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

    
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
    
        (async () => {
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
    
            const registrationSuccess = await clickRegister(username, password);
    
            if (registrationSuccess) {
                // Registration successful, you can now handle the login logic
                hiddenSection.style.display = 'none';
                loginSection.style.display = 'none';
                mainSection.style.display = 'block';
                logoutButton.style.display = 'block';
                leaderboardSection.style.display = 'none';
    
                user = new User(username,password, 0, 0, 0);
    
                // For example, you might want to use the same function for login
                const loginSuccess = await clickRegister(username, password);
    
                if (loginSuccess) {
                    console.log("Login successful");
                    hiddenSection.style.display = 'none';
                    loginSection.style.display = 'none';
                    mainSection.style.display = 'block';
                    logoutButton.style.display = 'block';
                    leaderboardSection.style.display = 'none';
    
                    user = new User(username,password, 0, 0, 0);
                } else {
                    console.log("Login failed");
                    // Handle login failure
                }
            } else {
                console.log("Registration failed");
                // Handle registration failure
            }
        })();
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
    const leaderboardBoard = document.getElementById("board_ranking").value;
    console.log(leaderboardBoard);
    new_leaderboard(6,5);

});

const rankingSelect = document.querySelector('#board_ranking');

rankingSelect.addEventListener('change', event => {
    event.preventDefault(); // Prevent the default behavior of triggering the change event again in the next repaint cycle

    const selectedOption = document.getElementById('board_ranking').value;
    const leaderboardSize = parseInt(selectedOption);
    console.log(leaderboardSize);
    new_leaderboard(6, leaderboardSize);
});

const clickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
});


function new_leaderboard(row, col) {
    const size = { rows: row, columns: col };
    ranking(4, size);
}


});


