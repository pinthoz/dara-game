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
		this.selected = false; 
		this.remove = false; 
		this.rselected;
		this.cselected;
		this.match_history = [];
		this.players_stats = {};
        this.board = new Board(this.rows,this.columns);
        this.winner = 0;
        this.putPhase = true;
        this.currentPlayer = 1;
        this.moves_available_1 = [];
        this.moves_available_2 = [];
    }


    handlePlacementPhase(row, col, nick) {
        // Função para lidar com a fase de colocação
        let currentPlayer;
        if (this.players['player 1'] === nick) {
            currentPlayer = '1';
        } else {
            currentPlayer = '2';
        }
    
        let canPlacePiece = this.board.possible_play(row, col, currentPlayer, this.board.board, 0, 0);
    
        if (canPlacePiece) {
            if (this.currentPlayer === '1' && this.board.playerBpieces > 0) {
                this.board.playerBpieces--;
                return true;
            } else if (this.currentPlayer === '2' && this.board.playerWpieces > 0) {
                this.board.playerWpieces--;
                return true;
            }
    
            this.currentPlayer = this.currentPlayer === '1' ? '2' : '1';
        } else {
            console.log('Jogada Inválida');
            return false;
        }
    
        console.log('Peças restantes - Jogador 1:', this.board.playerBpieces, 'Jogador 2:', this.board.playerWpieces);
    
        if (this.board.playerBpieces === 0 && this.board.playerWpieces === 0) {
            this.putPhase = false;
            console.log('Já colocou todas as peças permitidas durante a fase de colocação.');
            if (this.player_1 === '2') {
                this.currentPlayer = '2'; // jogador preto
            } else {
                this.currentPlayer = '1'; // jogador branco
            }
        }
    }
    

    async handlePieceSelection(row, col) {
        // Função para lidar com a seleção de peças
        console.log(this.currentPlayer);
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

        } else {
            console.log('Peça não pode ser selecionada');
        }
    }


    handlePieceMovement(row, col) {
        // Função para lidar com o movimento de peças
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

            this.pieceSelected = false;
            this.currentPlayer_copy = this.currentPlayer;
            this.currentPlayer = this.currentPlayer === '1' ? '2' : '1';
            this.moved_piece = true;
        
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


            //console.log("You cannot remove a piece - joagdor ativo" + currentPlayer );
            this.moved_piece = false;
            this.pieceSelected = false;
            this.canRemove = false;
    
        }
    }
        

    possible_win(){
        // Verifica se há um possível vencedor
        let winner = 0;
        this.moves_available_1 = board.moves_available('1');
        this.moves_available_1 = board.moves_available('2');
        if (board.finalBpieces <= 2 ||  this.moves_available_1.length == 0){
            winner = '1';
            return winner;
        }
        else if (board.finalWpieces <= 2 || this.moves_available_1.length == 0){
            winner = '2';
            return winner;
        }
        else{
            return 0;
        }
    }


    join_p2(nick){
        this.players['player 2']=nick;
        this.player_colors[[nick]]='black';
        this.player_2 = nick;
        console.log(nick);
    }

    updateGame() {
        let json = {};
        
        if (this.winner !== 0) {
            json['winner'] = this.players['player ' + this.winner];
            let board_json = copy_2darray(this.board);
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
    
        // Corrigindo esta parte
        console.log(this.player_colors);
        console.log("current player: " + this.currentPlayer);  
        json['turn'] = this.players['player '+ this.currentPlayer]; // ou 'player 2' dependendo da lógica do seu jogo
        if (this.putPhase) {
            json['phase'] = 'drop';
        } else {
            json['phase'] = 'move';
        }
        if (this.selected) {
            if (this.remove) {
                json['step'] = 'take';
            } else {
                json['step'] = 'to';
            }
        } else {
            json['step'] = 'from';
        }
    
        // Corrigindo esta parte
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

    
const { log } = require('console');
const http = require('http');
const url  = require('url');
const crypto = require('crypto');

var defaultCorsHeaders = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': 'content-type, accept',
    'access-control-max-age': 10 // Seconds.
};
var sseHeaders = {    
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
    'Connection': 'keep-alive'
};
let logins = {};
let rankings = {'{"rows":6,"columns":5}':{'ranking':[]},'{"rows":6,"columns":6}':{'ranking':[]}};
let games = {};
let waiting = {};
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



const server = http.createServer(function (request, response) {
    
    const parsedUrl = url.parse(request.url,true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query; //JSON object
    //response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    //response.write('Método: '+request.method+'\n');
    //response.write('URL: '+request.url+'\n');
    //response.write(String(pathname)+'\n')
    //response.write(JSON.stringify(query)+'\n')
    //response.end();

    console.log(request.method);
    console.log(pathname);
    switch(request.method){
        case 'GET':
            response.writeHead(200,sseHeaders);
            switch(pathname){
                case '/update':
                    let nick = query.nick;
                    let game = atob(query.game);
                    remember(response,game);
                    request.on('close', () =>  {console.log("fechei o SSE");forget(response,game)} );
                    setImmediate(() =>{
                        broadcast({},game);// isto é o q acontece quando o SSE é iniciado
                    }); 
                break;
            }
            break;
        case 'OPTIONS':
            response.writeHead(200, defaultCorsHeaders);
            response.end();
            break;

        case 'POST':
            let body = '';
            switch (pathname) {
                case '/register':
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
                                // Use MD5 hash for password
                                const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
                                // Check if the user already exists
                                if (logins[nick]) {
                                    // User already exists, check the password
                                    if (logins[nick].hashedPassword === hashedPassword) {
                                        // Password is correct, send success message
                                        console.log("deu")
                                        response.writeHead(200, {
                                            'Content-Type': 'application/json',
                                            'Access-Control-Allow-Origin': '*',
                                        });
                                        response.write(JSON.stringify({ message: 'Login successful bvhbugyhguiygu' }));
                                        response.end();
                                        
                                    } else {
                                        // Password is incorrect, send error message
                                        response.writeHead(401, {
                                            'Content-Type': 'application/json',
                                            'Access-Control-Allow-Origin': '*',
                                        });
                                        response.end(JSON.stringify({ message: 'Registration Failed' }));
                                    }
                                } else {
                                    // User doesn't exist, create a new user
                                    logins[nick] = { hashedPassword };
                                    response.writeHead(200, {
                                        'Content-Type': 'application/json',
                                        'Access-Control-Allow-Origin': '*',
                                    });
                                    response.end(JSON.stringify({ message: 'Registration successful' }));
                                }
                            } catch (error) {
                                // Handle JSON parsing error
                                response.writeHead(400, {
                                    'Content-Type': 'application/json',
                                    'Access-Control-Allow-Origin': '*',
                                });
                                response.end(JSON.stringify({ message: 'Invalid JSON format' }));
                            }
                        });
                    break;


                case "/ranking":
                    request
                        .on('data', (chunk) => {body += chunk;  })
                        .on('end', () =>{
                            try{
                                let dados = JSON.parse(body);  
                                let size = dados.size;
                                let rows = size.rows;
                                let columns = size.columns;
                                let size_string = JSON.stringify(size);
								rankings[size_string]['ranking'].sort(function(a, b){return b['victories'] - a['victories']});
								let max = Math.min(10,rankings[size_string]['ranking'].length);
								let list = rankings[size_string]['ranking'].slice(0,max);
								response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8','Access-Control-Allow-Origin': '*'});
								response.write(JSON.stringify({'ranking':list}));
								response.end();
                            }
                            catch(err){console.log(err);}
                        })
                        break;
                        case "/join":
                            request
                                .on('data', (chunk) => {body += chunk;  })
                                .on('end', () => {
                                    try { 
                                        let dados = JSON.parse(body); 
                                        let nick = dados.nick;
                                        let password = dados.password;
                                        let size = dados.size;
                                        let rows = size.rows;
                                        let columns = size.columns;
                                        let size_string = JSON.stringify(size);
                                        if ((size_string in waiting)){
                                            if (waiting[size_string].length > 0){
                                                let waiter = waiting[size_string].pop();
                                                let game_id = waiter.game;
                                                let player_1 = waiter.nick;
                                                let encoded_game_id = btoa(game_id);
                                                //cria um jogo com player_1 e nick e manda para ambos os players, e começa o, adicionando ao dicionario games um par game_id: game_object
                                                console.log("criei um jogo com os players "+player_1+" e "+nick +"com id: "+game_id + "e hash:" +encoded_game_id);
                                                response.writeHead(200,defaultCorsHeaders);
                                                response.write(JSON.stringify({'game':encoded_game_id}));
                                                response.end();
                                                let game = games[game_id];
                                                game.join_p2(nick);
                                                setTimeout(() => broadcast(game.updateGame(),game_id), 1000); // se for tudo seguido, ele n tem tempo de iniciar o sse e receber o 1º update, assim, ele entra, recebe q o jogo começou, epsra 1 segundo(provavelmente pudemos diminuir isso) e só depois é q recebe o 1º update
                                                /*if (!(size_string in rankings)){
                                                    rankings[size_string] = {'ranking':[]};
                                                    for (var nicks in logins){
                                                        rankings[size_string]['ranking'].push({'nick':nicks,'victories':0,'games':0});
                                                    }
                                                }*/
                                                let found_1 = false;
                                                let found_2 = false;
                                                for (player of rankings[size_string]['ranking']){
                                                    if (player['nick'] == player_1){found_1=true;}
                                                    if (player['nick'] == nick){found_2=true;} 
                                                }
                                                if (!found_1){rankings[size_string]['ranking'].push({'nick':player_1,'victories':0,'games':0});}
                                                if (!found_2){rankings[size_string]['ranking'].push({'nick':nick,'victories':0,'games':0});}
                                                for (var player of rankings[size_string]['ranking']){
                                                    if (player.nick==player_1){player['games']++;}
                                                    if (player.nick==nick){player['games']++;}
                                                }
                                                return;
                                            }
                                            else{
                                                console.log("fila de espera");
                                                let game_id = 'game_number_'+game_counter;
                                                game_counter++;
                                                waiting[size_string].push({'game':game_id, 'nick':nick});
                                                let encoded_game_id = btoa(game_id);
                                                let new_game = new Game(size_string,rows,columns,game_id,nick);
                                                games[game_id] = new_game;
                                                response.writeHead(200,defaultCorsHeaders);
                                                response.write(JSON.stringify({'game':encoded_game_id}));
                                                response.end();
                                                return;
                                                }
                                        }
                                        else{console.log("fila de espera");
                                            let game_id = 'game_number_'+game_counter;
                                            game_counter++;
                                            waiting[size_string] = [{'game':game_id, 'nick':nick}];
                                            let encoded_game_id = btoa(game_id);
                                            let new_game = new Game(size_string,rows,columns,game_id,nick);
                                            games[game_id] = new_game;
                                            response.writeHead(200,defaultCorsHeaders);
                                            response.write(JSON.stringify({'game':encoded_game_id}));
                                            response.end();
                                            return;}
                                    }
                                    catch(err){console.log(err);}
                                })
                            break;
                case "/leave":
                    request
                        .on('data', (chunk) => {body += chunk;  })
                        .on('end', () => {
                            try{
                                let dados = JSON.parse(body); 
                                let nick = dados.nick;
                                let password = dados.password;
                                let game_id = atob(dados.game);
                                if (logins[nick]!=password){response.writeHead(200,defaultCorsHeaders);response.write(JSON.stringify({"error": "User registered with a different password"}));response.end();return;}
                                if (!(game_id in games)){response.writeHead(200,defaultCorsHeaders);response.write(JSON.stringify({"error": "This game is invalid"}));response.end();return;}
                                
                                //terminar o jogo, whatever that means
                                response.writeHead(200,defaultCorsHeaders);
                                response.write(JSON.stringify({}));
                                response.end();
                                let game = games[game_id];
                                if (waiting[game.size].length>0){ // caso saia durante a procura de jogo
                                    if (waiting[game.size][0].nick == nick){
                                        waiting[game.size].pop();
                                        broadcast({'winner':null}, game_id);
										delete games[game_id];
                                        return;
                                    }
                                }
                                game.giveUp(nick);
								let winner;
								if(nick==game.player_1){winner = game.player_2;}
								else{winner = game.player_1;}
								let size_string = game.size;
								console.log(rankings);
								console.log(winner);
								for (var player of rankings[size_string]['ranking']){
									console.log(player);
									if (player['nick']==winner){console.log("hey");player['victories']++;}
								}
								
                                broadcast(game.updateGame(), game_id);
								delete games[game_id];
                                return;
                            }
                            catch(err){console.log(err);}
                        })
                    break;
                case "/notify":
                    request
                        .on('data', (chunk) => {body += chunk;  })
                        .on('end', () => {
                            try{
                                let dados = JSON.parse(body); 
                                let nick = dados.nick;
                                let password = dados.password;
                                let game_id = atob(dados.game);
                                let move = dados.move;
                                let row = parseInt(move.row);
                                let column = parseInt(move.column);
                                let game = games[game_id];
                                let error = game.handlePlacementPhase(row,column,nick);
                                if (error!='valid'){
                                    //manda uma mensagem com o erro
                                    response.writeHead(200,defaultCorsHeaders);
                                    response.write(JSON.stringify({'error':error}));
                                    response.end();
                                    return;
                                }
                                game.Dothis(row,column,nick);
                                response.writeHead(200,defaultCorsHeaders);
                                response.write(JSON.stringify({}));
                                response.end();
                                broadcast(games[game_id].updateGame(), game_id);
								if (games[game_id].board.winner != 0){
									let winner;
									if(game.winner==1){winner = game.player_1;}
									else{winner = game.player_2;}
									for (var player in rankings[size_string]['ranking']){
										if (player.nick==winner){player['victories']++;}
									}
									delete games[game_id];
								}
                                return;
                            }
                            catch(err){console.log(err);}
                        })
                    break;
            }
            break;
            
    }
});

server.listen(8009);