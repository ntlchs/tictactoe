import React from "react";
import ReactDOM from "react-dom/client";
import numberWithOrdinal from "ordinal-number";
import "./index.css";

function Square({ onClick, value }) {
  let className;
  if (value === "X") {
    className = "square green";
  } else if (value === "O") {
    className = "square pink";
  } else {
    className = "square";
  }

  return (
    <button className={className} onClick={onClick}>
      {value}
    </button>
  );
}

function Row({ rowIndex, squares, onClick }) {
  let start = 3 * rowIndex;
  return (
    <div className="board-row">
      {squares.slice(start, start + 3).map((square, i) => {
        return (
          <Square
            key={start + i}
            i={start + i}
            value={square}
            onClick={() => onClick(start + i)}
          />
        );
      })}
    </div>
  );
}

function Board({ squares, onClick }) {
  return (
    <div id="board">
      {[0, 1, 2].map((i) => {
        return <Row key={i} rowIndex={i} squares={squares} onClick={onClick} />;
      })}
    </div>
  );
}

function Game() {
  const [state, setState] = React.useState({
    history: [
      {
        squares: Array(9).fill(null),
      },
    ],
    stepNumber: 0,
    xIsNext: true,
  });

  function handleClick(i) {
    const history = state.history.slice(0, state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = state.xIsNext ? "X" : "O";
    setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !state.xIsNext,
    });
  }

  const history = state.history;
  const current = history[state.stepNumber];
  const winner = calculateWinner(current.squares);

  const moves = history.map((step, move) => {
    const desc = move ? numberWithOrdinal(move) + " move" : "Start";
    return (
      <li key={move}>
        <button className="jumpToBtn" onClick={() => jumpTo(move)}>
          {desc}
        </button>
      </li>
    );
  });

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (!winner && state.stepNumber === 9) {
    status = "Tie";
  } else {
    status = "Next player: " + (state.xIsNext ? "X" : "O");
  }

  function jumpTo(step) {
    setState({
      ...state,
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  return (
    <div className="game">
      <div id="title">Tic-Tac-Toe</div>
      <div id="status">{status}</div>
      <div className="game-board">
        <Board squares={current.squares} onClick={(i) => handleClick(i)} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
