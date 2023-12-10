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
    fetch(SERVER + 'ranking', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            group: group,
            size: size,
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.error) {
            alert(`Error: ${data.error}`);
        } else {
            rankingData = data.ranking;  
            alert('Ranking updated');
            return data;
        }
    })
    .catch(error => console.error('Error:', error));
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("login-button").addEventListener("click", clickRegister);
});
