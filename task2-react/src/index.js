import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import data from './data.json';
import './index.css';

// Process the data to keep only the necessary details
const mazeData = data.map(row =>
  row.map(({ cell, ...rest }) => rest)
);

// Cell component
function Cell({ details, isRat }) {
  return (
    <div className={`cell ${details.top ? 'top-wall' : ''} ${details.right ? 'right-wall' : ''} 
                     ${details.bottom ? 'bottom-wall' : ''} ${details.left ? 'left-wall' : ''} 
                     ${isRat ? 'rat' : ''}`}>
    </div>
  );
}

// FUNCTIONS

// Function checks if one can move in the specified direction.
function canMove(maze, row, col, dRow, dCol) {
  const walls = maze[row][col];
  if  (
       (dCol < 0 && walls['left'])
    || (dCol > 0 && walls['right'])
    || (dRow < 0 && walls['top'])
    || (dRow > 0 && walls['bottom'])
  ) return false;
  return true;
}

// Function checks if a cell is in the Maze
function inBounds(row, col, maze) {
  return row >= 0 && row < maze.length && col >= 0 && col < maze[0].length;
}

// Function to solve a maze
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
          if (canMove(maze, y, x, dy, dx) && inBounds(y + dy, x + dx, maze)) {
              stack.push([ [y + dy, x + dx], [...path, [y + dy, x + dx]] ]);
          }
      }
  }

  return null; // return null if no solution found
}

// Maze component
function Maze() {
  // The rat's location will be an object with 'row' and 'col' properties
  const [ratPath, setRatPath] = useState({});
  const [solution, setSolution] = useState(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const result = solveMaze(mazeData);
    setSolution(result);
    
    if (result !== null) {
      const intervalId = setInterval(() => {
        setStep(prevStep => prevStep + 1);
      }, 150);
      return () => clearInterval(intervalId);
    }

  }, []);

  useEffect(() => {
    if (solution !== null) {
      let path = {};
      for (let i = 0; i <= step; i++) {
        const coord = solution[i];
        if (coord) {
          const key = `${coord[0]}_${coord[1]}`;
          path[key] = true;
        }
      }
      setRatPath(path);
    }
  }, [step]);

  return (
    <div id='cells'>
      {mazeData.map((row, i) => (
        <div className='row' key={i}>
          {row.map((cell, j) => (
            <Cell 
              key={j}
              details={cell}  
              isRat={ratPath[`${i}_${j}`]} 
            />
          ))}
        </div>
      ))}
    </div>
  );
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<Maze />);