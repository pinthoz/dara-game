class DaraBoard {
    constructor(boardSize) {
        this.board = new Array(boardSize).fill(null).map(() => new Array(boardSize).fill(null));
        this.currentPlayer = "Branco";
        this.winner = null;
    }

    isGameOver() {
        const player1Holes = this.board[0].reduce((acc, hole) => acc + (hole === "Branco" ? 1 : 0), 0);
        const player2Holes = this.board[1].reduce((acc, hole) => acc + (hole === "Branco" ? 1 : 0), 0);

        return player1Holes === 0 || player2Holes === 0 ||
            (this.board[0].every(hole => hole === null) && this.board[1].every(hole => hole === null));
    }

    playTurn(player, hole) {
        const pieces = this.board[hole].slice();

        for (let i = 0; i < pieces.length; i++) {
            this.board[hole + i] = pieces[i];
        }

        this.board[hole] = null;

        const capturedPieces = this.board.find((row, col) => row !== hole && row !== hole + i && this.board[row][col] === player);
        if (capturedPieces) {
            capturedPieces.forEach((piece, col) => this.board[row][col] = null);
        }

        this.currentPlayer = this.currentPlayer === "Branco" ? "Preto" : "Branco";

        // Adicionar uma condição de vitória
        if (this.board[0].length === 2 || this.board[1].length === 2) {
            this.winner = this.board[0].length === 2 ? "Branco" : "Preto";
        }
    }

    renderWinner() {
        if (this.winner === "Branco") {
            return "Jogador Branco venceu!";
        } else if (this.winner === "Preto") {
            return "Jogador Preto venceu!";
        } else {
            return "Empate!";
        }
    }
}