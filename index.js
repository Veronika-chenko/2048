import { Grid } from "./grid.js";
import { Tile } from "./tile.js";

const gameBoard = document.getElementById("game-board");

const grid = new Grid(gameBoard);
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard))
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard))

setupInputOnce();

function setupInputOnce() {
    window.addEventListener("keydown", handleInput, { once: true });
}

function handleInput(e) {
    // console.log("key", e.key);
    switch (e.key) {
        case "ArrowUp":
            moveUp();
            break;
        case "ArrowDown":
            moveDown();
            break;
        case "ArrowLeft":
            moveLeft();
            break;
        case "ArrowRight":
            moveRight();
            break;
    
        default:
            setupInputOnce();
            return;
    }

    setupInputOnce()
}

function moveUp() {
    slideTiles(grid.cellsGroupedByColumn);
}

function moveDown() {
    slideTiles(grid.cellGroupedByReversedColumn)
}

function moveLeft() {
    slideTiles(grid.cellGroupedByRow);
}

function moveRight() {
    slideTiles(grid.cellGroupedByReversedRow);
}

function slideTiles(groupedCells) {
    // console.log('groupedCells: ', groupedCells)
    groupedCells.forEach(group => slideTilesInGroup(group))

    grid.cells.forEach(cell => {
        cell.hasTileForMerge() && cell.mergeTiles();
    })
}

function slideTilesInGroup(group) {
    for (let i = 1; i < group.length; i += 1) {
        if (group[i].isEmpty()) {
            continue;
        }
        const cellWithTile = group[i];
        // find empty cell:
        let targetCell;
        let j = i - 1;
        while (j >= 0 && group[j].canAccept(cellWithTile.linkedTile)) {
            targetCell = group[j];
            j -= 1;
        }

        if (!targetCell) {
            continue;
        }

        if (targetCell.isEmpty()) {
            targetCell.linkTile(cellWithTile.linkedTile); // привязать к пустой 
        } else {
            targetCell.linkTileForMerge(cellWithTile.linkedTile)
        }

        cellWithTile.unlinkTile();
    }
}