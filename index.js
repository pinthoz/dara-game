
const http = require('http');
const url = require('url');
const crypto = require('crypto')


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
let rankings = {};
let games = {};
let waiting = {};
let connections = {};



function remember(response, game) {
    
    if (game in update_responses) {
        connections[game].push(response);
    }
    else { connections[game] = [response]; }
}

function forget(connection, game) {
    let pos = connections[game].findIndex((conn) => conn === connection);
    if (pos > -1) {
        connections[game].slice(pos, 1);
    }
}

function broadcast(data, game) {

    let json = JSON.stringify(data)
    for (let connection of connections[game]) {
        connection.sendUTF(json);
    }
}



const server = http.createServer(function (request, response) {

    const parsedUrl = url.parse(request.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query; 

    console.log(request.method);
    console.log(pathname);
    switch (request.method) {
        case 'GET':
            response.writeHead(200, sseHeaders);
            switch (pathname) {
                case '/update':
                    let nick = query.nick;
                    let game = query.game;
                    remember(response, game);
                    request.on('close', () => { console.log("fechei o SSE"); forget(response, game) });
                    setImmediate(() => {
                        broadcast({ "counter": update_responses[game].length }, game); //obviamente mudar isto, isto é o q acontece quando o SSE é iniciado, eventualmente não é preciso ter código aqui
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
                                        response.write(JSON.stringify({ message: 'Login successful' }));
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
                        .on('data', (chunk) => { body += chunk; })
                        .on('end', () => {
                            try {
                                let query = JSON.parse(body);
                                let size = query.size;
                                broadcast({ 'message': 'ranking', 'ranking': rankings[JSON.stringify(size)] }, size);
                            }
                            catch (err) { console.log(err); }
                        })
                    break;

                case "/join":
                    request
                        .on('data', (chunk) => { body += chunk; })
                        .on('end', () => {
                            try {
                                let query = JSON.parse(body);
                                let nick = query.nick;
                                let password = query.password;
                                let size = query.size;
                                let rows = size.rows;
                                let columns = size.columns;
                                let size_string = JSON.stringify(size);
                                if (logins[nick] != password) { response.writeHead(200, defaultCorsHeaders); response.write(JSON.stringify({ "error": "User registered with a different password" })); response.end(); return; }
                                console.log("entrei no join");
                                if ((size_string in waiting)) {
                                    if (waiting[size_string].length > 0) {
                                        let waiter = waiting[size_string].pop();
                                        let game_id = waiter.game;
                                        let player_1 = waiter.nick;
                                        let encoded_game_id = btoa(game_id);
                                        //cria um jogo com player_1 e nick e manda para ambos os players, e começa o, adicionando ao dicionario games um par game_id: game_object
                                        console.log("criei um jogo com os players "+player_1+" e "+nick +" com id: "+game_id + "e hash:" +encoded_game_id);
                                        response.writeHead(200,defaultCorsHeaders);
                                        response.write(JSON.stringify({'game':encoded_game_id}));
                                        response.end();
                                        let game = games[game_id];
                                        game.join_player_2(nick);
                                        setTimeout(() => broadcast(game.object_to_update(),game_id), 1000);
                                        // 

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
                                        let new_game = new Game_Server(size_string,rows,columns,game_id,nick);
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
                                    let new_game = new Game_Server(size_string,rows,columns,game_id,nick);
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
                        .on('data', (chunk) => { body += chunk; })
                        .on('end', () => {
                            try {
                                let dados = JSON.parse(body);
                                let nick = dados.nick;
                                let password = dados.password;
                                let game = dados.game;
                                if (logins[nick] != password) { response.writeHead(200, defaultCorsHeaders); response.write(JSON.stringify({ "error": "User registered with a different password" })); response.end(); return; }
                                if (!(game in games)) { response.writeHead(200, defaultCorsHeaders); response.write(JSON.stringify({ "error": "This game is invalid" })); response.end(); return; }
                                //terminar o jogo, whatever that means
                                response.writeHead(200, defaultCorsHeaders);
                                response.write(JSON.stringify({}));
                                response.end();
                                broadcast({ nick: nick, 'status': "game over", 'winner': nick, 'board': "ola" }, game);//obviamente mudar isto
                                return;
                            }
                            catch (err) { console.log(err); }
                        })
                    break;
                case "/notify":
                    request
                        .on('data', (chunk) => { body += chunk; })
                        .on('end', () => {
                            try {
                                let dados = JSON.parse(body);
                                let nick = dados.nick;
                                let password = dados.password;
                                let game = dados.game;
                                let move = dados.move;
                                let row = move.row;
                                let column = move.column;
                                if (logins[nick] != password) { response.writeHead(200, defaultCorsHeaders); response.write(JSON.stringify({ "error": "User registered with a different password" })); response.end(); return; }
                                if (!(game in games)) { response.writeHead(200, defaultCorsHeaders); response.write(JSON.stringify({ "error": "This game is invalid" })); response.end(); return; }
                                //vê se é valido
                                // joga
                                //manda update para os 2 players
                                response.writeHead(200, defaultCorsHeaders);
                                response.write(JSON.stringify({}));
                                response.end();
                                broadcast({ 'move': move, 'player': nick, 'board': 'oi' }, game);//obviamente mudar isto
                                return;
                            }
                            catch (err) { console.log(err); }
                        })
                    break;
            }
            break;

    }
});

server.listen(8009);