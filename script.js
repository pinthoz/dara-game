document.addEventListener('DOMContentLoaded', () => {
    const boardSizeSelect = document.querySelector('#board-size');
    const startGameButton = document.querySelector('#start-game');
    const gameContainer = document.querySelector('.game-container');
    const currentPlayerDisplay = document.querySelector('#current-player');
    const gameResultDisplay = document.querySelector('#game-result');

    let boardSize = boardSizeSelect;
    let currentPlayer = '1';
    let board = [];
    let isGameActive = false;
    let putPhase = true;
    let rowSelected = 0;
    let colSelected = 0;
    let playerBpieces = 12;
    let playerWpieces = 12;




    function tupleToString(tuple) {
        return JSON.stringify(tuple);
    }
    
    // Function to convert a string back to a tuple
    function stringToTuple(str) {
        return JSON.parse(str);
    }


    // Função para gerar o tabuleiro com base no tamanho selecionado
    function generateBoard() {
        if (boardSize === 6){
        gameContainer.innerHTML = '';
        board = new Array(boardSize).fill('').map(() => new Array(boardSize).fill(''));
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', () => handleCellClick(row, col));
                gameContainer.appendChild(cell);
            }
        }
    }else{
        const numRows = 6; // Defina o número de linhas
        const numCols = 5; // Defina o número de colunas

        gameContainer.innerHTML = '';
        board = new Array(numRows).fill('').map(() => new Array(numCols).fill(''));

        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', () => handleCellClick(row, col));
                gameContainer.appendChild(cell);
        }
    }
    
    }
}

        


    // Função para lidar com o clique em uma célula

    function handleCellClick(row, col) {
        

        if (!isGameActive) return;

        if (putPhase) {
            // Verifique se o jogador ainda tem peças disponíveis
            //########## POR IF POSSIBLE FORA #################//
            let possible_place = possible_play(row, col, currentPlayer);

            if (possible_place){

                if (currentPlayer === '1' && playerBpieces > 0) {
                        renderBoard();
                        playerBpieces--;
                
                } else if (currentPlayer === '2' && playerWpieces > 0) {
                        renderBoard();
                        playerWpieces--;
                }


                // Troca o jogador atual
                currentPlayer = currentPlayer === '1' ? '2' : '1';
                currentPlayerDisplay.textContent = currentPlayer;


            } else {
                console.log('Joga Inválida');
            }

            console.log(playerBpieces, playerWpieces);

            if (playerBpieces === 0 && playerWpieces === 0) {
                putPhase = false;
                console.log('Você já colocou todas as peças permitidas durante a fase de colocação.');
                currentPlayer = '1'; // ou 'Preto', dependendo de quem deve começar após a fase de colocação
                currentPlayerDisplay.textContent = currentPlayer;
            }
        }

        else{

            if (possible_click(row, col, currentPlayer)) {
                possiblePlays(currentPlayer);
                
                console.log(possiblePlays_1);
                console.log("escolhi peça");
                
                //if (can_move(row,col,currentPlayer)){

       
            //}



        }
        

        
    }
}


    // Declare um mapa para armazenar as jogadas possíveis
const possiblePlays_1 = new Map();
const possiblePlays_2 = new Map();

function checkDirections(i, j, x, y, currentPlayer) {

    console.log(x + " " + y + " " + board[x][y] + "celula atual: " + board[i][j] + " " + i + " " + j);
    if (x < 0 || x >= boardSize || y < 0 || y >= boardSize || board[x][y] !== '') {
        
        return;
    } else {

        if (currentPlayer === '1') {
            const key = tupleToString([i, j]);
            if (!possiblePlays_1.has(key)) {
                possiblePlays_1.set(key, []);
            }
            possiblePlays_1.get(key).push([x, y]);
        }
        else {
            const key = tupleToString([i, j]);
            if (!possiblePlays_2.has(key)) {
                possiblePlays_2.set(key, []);
            }
            possiblePlays_2.get(key).push([x, y]);
        }
    }
}

function possiblePlays(currentPlayer) {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (board[i][j] === currentPlayer) {
                checkDirections(i, j, i + 1, j, currentPlayer);
                checkDirections(i, j, i, j + 1, currentPlayer);
                checkDirections(i, j, i - 1, j, currentPlayer);
                checkDirections(i, j, i, j - 1, currentPlayer);
            }
        }
    }
}




    function possible_click(i, j, currentPlayer) {
        if (board[i][j] === currentPlayer) {
            console.log('true - Cell is yours');
            return true;
        }
        console.log('false - Cell is not yours');
        return false;
    }
    
    function possible_play(i, j, currentPlayer) {
        // Check is Empty
        if (board[i][j] !== '') {
            console.log('false - Cell is not empty');
            return false;
        }
    
        if (!putPhase) {
            board[rowSelected][colSelected] = 0;
        }
    
        board[i][j] = currentPlayer;
    
        // Check Horizontal
        let leftlim = Math.max(0, j - 3);
        let rightlim = Math.min(boardSize - 1, j);

        console.log("leftlim " + leftlim + " rightlim " + rightlim);

        for (let k = leftlim; k <= rightlim; k++) {
            console.log("|" + currentPlayer + "|" + board[i][k] + "|" + board[i][k + 1] + "|" +  board[i][k + 2] + "|" + board[i][k + 3]) + "|";
            if (
            currentPlayer === board[i][k] &&
            currentPlayer === board[i][k + 1] &&
            currentPlayer === board[i][k + 2] &&
            currentPlayer === board[i][k + 3]
        ) {
            board[i][j] = '';
            return false;
        }
        }
    
        // Check Vertical
        leftlim = Math.max(0, i - 3);
        rightlim = Math.min(boardSize - 1, i);
    
        for (let k = leftlim; k <= rightlim; k++) {
            if (
            currentPlayer === board[k][j] &&
            currentPlayer === board[k + 1][j] &&
            currentPlayer === board[k + 2][j] &&
            currentPlayer === board[k + 3][j]
        ) {
            board[i][j] = '';
            return false;
        }
        }
        
        if (!putPhase) {
            board[rowSelected][colSelected] = currentPlayer;
        }
        console.log('true - Move is possible');
        return true;
    }
    





    // Função para renderizar o tabuleiro atual
    function renderBoard() {
        if (boardSize === 6) {
            for (let row = 0; row < boardSize; row++) {
                for (let col = 0; col < boardSize; col++) {
                    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                    cell.textContent = '';
    
                    // Verifica a classe da célula e define o background-image correspondente
                    if (board[row][col] === '1') {
                        cell.style.backgroundImage = 'url(/assets/"white.png")'; // Substitua o caleftlimho correto da imagem
                    } else if (board[row][col] === '2') {
                        cell.style.backgroundImage = 'url("/assets/black.png")'; // Substitua o caleftlimho correto da imagem
                    } else {
                        cell.style.backgroundImage = 'none'; // Limpa o background-image se não houver jogador na célula
                    }
                }
            }
        } else {
            const numRows = 6;
            const numCols = 5;
    
            for (let row = 0; row < numRows; row++) {
                for (let col = 0; col < numCols; col++) {
                    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                    cell.textContent = '';
    
                    // Verifica a classe da célula e define o background-image correspondente
                    if (board[row][col] === '1') {
                        cell.style.backgroundImage = 'url("/assets/white.png")'; // Substitua o caleftlimho correto da imagem
                    } else if (board[row][col] === '2') {
                        cell.style.backgroundImage = 'url("/assets/black.png")'; // Substitua o caleftlimho correto da imagem
                    } else {
                        cell.style.backgroundImage = 'none'; // Limpa o background-image se não houver jogador na célula
                    }
                }
            }
        }
    }



    // Event listener para o botão "Iniciar Jogo"
    startGameButton.addEventListener('click', () => {
        boardSize = parseInt(boardSizeSelect.value);
        gameContainer.style.gridTemplateColumns = `repeat(${boardSize}, 50px)`; // Ajusta o número de colunas
        generateBoard();
        currentPlayer = '1';
        currentPlayerDisplay.textContent = currentPlayer;
        gameResultDisplay.textContent = '';
        isGameActive = true;

        // Adiciona a classe "active" ao elemento ".game-info"
        const gameInfoElement = document.querySelector('.game-info');
        gameInfoElement.classList.add('active');

    });



});
