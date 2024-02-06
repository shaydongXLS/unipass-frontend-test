const maze = parseMaze();

// Serializing the maze JS object to JSON
const mazeJSON = JSON.stringify(maze);
console.log(mazeJSON);

window.addEventListener('keydown', ({ key }) => {
    let dx = 0;
    let dy = 0;
    if (key === 'ArrowLeft') {
        dx = -1;
    } else if (key === 'ArrowRight') {
        dx = 1;
    } else if (key === 'ArrowUp') {
        dy = -1;
    } else if (key === 'ArrowDown') {
        dy = 1;
    } else {
        return;
    }
    moveOffset(dy, dx);
});

const rat = [0, 0]; // y, x

function moveOffset(dy, dx) {
    if (!canMove(maze, ...rat, dy, dx)) return;
    moveToUnchecked(rat[0] + dy, rat[1] + dx);
}

/** Assumes that the rat `canMove` to the position. */
function moveToUnchecked(y, x) {
    maze[rat[0]][rat[1]].cell.classList.remove('rat')
    maze[y][x].cell.classList.add('rat');
    rat[0] = y;
    rat[1] = x;
}

moveToUnchecked(0, 0);