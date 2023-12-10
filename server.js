//const SERVER = "http://twserver.alunos.dcc.fc.up.pt:8008/";
const SERVER = "http://34.67.217.93:8008/";
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
            if (data.error) {
                alert(`Error: ${data.error}`);
            } else {
                console.log("Notificação de jogada" + data.nick);
            }
        })
        .catch(error => console.error('Error:', error));
}

async function update(gameId, nick) {
    const queryParams = new URLSearchParams({
        nick: nick,
        game: gameId,
    });

    console.log("update");

    fetch(`${SERVER}update?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    })
    .then(response => {
        console.log(response);
        alert('Game found');
        return response.json();  
    })
    .then(data => {
        console.log(data);
        if (data.error) {
            alert(`Error: ${data.error}`);
        } else {
            console.log("Aqui+ " + data.board);
            alert('Updating game');
        }
    })
    .catch(error => console.error('Error:', error));
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
    gamesHeader.textContent = 'Jogos  '; // Adjust the header text as needed
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

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("login-button").addEventListener("click", clickRegister);
});
