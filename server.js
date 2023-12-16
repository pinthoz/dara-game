
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

function notify(nick, password, game, move) {
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
            response.json()
        })
        .then(data => {
            console.log(nick);
            console.log(password);
            console.log("Notificação de jogada " + nick);
            console.log(move);
            }
        )
        .catch(error => console.error('Error:', error));
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
                if (IsOnlineGame===0){
                    const opponentNick = Object.keys(data.players).find(player => player !== nick);
                    alert(`Adversário encontrado: ${opponentNick}`);
                    IsOnlineGame=1;
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
                        game_class.currentPlayer = game_class.player1;
                        console.log("currentPlayer: " + game_class.currentPlayer);
                    }
                    else{
                        game_class.currentPlayer = game_class.player1%2 + 1;
                        console.log("currentPlayer: " + game_class.currentPlayer);
                    }
                }
                if("board" in  data){
                    for( let l=0; l< board_class.numRows;l++){
                        for(let c= 0;c<board_class.numCols;c++){
                            let piece=convert_board(data.board[l][c])
                            board_class.board[l][c]=piece
                            if(piece ==1){
                                console.log("playerWpieces: " + board_class.playerWpieces)
                            }
                            else if (piece==2){
                                console.log("playerBpieces: " + board_class.playerBpieces)
                            }
                        }
                    }
                    console.log(board_class.board)
                    board_class.renderBoard()
                }
                
                if("phase" in data){
                    if(data.phase =="drop"){
                        game_class.putPhase = true;
                        console.log("putPhase: " + game_class.putPhase)
                    }else{
                        game_class.putPhase = false;
                        console.log("putPhase: " + game_class.putPhase)
                    }
                }
                if("step" in data){
                    if(data.step=="take"){
                        game_class.canRemove = true;
                        console.log("canRemove: " + game_class.canRemove)
                    }
                    else{
                        game_class.canRemove = false;
                        console.log("canRemove: " + game_class.canRemove)
                    }
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

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("login-button").addEventListener("click", clickRegister);
});

