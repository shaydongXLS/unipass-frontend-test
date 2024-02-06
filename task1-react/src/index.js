import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
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

// Maze component
function Maze() {
  // The rat's location will be an object with 'row' and 'col' properties
  const [ratLocation, setRatLocation] = useState({ row: 0, col: 0 });

  function canMove(row, col, dRow, dCol) {
    const walls = mazeData[row][col];
    return ((dCol < 0 && !walls['left'])
       || (dCol > 0 && !walls['right'])
       || (dRow < 0 && !walls['top'])
       || (dRow > 0 && !walls['bottom'])
    ) && inBounds(row + dRow, col + dCol);
  }

  // Function checks if a cell is in the Maze
  function inBounds(row, col) {
    return row >= 0 && row < mazeData.length && col >= 0 && col < mazeData[0].length;
  }

  // Listen to keypress and move rat
  useEffect(() => {
    const keyHandler = ({ key }) => {
      let dy = 0, dx = 0;
      if (key === 'ArrowUp') dy = -1;
      else if (key === 'ArrowDown') dy = 1;
      else if (key === 'ArrowLeft') dx = -1;
      else if (key === 'ArrowRight') dx = 1;

      if (dx || dy) { // when arrow key is pressed
        const { row: y, col: x } = ratLocation; // Destructure ratLocation
        if (canMove(y, x, dy, dx)) {
          setRatLocation({ row: y + dy, col: x + dx }); // move the rat
        }
      }
    };
    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [ratLocation]);

  return (
    <div id='cells'>
      {mazeData.map((row, i) => (
        <div className='row' key={i}>
          {row.map((cell, j) => (
            <Cell 
              key={j}
              details={cell}  
              isRat={
                i === ratLocation.row && 
                j === ratLocation.col
              } 
            />
          ))}
        </div>
      ))}
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Maze />);