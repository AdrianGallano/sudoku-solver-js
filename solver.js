const solveBtn = document.getElementById("solver-btn");
const generateBtn = document.getElementById("generate-btn");
const uiGrid = document.getElementById("grid");
let solved = true;
let grid;
let randNum;

fetch("./sudoku-problems.JSON")
  .then((res) => res.json())
  .then((data) => {
    grid = Array.from(data);
  });
// the ideal visuals
// iterate from numbers = green
// finished = yellow
// invalid = blue

function isValid(grid, currAddress, currNum) {
  let [row, col] = currAddress;

  // checks horizontal
  if (grid[row].includes(currNum)) {
    return false;
  }

  // checks vertical
  if (grid.map((x) => x[col]).includes(currNum)) {
    return false;
  }

  // checks box
  let startRow = row - (row % 3);
  let startCol = col - (col % 3);
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      if (grid[startRow + y][startCol + x] == currNum) {
        return false;
      }
    }
  }

  return true;
}

function isEmpty(grid) {
  // returns address [y,x]
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] == 0) {
        return [y, x];
      }
    }
  }
  return null;
}

function solve(grid) {
  let find = isEmpty(grid);
  if (!find) {
    return grid;
  } else {
    let [row, col] = find;
    for (let n = 1; n < 10; n++) {
      if (isValid(grid, find, n)) {
        grid[row][col] = n;
        if (solve(grid)) {
          return grid;
        }
      }
      grid[row][col] = 0;
    }
  }

  return false;
}

function startGrid(grid) {
  // start grid
  let delay = 0;
  for (let y = 0; y < grid.length; y++) {
    let uiCol = uiGrid.children[y];
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] == 0) continue;

      let uiRow = uiCol.children[x];

      uiRow.setAttribute("data-state", "given");
      setTimeout(() => (uiRow.textContent = grid[y][x]), delay);
      delay += 50;
    }
  }
}

function clearUiGrid() {
  for (let y = 0; y < 9; y++) {
    let uiCol = uiGrid.children[y];
    for (let x = 0; x < 9; x++) {
      let uiRow = uiCol.children[x];
      uiRow.setAttribute("data-state", "neutral");
      uiRow.textContent = "";
    }
  }
}

generateBtn.addEventListener("click", () => {
  if (!solved) return;

  randNum = Math.floor(Math.random() * grid.length);
  solved = false;

  clearUiGrid();
  startGrid(grid[randNum]);
});

solveBtn.addEventListener("click", () => {
  solve(grid);
  solved = true;
});

// module.exports = solve;
