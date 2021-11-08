let canvas = document.getElementById("puzzle");

canvas.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

let scope = paper.setup(canvas);
scope.project.view.translate(new paper.Point(125, 125))


let boardDefinition = [
  ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  [1, 2, 3, 4, 5, 6, 7],
  [8, 9, 10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19, 20, 21],
  [22, 23, 24, 25, 26, 27, 28],
  [29, 30, 31],
];

let cPiece = [[1, 1], [1], [1, 1]];

let sPiece = [
  [0, 0, 1, 1],
  [1, 1, 1, 0],
];

let ilPiece = [
  [1, 1],
  [0, 1],
  [0, 1],
  [0, 1],
];

let dPiece = [
  [0, 1],
  [1, 1],
  [1, 1],
];

let tPiece = [
  [1, 0],
  [1, 0],
  [1, 1],
  [1, 0],
];

let nPiece = [
  [0, 0, 1],
  [1, 1, 1],
  [1, 0, 0],
];

let pPiece = [
  [1, 1, 1],
  [1, 0, 0],
  [1, 0, 0],
];

let oPiece = [
  [1, 1, 1],
  [1, 1, 1],
];

let piecesDefinitions = [cPiece, sPiece, ilPiece, dPiece, tPiece, nPiece, pPiece, oPiece];
let size = 50;

let board = [];


let boardGroup = new paper.Group();
let rowIndex = 0;
for (const row of boardDefinition) {
  board[rowIndex] = [];
  let cellIndex = 0;
  for (const cell of row) {
    let cellGroup = new paper.Group();
    let path = new paper.Path.Rectangle(new paper.Point(size * cellIndex, size * rowIndex), new paper.Size(size, size));
    path.strokeWidth = 1;
    path.strokeColor = "black";

    let text = new paper.PointText(path.bounds.center.add(new paper.Point(0, 4)));
    text.justification = "center";
    text.content = cell;

    cellGroup.addChildren([path, text]);
    boardGroup.addChild(cellGroup);

    board[rowIndex][cellIndex] = cellGroup;
    cellIndex++;
  }
  rowIndex++;
}


let pieces = [];
for (const piece of piecesDefinitions) {
  let path = new paper.Group();
  let color = new paper.Color(Math.random(), Math.random(), Math.random(), 0.5);
  let rowIndex = 0;
  for (const row of piece) {
    let cellIndex = 0;
    for (const cell of row) {
      if (cell) {
        let rect = new paper.Path.Rectangle(new paper.Point(size * cellIndex, size * rowIndex), new paper.Size(size, size));
        rect.fillColor = color;
        path.addChild(rect);
      }
      cellIndex++;
    }
    rowIndex++;
  }
  pieces.push(path);
  path.bounds.topLeft.x = -125;
  path.bounds.topLeft.y = -125;

  path.onMouseDrag = (event) => {
    if (event.event.buttons !== 1) {
      return;
    }
    path.position = path.position.add(event.delta);
    path.drag = true;
  };

  path.onClick = (event) => {
    if (event.event.button === 2) {
      path.pivot = event.point;
      path.rotate(90);
      path.pivot = null;
    }
    if (event.event.button === 1) {
        path.scale(-1, 1);
      }
  };

  path.onMouseUp = (event) => {
    if (path.drag) {
      path.drag = false;
      path.bounds.topLeft.x = Math.round(path.bounds.topLeft.x / size) * size;
      path.bounds.topLeft.y = Math.round(path.bounds.topLeft.y / size) * size;
    }
  };
}

function visitBoard(func) {
  let rowIndex = 0;
  for (const row of board) {
    let cellIndex = 0;
    for (const cell of row) {
      func(cell, rowIndex, cellIndex);
      cellIndex++;
    }
    rowIndex++;
  }
}

function visitPieces(func) {
  visitBoard((cell) => (cell.children[0].fillColor = null));
  for (const piece of pieces) {
    piece.children.forEach((child) => {
      func(child);
    });
  }
}

function checkOccupiedCells() {
  let notOccuppied = [];
  visitBoard((boardCell) => (boardCell.occupied = false));
  visitPieces((pieceCell) => {
    let y = Math.round(pieceCell.bounds.topLeft.x / size);
    let x = Math.round(pieceCell.bounds.topLeft.y / size);
    
    if (board[x] && board[x][y]) {
      let boardCell = board[x][y];
      boardCell.children[0].fillColor = new paper.Color(0.8, 0.8, 0.8, 0.8);
      boardCell.occupied = true;
    }
  });
  visitBoard((boardCell, x, y) => {
    boardCell.children[0].strokeColor = "black";
    if (!boardCell.occupied) {
      notOccuppied.push([x, y]);
      boardCell.children[0].strokeColor = "green";
    }
  });

  if (notOccuppied.length == 2) {
    let monthElement = notOccuppied[0]
    let month =  boardDefinition[monthElement[0]][monthElement[1]]
    let dayElement = notOccuppied[1]
    let day = boardDefinition[dayElement[0]][dayElement[1]]
    if (typeof(month) === "string" && typeof(day) === "number") {
        alert(`${month} ${day}`)
    }
  }
}

document.getElementById("occupied").addEventListener("click", () => {
  checkOccupiedCells();
});

