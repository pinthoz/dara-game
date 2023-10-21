function handlePieceSelection(row, col) {
    if (possible_click(row, col, currentPlayer)) {
        rowSelected = row;
        colSelected = col;
        pieceSelected = true;
        // Atualize a classe da imagem da peça selecionada
        const selectedCell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (currentPlayer === '1') {
            selectedCell.style.backgroundImage = 'url("/assets/white-selected.png")';
        } else {
            selectedCell.style.backgroundImage = 'url("/assets/black-selected.png")';
        }
        // Atualize o estado da peça no tabuleiro
        board[row][col] = currentPlayer;

        console.log('Piece selected');
        console.log('Piece selected - Row:', rowSelected, 'Column:', colSelected);
        
        selectedCell.addEventListener('click', function handlePieceDeselection(event) {
            pieceSelected = false;

            // Restore the default background image
            if (currentPlayer === '1') {
                selectedCell.style.backgroundImage = 'url("/assets/white.png")';
            } else {
                selectedCell.style.backgroundImage = 'url("/assets/black.png")';
            }

            // Remove the deselection click event
            selectedCell.removeEventListener('click', handlePieceDeselection);
        });
    } else {
        console.log('Piece cannot be selected');
    }
}