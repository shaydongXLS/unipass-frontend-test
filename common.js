/**
 * Parses a maze from the HTML document.
 * @returns {Array<Array<{left: boolean; right: boolean; bottom: boolean; top: boolean, cell: HTMLDivElement}>>} maze The cells of the maze in row-major order, having the presence of each wall set.
 */
window.parseMaze = () => {
    let maze = [];
    let rows = document.querySelectorAll('.row');
    for (let i = 0; i < rows.length; i++) {
      let row = [];
      let cells = rows[i].querySelectorAll('.cell');
      for (let j = 0; j < cells.length; j++) {
        let cell = cells[j];
        row.push({
          row: i,
          col: j,  
          cell,
          top: cell.classList.contains('top'),
          right: cell.classList.contains('right'),
          bottom: cell.classList.contains('bottom'),
          left: cell.classList.contains('left'),
        });
      }
      maze.push(row);
    }
    return maze;
};

/**
 * Checks if one can move in the specified direction.
 * @param {Array<Array<{left: boolean; right: boolean; bottom: boolean; top: boolean}>>} maze The cells of the maze in row-major order, having the presence of each wall set.
 * @param {number} y The current y position.
 * @param {number} x The current x position.
 * @param {-1 | 0 | 1} dy The change in y position.
 * @param {-1 | 0 | 1} dx The change in x position.
 * @returns {boolean} Whether the movement is possible.
 */
window.canMove = (maze, y, x, dy, dx) => {
    const walls = maze[y][x];
    return (inBounds(maze, y + dy, x + dx)
       &&((dx < 0 && !walls['left'])
       || (dx > 0 && !walls['right'])
       || (dy < 0 && !walls['top'])
       || (dy > 0 && !walls['bottom'])
    ));
};

/**
 * Checks if the position is within the maze.
 * @param {Array<Array<{left: boolean; right: boolean; bottom: boolean; top: boolean}>>} maze The cells of the maze in row-major order, having the presence of each wall set.
 * @param {number} y The maze cell y coordinate.
 * @param {number} x The maze cell x coordinate.
 * @returns {boolean} Whether the position is within the maze.
 */
window.inBounds = (maze, y, x) => 
    y >= 0 && y < maze.length && x >= 0 && x < maze.length;