
//const SERVER = "http://twserver.alunos.dcc.fc.up.pt:8008/";
//const SERVER = "http://34.67.217.93:8008/";
const SERVER = "http://localhost:8009/";


//Função para fazer o login/registar
async function registerClient(username, password) {
    let url = SERVER + "register";

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({ nick: username, password: password }),
        });

        if (response.ok) {
            const json = response.body;
            console.log(json);  
            return !("error" in json);
        }
    } catch (error) {
        return false;
    }
}

// Função para fazer o login de acordo com o loginForm (index.html)
async function clickRegister() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    const invalid = document.getElementById("login-error");
    let canRegister = await registerClient(username, password);

    if (canRegister) {
        invalid.style.display = 'none';
        return true;
    } else {
        console.log("Registration failed");
        invalid.style.display = 'block';
        return false;
    }
}

// Função para fazer o join de dois jogadores num game_id
async function join(group, nick, password, size ,game_classe) {
    fetch(SERVER + 'join', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: "application/json",
        },
        body: JSON.stringify({
            group: group,
            nick: nick,
            password: password,
            size: size,
        }),
    })
        .then(response =>response.json())
        .then(data => {
            if (data.error) {
                console.log(size);
                alert(`Error: ${data.error}`);
            } else {
                //Armazenar o game_id
                game_info = data.game;
                game_classe.game_id = game_info;
                console.log(data);
                console.log("Entrada no grupo de jogo com ID " + game_info);
            }
        })
        .catch(error => console.error('Error:', error));
}

// Função para fazer o leave de um jogador de um game_id
function leave(game, nick, password) {
    fetch(SERVER +'leave', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            game: game,
            nick: nick,
            password: password,
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
            } else {
                console.log("Saida do grupo de jogo");
            }
        })
        .catch(error => console.error('Error:', error));
}

// Função para fazer o notify de um jogador de um game_id
async function notify(nick, password, game, move) {
    try {
        const invalid = document.getElementById("invalid_move");
        const response = await fetch(SERVER + 'notify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nick: nick,
                password: password,
                game: game,
                move: move,
            }),
        });
        invalid.style.display = 'none';
        if (!response.ok) {
            const errorObject = await response.json();
            const errorText = errorObject.error;

            // Adiciona a mensagem de erro ao elemento HTML
            invalid.style.display = 'block';
            invalid.innerHTML = errorText;
        }
    } catch (error) {
        console.error('Error during move notification:', error);
    }
}

// Função para fazer o update de um jogador de um game_id
async function update(gameId, nick, IsOnlineGame, game_class, board_class) {
    const queryParams = new URLSearchParams({
        nick: nick,
        game: gameId,
    });

    console.log("update");
    const invalid = document.getElementById("invalid_move");

    const url = `${SERVER}update?${queryParams.toString()}`;
    const source = new EventSource(url);

    const playerputonline = document.getElementById("player-toplay-online");

    source.onmessage = event => {

        try {
            const data = JSON.parse(event.data);

            console.log(data);

            if (data.error) {
                alert(`Error: ${data.error}`);
            }else{
                // Lidar com os displays
                const putDisplay = document.getElementById("place-piece-display");
                const moveDisplay = document.getElementById("move-piece-display");
                const removeDisplay = document.querySelector('#remove-display')
                // Se for a primeira vez dá um alerta
                if (IsOnlineGame===0){
                    const opponentNick = Object.keys(data.players).find(player => player !== nick);
                    alert(`Adversário encontrado: ${opponentNick}`);
                    IsOnlineGame=1;
                    putDisplay.style.display = 'block';
                    game_class.isGameActive = true;
                    canvasFunctions.hideCanvas();
                }
                // Display do jogador a jogar
                playerputonline.textContent = `Vez do ${data.turn}`;
                if ("players" in  data){
                    if (data.players[nick] != "white"){
                        game_class.player1='2';
                        console.log("player1: " + game_class.player1);

                    }else{
                        game_class.player1='1';
                        console.log("player1: " + game_class.player1);
                    }
                }
                if( "turn" in data){
                    if( data.turn == nick){
                        canvasFunctions.hideCanvas();
                        putDisplay.style.display = 'block';
                        game_class.currentPlayer = game_class.player1;
                        console.log("currentPlayer: " + game_class.currentPlayer);
                    }
                    else{
                        canvasFunctions.showCanvas();
                        putDisplay.style.display = 'none';
                        game_class.currentPlayer = game_class.player1%2 + 1;
                        console.log("currentPlayer: " + game_class.currentPlayer);
                    }
                }
                // Funkão para fazer o update do tabuleiro
                if("board" in data){
                    console.log("Received board data:", data.board);
                    // Rest of the code
                    let piecesWhite = 0;
                    let piecesBlack = 0;
                    for( let l=0; l< board_class.numRows;l++){
                        for(let c= 0;c<board_class.numCols;c++){
                            const cell = document.querySelector(`[data-row="${l}"][data-col="${c}"]`);
                            cell.textContent = '';
                            cell.style.backgroundImage = 'none';

                            let piece=convert_board(data.board[l][c])
                            board_class.board[l][c]=piece
                            if(piece ==1){
                                cell.style.backgroundImage = 'url("assets/white.png")';
                                piecesWhite++;
                            }
                            else if (piece==2){
                                cell.style.backgroundImage = 'url("assets/black.png")';
                                piecesBlack++;
                            }
                        }
                    }
                    // Atualizar o tabuleiro lateral
                    invalid.style.display = 'none';
                    const sideBoard = document.querySelector(`.side_board_1`);
                    const piecesCount = 12- piecesWhite;
                    sideBoard.innerHTML = ''; // «Limpa» o tabuleiro lateral
                    for (let i = 0; i < piecesCount; i++) {
                        const piece = document.createElement('div');
                        piece.classList.add('white-piece');
                        sideBoard.appendChild(piece);
                    }

                    // Atualizar o tabuleiro lateral
                    const sideBoard2 = document.querySelector(`.side_board_2`);
                    const piecesCount2 = 12- piecesBlack;
                    sideBoard2.innerHTML = ''; // «Limpa» o tabuleiro lateral
                    for (let i = 0; i < piecesCount2; i++) {
                        const piece = document.createElement('div');
                        piece.classList.add('black-piece');
                        sideBoard2.appendChild(piece);
                    }

                    
                    console.log(board_class.board)
                }
                // Muda a fase do jogo
                if("phase" in data){
                    if(data.phase =="drop"){
                        game_class.putPhase = true;
                        console.log("putPhase: " + game_class.putPhase)
                    }else{
                        putDisplay.style.display = 'none';
                        if (data.turn == nick){
                            moveDisplay.style.display = 'block';
                        }else{
                            moveDisplay.style.display = 'none';
                        }
                        removeDisplay.style.display = 'none';
                        if (game_class.player1 === '2'){
                            game_class.currentPlayer = '2'; // jogador preto
                        }else{
                            game_class.currentPlayer = '1'; // jogador branco
                        }
                    }
                }
                // Saber a fase do jogo
                if("step" in data){
                    if(data.step=="take"){
                        game_class.canRemove = true;
                        if (data.turn == nick){
                            removeDisplay.style.display = 'block';
                        }else{
                            removeDisplay.style.display = 'none';
                        }
                        moveDisplay.style.display = 'none';
                        console.log("canRemove: " + game_class.canRemove)
                    }
                    else if(data.step=="to"){
                        let r = data.move["row"];
                        let c = data.move["column"];
                        const selectedCell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                        if (game_class.player1 === '1') {
                            if (data.turn == nick){
                                selectedCell.style.backgroundImage = 'url("assets/white-selected.png")';
                            }else{
                                selectedCell.style.backgroundImage = 'url("assets/black-selected.png")';
                            }
                        } else {
                            if (data.turn == nick){
                                selectedCell.style.backgroundImage = 'url("assets/black-selected.png")';
                            }else{
                                selectedCell.style.backgroundImage = 'url("assets/-selected.png")';
                            }
                        }
                        }
                    else{
                            game_class.canRemove = false;
                            console.log("canRemove: " + game_class.canRemove)
                        }
                }
                // Se o jogo acabou mostra o vencedor e esconde o canvas
                if ( "winner" in data){
                    canvasFunctions.hideCanvas();
                    console.log("winnnnnner" + data["winner"])
                    game_class.game_finished_online(data["winner"]);
                }
            }

        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    };

    source.onerror = error => {
        console.error('Error:', error);
        source.close(); // Close the EventSource in case of an error
    };
}

// Função para fazer receber os rankings do servidor
async function ranking(group, size) {
    const leaderboardTable = document.getElementById("ranking-container");

    // Fazer um pedido POST para o servidor
    const response = await fetch(SERVER + 'ranking', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        group: group,
        size: size
    })
    });

    // Verificar se o pedido foi bem sucedido
    if (!response.ok) {
    throw new Error('Error fetching ranking data');
    }

    // Obter os dados JSON
    const data = await response.json();
    console.log(data);

    // Obter o array de jogadores
    const parsedData = data.ranking;

    console.log(parsedData);

    //  Limpar o conteúdo da tabela
    leaderboardTable.innerHTML = '';

    // Cria uma linha para o cabeçalho da tabela
    const headerRow = document.createElement('tr');

    // Cria células para o nick, jogos, e vitórias
    const nickHeader = document.createElement('th');
    nickHeader.textContent = 'Nick  ';
    headerRow.appendChild(nickHeader);

    const gamesHeader = document.createElement('th');
    gamesHeader.textContent = 'Jogos '; 
    headerRow.appendChild(gamesHeader);

    const victoriesHeader = document.createElement('th');
    victoriesHeader.textContent = 'Vitórias'; 
    headerRow.appendChild(victoriesHeader);

    // Adiciona a linha de cabeçalho à tabela
    leaderboardTable.appendChild(headerRow);

    // Criar uma linha para cada jogador
    for (const player of parsedData) {
        const row = document.createElement('tr');

        // Cria células para o nick, jogos, e vitórias
        const nickCell = document.createElement('td');
        nickCell.textContent = player.nick;
        row.appendChild(nickCell);

        const gamesCell = document.createElement('td');
        gamesCell.textContent = player.games;
        row.appendChild(gamesCell);

        const victoriesCell = document.createElement('td');
        victoriesCell.textContent = player.victories;
        row.appendChild(victoriesCell);

        // Adiciona a linha à tabela
        leaderboardTable.appendChild(row);
    }

    return data;
}

// Função que converter o tabuleiro para o formato do servidor
function convert_board(str){
    if (str == "empty"){
        return 0
    }
    if( str=="white"){
        return 1
    }
    return 2

}

// Função para criar o canvas
const canvasFunctions = {
    hideCanvas: function () {
        const canvas = document.getElementById('tela');
        canvas.style.display = 'none';
    },

    showCanvas: function () {
        const canvas = document.getElementById('tela');
        canvas.style.display = 'block';
        const gc = canvas.getContext('2d');
        const radius = 40;
        const lineWidth = 5;
        let rotation = 0;
        const speed = 0.1;

        function draw() {
            gc.clearRect(0, 0, canvas.width, canvas.height);

            gc.beginPath();
            gc.arc(canvas.width / 2, canvas.height / 2, radius, rotation, rotation + Math.PI * 1.5);
            gc.lineWidth = lineWidth;
            gc.strokeStyle = '#5271FF';
            gc.stroke();

            rotation += speed;
            requestAnimationFrame(draw);
        }

        draw();
    }
};
