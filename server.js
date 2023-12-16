
const SERVER = "http://twserver.alunos.dcc.fc.up.pt:8008/";
//const SERVER = "http://34.67.217.93:8008/";

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
            const json = await response.json();
            return !("error" in json);
        }
    } catch (error) {
        return false;
    }
}

async function clickRegister() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let canRegister = await registerClient(username, password);

    if (canRegister) {
        return true;
    } else {
        console.log("Registration failed");
        return false;
    }
}


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
                game_info = data.game;
                game_classe.game_id = game_info;
                console.log(data);
                console.log("Entrada no grupo de jogo com ID " + game_info);
            }
        })
        .catch(error => console.error('Error:', error));
}

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
                alert(`Error: ${data.error}`);
            } else {
                console.log("Saida do grupo de jogo");
            }
        })
        .catch(error => console.error('Error:', error));
}

async function notify(nick, password, game, move) {
    fetch(SERVER + 'notify', {
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
    })
        .then(response => {
            if (response.ok) {
                let message = response.json();

                if ('error' in message) {
                    console.log(`Error: ${message.error}`);
                }
                else return message;
            }else{
                let message = response.json();
                console.log(`Error: ${message.error}`)
            }
            
        })
        .catch(error => console.error('', error));
}


async function update(gameId, nick, IsOnlineGame, game_class, board_class) {
    const queryParams = new URLSearchParams({
        nick: nick,
        game: gameId,
    });

    console.log("update");


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
                const putDisplay = document.getElementById("place-piece-display");
                const moveDisplay = document.getElementById("move-piece-display");
                const removeDisplay = document.querySelector('#remove-display')
                if (IsOnlineGame===0){
                    const opponentNick = Object.keys(data.players).find(player => player !== nick);
                    alert(`Adversário encontrado: ${opponentNick}`);
                    IsOnlineGame=1;
                    putDisplay.style.display = 'block';
                    game_class.isGameActive = true;
                    hideCanvas();
                }
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
                        hideCanvas();
                        putDisplay.style.display = 'block';
                        game_class.currentPlayer = game_class.player1;
                        console.log("currentPlayer: " + game_class.currentPlayer);
                    }
                    else{
                        canvas();
                        putDisplay.style.display = 'none';
                        game_class.currentPlayer = game_class.player1%2 + 1;
                        console.log("currentPlayer: " + game_class.currentPlayer);
                    }
                }
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
                    
                    const sideBoard = document.querySelector(`.side_board_1`);
                    const piecesCount = 12- piecesWhite;
                    sideBoard.innerHTML = ''; // «Limpa» o tabuleiro lateral
                    for (let i = 0; i < piecesCount; i++) {
                        const piece = document.createElement('div');
                        piece.classList.add('white-piece');
                        sideBoard.appendChild(piece);
                    }

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
                if ( "winner" in data){
                    hideCanvas();
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


async function ranking(group, size) {
    const leaderboardTable = document.getElementById("ranking-container");

    // Make an HTTP request to the server
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

    // Check if the request was successful
    if (!response.ok) {
    throw new Error('Error fetching ranking data');
    }

    // Get the JSON data from the response
    const data = await response.json();

    // Parse the JSON data
    const parsedData = data.ranking;

    console.log(parsedData);

    // Remove existing rows from the table
    leaderboardTable.innerHTML = '';

    // Create a header row
    const headerRow = document.createElement('tr');

    // Create header cells for nick, games, and victories
    const nickHeader = document.createElement('th');
    nickHeader.textContent = 'Nick  ';
    headerRow.appendChild(nickHeader);

    const gamesHeader = document.createElement('th');
    gamesHeader.textContent = 'Jogos '; // Adjust the header text as needed
    headerRow.appendChild(gamesHeader);

    const victoriesHeader = document.createElement('th');
    victoriesHeader.textContent = 'Vitórias'; // Adjust the header text as needed
    headerRow.appendChild(victoriesHeader);

    // Append the header row to the leaderboard table
    leaderboardTable.appendChild(headerRow);

    // Create HTML elements for new data
    for (const player of parsedData) {
        const row = document.createElement('tr');

        // Create cells for nick, games, and victories
        const nickCell = document.createElement('td');
        nickCell.textContent = player.nick;
        row.appendChild(nickCell);

        const gamesCell = document.createElement('td');
        gamesCell.textContent = player.games;
        row.appendChild(gamesCell);

        const victoriesCell = document.createElement('td');
        victoriesCell.textContent = player.victories;
        row.appendChild(victoriesCell);

        // Append row to the leaderboard table
        leaderboardTable.appendChild(row);
    }

    return data;
}

function convert_board(str){
    if (str == "empty"){
        return 0
    }
    if( str=="white"){
        return 1
    }
    return 2

}

function hideCanvas() {
    const canvas = document.getElementById('tela');
    canvas.style.display = 'none';
}

function canvas() {
    const canvas = document.getElementById('tela');
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    const radius = 20;
    let angle = 0;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const x = canvas.width / 2 + Math.cos(angle) * 50;
        const y = canvas.height / 2 + Math.sin(angle) * 50;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#3498db';
        ctx.fill();
        angle += 0.05;
        requestAnimationFrame(draw);
    }

    draw();
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("login-button").addEventListener("click", clickRegister);
});
