const maze = parseMaze();
const solution = solveMaze(maze);
if (solution === null) throw new Error('no solution');
animateSolution(maze, solution);

/**
 * Solves a maze.
 * @param {Array<Array<{left: boolean; right: boolean; bottom: boolean; top: boolean}>>} maze The cells of the maze in row-major order, having the presence of each wall set.
 * @return the solution as an Array of coordinates, one for each step, starting from the top left and ending at the bottom right
 */
function solveMaze(maze) {
    const start = [0, 0];
    const end = [maze.length - 1, maze[0].length - 1];
    const stack = [[start, [start]]];
    const visited = new Set();

    while (stack.length > 0) {
        const [[y, x], path] = stack.pop();
        if (visited.has(`${y},${x}`)) continue;
        visited.add(`${y},${x}`);

        if (y === end[0] && x === end[1]) return path;

        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        for (const [dy, dx] of directions) {
            if (canMove(maze, y, x, dy, dx)) {
                stack.push([ [y + dy, x + dx], [...path, [y + dy, x + dx]] ]);
            }
        }
    }

    return null; // return null if no solution found
}

/**
 * @param {Array<Array<{ cell: HTMLDivElement}>>} maze The maze cells in row-major order.
 * @param {Array<[number; number]>} solution The coordinates of the maze solution, step by step.
 */
async function animateSolution(maze, solution) {
    for (let i = 0; i < solution.length; i++) {
        const [y, x] = solution[i];
        maze[y][x].cell.classList.add('rat');
        await new Promise(resolve => setTimeout(resolve, 150));
    }
}