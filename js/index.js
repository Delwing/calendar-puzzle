let canvas = document.getElementById("puzzle");

canvas.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

paper.setup(canvas);

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
boardGroup.position = new paper.Point(size * 5 + size / 2, size * 5 + size / 2);

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
    pieces.push(path);
  }

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
  };

  path.onMouseUp = (event) => {
    console.log(event);
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

function checkOccupiedCells() {
  visitBoard((cell) => (cell.children[0].fillColor = null));
  visitBoard((cell, x, y) => {
    let pos = cell.position;
    for (const piece of pieces) {
      piece.children.forEach((child) => {
        let sqPosition = child.position;
        if (pos.equals(sqPosition)) {
          cell.children[0].fillColor = new paper.Color(0.8, 0.8, 0.8, 0.8);
        }
      });
    }
  });
}
