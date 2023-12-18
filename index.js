class User {
    constructor(username, password,totalGames, victories, loses) {
        this.username = username;
        this.password = password;
        this.totalGames = totalGames;
        this.victories = victories ;
        this.loses = loses;
        this.totalGames = this.victories + this.loses;
    }
}

//classe do board
class Board{
    constructor(numRows, numCols, gameInstance){
        this.game = gameInstance;
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
                if (this.possible_play(row, col, this.game.currentPlayer, boardCopy,0,0)) {
                    availableCells.push({ row, col });
                }
            }
        }
        return availableCells;
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
        if (String(this.board[i][j]) === String(Player)) {
            console.log("certo")
            return true;
        }
        console.log("errado")
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

        if (!this.game.putPhase) {
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
                if (!this.game.putPhase) {
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
                if (!this.game.putPhase) {
                    board_layout[rowSel][colSel] = Player; // Tirar a peça da posição anterior
                }

                return false;
            }
        }
    
        if (!this.game.putPhase) {
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
                        if (this.possible_play(i - 1, j, Player, boardCopy, new_rowSelected, new_colSelected) && this.possible_move(i - 1, j, i, j) && this.go_back(i - 1, j, i, j, Player)) {
                            movesAvailable.push([i, j, i - 1, j]);
                        }
                    }
                    if (i < boardCopy.length - 1) {
                        if (this.possible_play(i + 1, j, Player, boardCopy, new_rowSelected, new_colSelected) && this.possible_move(i + 1, j, i, j) && this.go_back(i + 1, j, i, j, Player)) {
                            movesAvailable.push([i, j, i + 1, j]);
                        }
                    }
                    if (j > 0) {
                        if (this.possible_play(i, j - 1, Player, boardCopy, new_rowSelected, new_colSelected) && this.possible_move(i, j - 1, i, j) && this.go_back(i, j - 1, i, j, Player)) {
                            movesAvailable.push([i, j, i, j - 1]);
                        }
                    }
                    if (j < boardCopy[0].length - 1) {
                        if (this.possible_play(i, j + 1, Player, boardCopy, new_rowSelected, new_colSelected) && this.possible_move(i, j + 1, i, j) && this.go_back(i, j + 1, i, j, Player)) {
                            movesAvailable.push([i, j, i, j + 1]);
                        }
                    }
                }
            }
        }
        return movesAvailable;
    }
}


// Classe do jogo

class Game {

    constructor(size,rows,columns,game_id,player_1_nick,player_2_nick){
        this.size = size;
        this.game_id = game_id;
        this.player_colors = {[player_1_nick]:'white'};
        this.player_1 = player_1_nick;
        this.players = {'player 1': player_1_nick, 'player 2': this.player_2_nick};
		this.rows = rows;
		this.columns = columns;
		this.startingPlayer=1;
		this.PieceSelected = false; 
		this.canRemove = false; 
		this.rselected;
		this.cselected;
		this.match_history = [];
		this.players_stats = {};
        this.board = new Board(this.rows,this.columns, this);
        this.winner = 0;
        this.putPhase = true;
        this.currentPlayer = 1;
        this.moves_available_1 = [];
        this.moves_available_2 = [];
        this.queryrow = 3;
        this.querycol = 3;
        this.moved_piece = false;
        this.ver = 0;
        this.last_move = {};
    }

    handleGame(row, col, nick) {
        // Controla o fluxo do jogo
        if (this.putPhase) {
            let move = this.handlePlacementPhase(row, col, nick);
            if (!move) return false;
        } else {
            
            this.winner =this.possible_win();
            if (!this.PieceSelected && this.ver == 0) {
                let correctselection = this.handlePieceSelection(row, col);

                if (correctselection) {
                    this.PieceSelected = true;
                    this.last_move[nick] = [row, col];
                }

                if (!correctselection) return false;
            } else {
                if (!this.moved_piece) {
                    if (row == this.last_move[nick][0] && col == this.last_move[nick][1]) {
                        this.PieceSelected = false;
                        return true;
                    }

                    let correctmove = this.handlePieceMovement(row, col);
                    if (correctmove) {
                        this.PieceSelected = false;
                        this.moved_piece = true;
                    }

                    if (!correctmove) return false;

                }
            }
    
            if (this.moved_piece) {
                if (this.canRemove) {

                    let moveremove = this.handleRemovePiece(row, col, this.currentPlayer);
                    if (moveremove) this.canRemove = false;
                    if (!moveremove) return false;
                    this.ver = 0;
                    this.winner =this.possible_win();
                    this.currentPlayer = this.currentPlayer === '1' ? '2' : '1';
                    return true;
                } else {
                    if (this.board.possible_remove(row, col, this.currentPlayer)) {
                        this.canRemove = true;
                        this.rselected = row;
                        this.cselected = col;
                        this.ver = 1;
                        return true;
                    } else {
                        this.canRemove = false;
                        this.pieceSelected = false;
                        this.moved_piece = false;
                        this.currentPlayer = this.currentPlayer === '1' ? '2' : '1';
                        return true;
                    }
                }
            }
        }
        return true;
    }
    
    
    


    handlePlacementPhase(row, col, nick) {
        // Função para lidar com a fase de colocação
        let currentPlayer;
        if (this.players['player 1'] === nick) {
            currentPlayer = '1';
            this.currentPlayer = '1';
        } else {
            currentPlayer = '2';
            this.currentPlayer = '2';
        }
    
        let canPlacePiece = this.board.possible_play(row, col, currentPlayer, this.board.board, 0, 0);
        if (canPlacePiece) {
            if (this.currentPlayer == '1' && this.board.playerWpieces > 0) {
                this.board.playerWpieces--;
            } else if (this.currentPlayer == '2' && this.board.playerBpieces > 0) {
                this.board.playerBpieces--;
            }
    
            this.currentPlayer = this.currentPlayer === '1' ? '2' : '1';
        } else {
            console.log('Jogada Inválida');
            return false;
        }
    
        console.log('Peças restantes - Jogador 1:', this.board.playerWpieces, 'Jogador 2:', this.board.playerBpieces);
    
        if (this.board.playerBpieces === 0 && this.board.playerWpieces === 0) {
            this.putPhase = false;
            console.log('Já colocou todas as peças permitidas durante a fase de colocação.');
            if (this.player_1 === '2') {
                this.currentPlayer = '2'; // jogador preto
            } else {
                this.currentPlayer = '1'; // jogador branco
            }
        }
        return true;
    }
    

    handlePieceSelection(row, col) {
        // Função para lidar com a seleção de peças
        console.log(this.currentPlayer);
        if (this.board.possible_click(row, col, this.currentPlayer)) {
            if (this.canRemove) {
                console.log("Não podes selecionar uma peça porque já removes-te uma peça");
                return false;
            }
    
            this.rowSelected = row;
            this.colSelected = col;
            this.pieceSelected = true;
    
            console.log('Peça selecionada');
            console.log('Peça selecionada - Linha:', this.rowSelected, 'Coluna:', this.colSelected);

        } else {
            console.log('Peça não pode ser selecionada');
            return false;
        }
        return true;
    }


    handlePieceMovement(row, col) {
        // Função para lidar com o movimento de peças
        // Verifique se a célula clicada é válida para mover a peça selecionada
        if (this.board.possible_play(row, col, this.currentPlayer, this.board.board,this.rowSelected,this.colSelected) && this.board.possible_move(row, col, this.rowSelected, this.colSelected) && this.board.go_back(row, col, this.rowSelected, this.colSelected, this.currentPlayer)) {
            this.board.board[row][col] = this.currentPlayer;
            this.board.board[this.rowSelected][this.colSelected] = 0; // Tirar a peça da posição anterior

            if (this.currentPlayer == '1') {
                this.board.LastPlay1.row = this.rowSelected;
                this.board.LastPlay1.col = this.colSelected;
                this.board.LastPlay1.rowSelected = row;
                this.board.LastPlay1.colSelected = col;
                //console.log("LastPlay1: " + board.LastPlay1.row + " " + board.LastPlay1.col + " " + board.LastPlay1.rowSelected + " " + board.LastPlay1.colSelected);
            } else {
                this.board.LastPlay2.row = this.rowSelected;
                this.board.LastPlay2.col = this.colSelected;
                this.board.LastPlay2.rowSelected = row;
                this.board.LastPlay2.colSelected = col;
                //console.log("LastPlay2: " + board.LastPlay2.row + " " + board.LastPlay2.col + " " + board.LastPlay2.rowSelected + " " + board.LastPlay2.colSelected);
            }

            this.pieceSelected = false;
            this.currentPlayer_copy = this.currentPlayer;
            console.log('Peça movida '+ this.currentPlayer);
            console.log('Peça movida '+ this.currentPlayer);
            this.moved_piece = true;
            return true;
        }
        return false
    }


    handleRemovePiece(row, col, Player) {
        // Função para lidar com a remoção de peças
        let correct_choice = false;
    
        if (Player == '1') {
            if (this.board.board[row][col] == '2') {
                correct_choice = true;
            }
        } else {
            if (this.board.board[row][col] == '1') {
                correct_choice = true;
            }
        }
    
        if (correct_choice) {
            this.board.board[row][col] = 0;
    
            if (Player == '1') {
                this.board.finalBpieces--;
            } else {
                this.board.finalWpieces--;
            }


            //console.log("You cannot remove a piece - joagdor ativo" + currentPlayer );
            this.moved_piece = false;
            this.pieceSelected = false;
            this.canRemove = false;
    
        }
        return correct_choice;
    }
        

    possible_win(){
        // Verifica se há um possível vencedor
        let winner = 0;
        this.moves_available_1 = this.board.moves_available('1');
        this.moves_available_2 = this.board.moves_available('2');
        if (this.board.finalBpieces <= 2 ||  this.moves_available_2.length == 0){
            winner = '1';
            console.log('white wins');
            return winner;
        }
        else if (this.board.finalWpieces <= 2 || this.moves_available_1.length == 0){
            winner = '2';
            console.log('black wins');
            return winner;
        }
        else{
            return 0;
        }
    }

    giveUp(nick){
        let player;
        if (this.players['player 1'] == nick) player=1;
        else player = 2;
		this.winner = 3-player;
	}


    join_p2(nick){
        this.players['player 2']=nick;
        this.player_colors[[nick]]='black';
        this.player_2 = nick;
        console.log(nick);
    }

    updateGame() {
        // contrói a resposta
        let json = {};

        
        if (this.winner !== 0) {
            json['winner'] = this.players['player ' + this.winner];
            console.log(this.players['player ' + this.winner]);
            let board_json = copy_2darray(this.board.board);
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.columns; j++) {
                    if (board_json[i][j] == 0) {
                        board_json[i][j] = 'empty';
                    } else if (board_json[i][j] == 1) {
                        board_json[i][j] = 'white';
                    } else if (board_json[i][j] == 2) {
                        board_json[i][j] = 'black';
                    }
                }
            }
            json['board'] = board_json;
            return json;
        }
    
        console.log(this.player_colors);
        console.log("current player: " + this.currentPlayer);  
        json['turn'] = this.players['player '+ this.currentPlayer]; 
        if (this.putPhase) {
            json['phase'] = 'drop';
        } else {
            json['phase'] = 'move';
        }
        console.log('pieceselected to updategame ' + this.PieceSelected);
        if (this.PieceSelected) {
            
            json['step'] = 'to';
            const sendmove = {row: this.queryrow, column: this.querycol};
            json['move'] = sendmove;

        } else if (this.canRemove) {
            json['step'] = 'take';
            const sendmove = {row: this.queryrow, column: this.querycol};
            json['move'] = sendmove;
        }    
        
        else {
            const sendmove = {row: this.queryrow, column: this.querycol};
            json['move'] = sendmove;
            json['step'] = 'from';
        }
    

        json['players'] = this.player_colors; 
        console.log(this.players);
        let board_json = copy_2darray(this.board.board);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                if (board_json[i][j] == 0) {
                    board_json[i][j] = 'empty';
                } else if (board_json[i][j] == 1) {
                    board_json[i][j] = 'white';
                } else if (board_json[i][j] == 2) {
                    board_json[i][j] = 'black';
                }
            }
        }
        json['board'] = board_json;
        return json;
    }
    
}

function copy_2darray(array) {
	let copy = [];
	for (let i = 0; i < array.length; i++) {
		copy[i] = array[i].slice();
	}
	return copy;
}


const http = require('http');
const url  = require('url');
const crypto = require('crypto');
const { send } = require('process');
const fs = require('fs');
const usersFilePath = 'users.json';
var HeadersCORS = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': 'content-type, accept',
    'access-control-max-age': 10 
};
var HeadersSSE = {    
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
    'Connection': 'keep-alive'
};
let logins = {};
let rankings = readRankingFromFile();
let games = {};
let waiting_for_game = {};
let update_responses = {};
let game_counter = 1;

function remember(response,game){
    if (game in update_responses){
        update_responses[game].push(response);
    }
    else{update_responses[game] = [response];}
}

function forget(response, game){
    let pos = update_responses[game].findIndex((resp) => resp === response);
    if (pos>-1){
        update_responses[game].slice(pos,1);
    }
}

function broadcast(body, game){
    console.log(body);
    for (let response of update_responses[game]){
        response.write('data: '+ JSON.stringify(body) +'\n\n');

    }
}


function readLoginsFromFile() {
    try {
        const data = fs.readFileSync('users.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        
        return {};
    }
}


function readRankingFromFile() {
    try {
        const data = fs.readFileSync('ranking.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        
        return {};
    }
}

function writeLoginsToFile(logins) {
    const data = JSON.stringify(logins, null, 2);
    fs.writeFileSync('users.json', data, 'utf8');
}


const server = http.createServer(function (request, response) {
    
    const parsedUrl = url.parse(request.url,true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query; 

    console.log(request.method);
    console.log(pathname);
    switch(request.method){
        case 'GET':
            response.writeHead(200,HeadersSSE);
            switch(pathname){
                case '/update':
                    let game = query.game;
                    remember(response,game);
                    request.on('close', () =>  {forget(response,game)} );
                    setImmediate(() =>{
                        broadcast({},game);
                    }); 
                break;
            }
            break;
        case 'OPTIONS':
            response.writeHead(200, HeadersCORS);
            response.end();
            break;

        case 'POST':
            
            let body = '';
            switch (pathname) {
                
                case '/register':
                    // gere register
                    request
                        .on('data', (chunk) => { body += chunk; })
                        .on('end', () => {
                            try {
                                let query = JSON.parse(body);
                                let nick = query.nick;
                                let password = query.password;
                                console.log(nick);
                                console.log(password);

                                // Verificar se tanto o nome de usuário quanto a pass estão presentes
                                if (!nick || !password) {
                                    response.writeHead(400, {
                                        'Content-Type': 'application/json',
                                        'Access-Control-Allow-Origin': '*',
                                    });
                                    response.end(JSON.stringify({ message: 'Username and password are required' }));
                                    return;
                                }

                            
                                const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

                                
                                const logins = readLoginsFromFile();

                                
                                if (logins[nick]) {
                                    
                                    if (logins[nick].hashedPassword === hashedPassword) {
                                        
                                        console.log("deu")
                                        response.writeHead(200, {
                                            'Content-Type': 'application/json',
                                            'Access-Control-Allow-Origin': '*',
                                        });
                                        response.write(JSON.stringify({ message: 'Login successful bvhbugyhguiygu' }));
                                        response.end();

                                    } else {
                                        
                                        response.writeHead(401, {
                                            'Content-Type': 'application/json',
                                            'Access-Control-Allow-Origin': '*',
                                        });
                                        response.end(JSON.stringify({ message: 'Registration Failed' }));
                                    }
                                } else {
                                    
                                    logins[nick] = { hashedPassword };

                                    
                                    writeLoginsToFile(logins);

                                    response.writeHead(200, {
                                        'Content-Type': 'application/json',
                                        'Access-Control-Allow-Origin': '*',
                                    });
                                    response.end(JSON.stringify({ message: 'Registration successful' }));
                                }
                            } catch (error) {
                                
                                response.writeHead(400, {
                                    'Content-Type': 'application/json',
                                    'Access-Control-Allow-Origin': '*',
                                });
                                response.end(JSON.stringify({ message: 'Invalid JSON format' }));
                            }
                        });
                    break;

                    
                case "/join":
                    // gere join
                    handleJoinRequest(request, response);
                    break;

                case "/leave":
                    // gere leave                
                    request
                        .on('data', (chunk) => {
                            body += chunk;
                        })
                        .on('end', () => {
                            try {
                                const data = JSON.parse(body);
                                const { nick, password, game: game_id } = data;
                
                                response.writeHead(200, HeadersCORS);
                                response.write(JSON.stringify({}));
                                response.end();
                
                                const game = games[game_id];
                
                                if (waiting_for_game[game.size].length > 0 && waiting_for_game[game.size][0].nick === nick) {
                                    
                                    waiting_for_game[game.size].pop();
                                    broadcast({ winner: null }, game_id);
                                    delete games[game_id];
                                    return;
                                }
                
                                game.giveUp(nick);
                
                                const winner = nick === game.player_1 ? game.player_2 : game.player_1;
                                const aj = JSON.parse(game.size);
                                const sizeString = JSON.stringify(aj);
                                console.log(sizeString);
                
                                
                
                                for (const player of rankings[sizeString]['ranking']) {
                                    if (player.nick === winner) {
                                        player.victories++;
                                    }
                                }
                
                                broadcast(game.updateGame(), game_id);
                                delete games[game_id];
                            } catch (err) {
                                console.error(err);
                            }
                        });
                    break;
                    
                case "/notify":
                    // gere notify
                    request
                        .on('data', (chunk) => {body += chunk;  })
                        .on('end', () => {
                            try{
                                let query = JSON.parse(body); 
                                let nick = query.nick;
                                console.log('nick' + nick);
                                let game_id = query.game;
                                console.log('turn' + games[game_id].players['player ' + games[game_id].currentPlayer]);
                                let turn = games[game_id].players['player ' + games[game_id].currentPlayer]
                                let move = query.move;
                                games[game_id].queryrow = parseInt(move.row);
                                console.log(games[game_id].queryrow);
                                games[game_id].querycol = parseInt(move.column);
                                console.log(games[game_id].querycol);
                                console.log('selected ' + games[game_id].PieceSelected);
                            

                                let error = true;
                                if (turn == nick){
                                    error = games[game_id].handleGame(games[game_id].queryrow,games[game_id].querycol,nick);
                                    console.log(games[game_id].board.board);
                                }
                                
                                if (!error){
                                    
                                    response.writeHead(200,HeadersCORS);
                                    response.write(JSON.stringify({'error':error}));
                                    response.end();
                                    return;
                                }
                    
                                response.writeHead(200,HeadersCORS);
                                response.write(JSON.stringify({}));
                                response.end();
                                broadcast(games[game_id].updateGame(), game_id);
                                const sizeString = games[game_id].size;
                                if (games[game_id].winner != 0){
                                    let winner;

                                    if(games[game_id].winner==1) winner = games[game_id].player_1;
                                    else winner = games[game_id].player_2;

                                    for (var player in rankings[sizeString]['ranking']){
                                        if (player.nick==winner){player['victories']++;}
                                    }
                                    delete games[game_id];
                                }
                                return;
                            }
                            catch(err){console.log(err);}
                        })
                    break;
                    
                case "/ranking":
                    // Mostrar top 5 de jogadores por ordem decrescente de vitórias
                    request
                        .on('data', (chunk) => {body += chunk;  })
                        .on('end', () =>{
                            try{
                                let query = JSON.parse(body);  
                                let size = query.size;
                                let sizeString = JSON.stringify(size);
                                
                                rankings[sizeString]['ranking'].sort(function(p1, p2){return p2['victories'] - p1['victories']});
                                let top5 = Math.min(5,rankings[sizeString]['ranking'].length);
                                let list = rankings[sizeString]['ranking'].slice(0,top5);

                                response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8','Access-Control-Allow-Origin': '*'});
                                response.write(JSON.stringify({'ranking':list}));
                                response.end();
                                writeRankingsToFile();
                            }
                            catch(err){console.log(err);}
                        })
                        break;
            }
            break;
            
    }
});

function handleJoinRequest(request, response) {
    // Funçao que controla o join
    let body = '';

    request
        .on('data', (chunk) => { body += chunk; })
        .on('end', () => {
            try {
                const { nick, password, size } = JSON.parse(body);
                const sizeString = JSON.stringify(size);

                if (sizeString in waiting_for_game && waiting_for_game[sizeString].length > 0) {
                    handleExistingGame(response, nick, size, sizeString);
                } else {
                    handleNewGame(response, nick, size, sizeString);
                }
            } catch (error) {
                console.log(error);
                // Erro
                response.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
                response.end(JSON.stringify({ message: 'Invalid JSON format' }));
            }
        });
    }

function handleExistingGame(response, nick, size, sizeString) {
    // Junta-se a um jogo existente
    const waiter = waiting_for_game[sizeString].pop();
    const game_id = waiter.game;
    const player_1 = waiter.nick;

    console.log(`Created a game with players ${player_1} and ${nick} with ID: ${game_id}`);

    response.writeHead(200, HeadersCORS);
    response.write(JSON.stringify({ game: game_id }));
    response.end();

    const game = games[game_id];
    game.join_p2(nick);
    setTimeout(() => broadcast(game.updateGame(), game_id), 1000);

    updateRankings(sizeString, player_1, nick);
}

function handleNewGame(response, nick, size, sizeString) {
    // Cria um novo jogo
    console.log("Waiting queue");

    let game_id = `game_number_${game_counter++}`;
    game_id = crypto.createHash('md5').update(game_id).digest('hex');;
    console.log('game_id: ' + game_id)

    waiting_for_game[sizeString] = [{ game: game_id, nick: nick }];
    

    const new_game = new Game(sizeString, size.rows, size.columns, game_id, nick);
    games[game_id] = new_game;

    response.writeHead(200, HeadersCORS);
    response.write(JSON.stringify({ game: game_id }));
    response.end();
}

function updateRankings(sizeString, player_1, player_2) {
    const playersToUpdate = [player_1, player_2];
    console.log(sizeString);

    if (!(sizeString in rankings)) {
        rankings[sizeString] = { 'ranking': [] };
    }

    for (const nick of playersToUpdate) {
        console.log('nick' + nick);

        // Verifica se o utilizador já está no ranking
        const userInRanking = rankings[sizeString]['ranking'].some((player) => player.nick === nick);

        if (!userInRanking) {
            // Adiciona o novo utilizador ao ranking
            rankings[sizeString]['ranking'].push({ 'nick': nick, 'victories': 0, 'games': 0 });
        }
    }

    for (const player of rankings[sizeString]['ranking']) {
        if (playersToUpdate.includes(player.nick)) {
            player['games']++;
        }
    }

    console.log('RANKINGS TABELA');
    console.log(rankings[sizeString]);
}

function writeRankingsToFile() {
    // Escrever rankings no ficheiro
    try {
        const data = JSON.stringify(rankings, null, 2);
        fs.writeFileSync('ranking.json', data, 'utf8');
    } catch (error) {
        console.error('Error writing ranking to file:', error);
    }
}


server.listen(8009);