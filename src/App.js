import { useState, useEffect, useCallback } from "react";
import classnames from "classnames";

import "./App.css";

const SIZE = 7;
const BOARD_SIZE = 700;

const generateGameState = (size = 7) => {
  if (size % 2 === 0) return;
  const resultArr = [];
  const low = 2;
  const high = size - 3;
  const middle = Math.floor(size / 2);
  for (let r = 0; r < size; r++) {
    const row = [];
    for (let c = 0; c < size; c++) {
      let value = "1";
      if (r < low && c < low) value = "X";
      if (r > high && c < low) value = "X";
      if (r < low && c > high) value = "X";
      if (r > high && c > high) value = "X";
      if (r === middle && c === middle) value = "0";
      row.push(value);
    }
    resultArr.push(row);
  }
  return resultArr;
};

function App() {
  const [step, setStep] = useState(0);
  const [activeX, setActiveX] = useState(null);
  const [activeY, setActiveY] = useState(null);
  const [gameState, setGameState] = useState([]);
  const [activeDialog, setActiveDialog] = useState("");

  const clearActive = useCallback(() => {
    setActiveX(null);
    setActiveY(null);
  }, [setActiveX, setActiveY]);

  const setActive = useCallback(
    (x, y) => {
      setActiveX(x);
      setActiveY(y);
    },
    [setActiveX, setActiveY]
  );

  const evaluateTarget = useCallback(
    (x, y) => {
      if (
        activeX === null ||
        activeY === null ||
        (x === activeX && y === activeY)
      ) {
        clearActive();
        return;
      }
      const xDiff = Math.abs(x - activeX);
      const yDiff = Math.abs(y - activeY);
      if (
        (xDiff > 0 && yDiff > 0) ||
        (yDiff === 0 && xDiff !== 2) ||
        (xDiff === 0 && yDiff !== 2)
      ) {
        clearActive();
        return;
      }

      const betweenX = xDiff === 0 ? x : (x + activeX) / 2;
      const betweenY = yDiff === 0 ? y : (y + activeY) / 2;
      const betweenItem = gameState[betweenY][betweenX];
      if (betweenItem !== "1") {
        clearActive();
        return;
      }

      // set active to target
      const activeRow = gameState[activeY];
      const newRow = [
        ...activeRow.slice(0, activeX),
        "0",
        ...activeRow.slice(activeX + 1),
      ];
      const stateAfterActive = [
        ...gameState.slice(0, activeY),
        newRow,
        ...gameState.slice(activeY + 1),
      ];

      // set target to active
      const targetRow = stateAfterActive[y];
      const newTargetRow = [
        ...targetRow.slice(0, x),
        "1",
        ...targetRow.slice(x + 1),
      ];
      const stateAfterTarget = [
        ...stateAfterActive.slice(0, y),
        newTargetRow,
        ...stateAfterActive.slice(y + 1),
      ];

      // set between to target
      const betweenRow = stateAfterTarget[betweenY];
      const newBetweenRow = [
        ...betweenRow.slice(0, betweenX),
        "0",
        ...betweenRow.slice(betweenX + 1),
      ];
      const stateAfterBetween = [
        ...stateAfterTarget.slice(0, betweenY),
        newBetweenRow,
        ...stateAfterTarget.slice(betweenY + 1),
      ];
      setGameState(stateAfterBetween);
      const newStep = step + 1;
      setStep(newStep);
    },
    [step, gameState, activeX, activeY, clearActive, setStep, setGameState]
  );

  const restart = () => {
    const newGameState = generateGameState(SIZE);
    setGameState(newGameState);
    setActiveDialog("");
    setStep(0);
    clearActive();
  };

  useEffect(() => {
    clearActive();
    let active = 0;
    gameState.forEach((row, r) => {
      row.forEach((item, i) => {
        if (item === "1") {
          const n = {
            x: i,
            y: r - 1,
          };
          const na = {
            x: i,
            y: r - 2,
          };
          const nVal = gameState[n.y]?.[n.x];
          const naVal = gameState[na.y]?.[na.x];
          if (nVal && nVal === "1" && naVal && naVal === "0") active += 1;
          const w = {
            x: i - 1,
            y: r,
          };
          const wa = {
            x: i - 2,
            y: r,
          };
          const wVal = gameState[w.y]?.[w.x];
          const waVal = gameState[wa.y]?.[wa.x];
          if (wVal && wVal === "1" && waVal && waVal === "0") active += 1;
          const s = {
            x: i,
            y: r + 1,
          };
          const sa = {
            x: i,
            y: r + 2,
          };
          const sVal = gameState[s.y]?.[s.x];
          const saVal = gameState[sa.y]?.[sa.x];
          if (sVal && sVal === "1" && saVal && saVal === "0") active += 1;
          const e = {
            x: i + 1,
            y: r,
          };
          const ea = {
            x: i + 2,
            y: r,
          };
          const eVal = gameState[e.y]?.[e.x];
          const eaVal = gameState[ea.y]?.[ea.x];
          if (eVal && eVal === "1" && eaVal && eaVal === "0") active += 1;
        }
      });
    });
    // console.log("active", active);
    if (step > 0 && active < 1) {
      setActiveDialog("gameover");
    }
  }, [step, gameState, clearActive]);

  useEffect(() => {
    const newGameState = generateGameState(SIZE);
    setGameState(newGameState);
  }, []);

  return (
    <div className="App">
      <div
        className="game-wrap"
        style={{ width: BOARD_SIZE, height: BOARD_SIZE }}
      >
        <div className="hud">
          <div>
            <small>{`Move: ${step}`}</small>
          </div>
          <button onClick={() => setActiveDialog("restart")}>Restart</button>
        </div>
        {gameState.map((row, r) => {
          return (
            <div key={`row-${r}`} className="grid">
              {row.map((item, i) => {
                let ele;
                const itemSize = 700 / SIZE;
                const btnSize = itemSize - 20;
                const itemStyle = {
                  width: itemSize,
                  height: itemSize,
                };
                const btnStyle = {
                  width: btnSize,
                  height: btnSize,
                  borderRadius: btnSize / 2,
                };
                if (item === "X") {
                  ele = (
                    <div
                      style={itemStyle}
                      className="item inactive"
                      key={`item-${i}`}
                    />
                  );
                } else if (item === "1") {
                  const btnClass = classnames("btn-active", {
                    active: activeX === i && activeY === r,
                  });
                  ele = (
                    <div style={itemStyle} className="item" key={`item-${i}`}>
                      <button
                        className={btnClass}
                        style={btnStyle}
                        onClick={() => setActive(i, r)}
                      />
                    </div>
                  );
                } else if (item === "0") {
                  ele = (
                    <div style={itemStyle} className="item" key={`item-${i}`}>
                      <button
                        className="btn-target"
                        style={btnStyle}
                        disabled={activeX === null || activeY === null}
                        onClick={() => evaluateTarget(i, r)}
                      />
                    </div>
                  );
                }
                return ele;
              })}
            </div>
          );
        })}
      </div>
      <dialog open={!!activeDialog}>
        <article>
          {activeDialog === "restart" && <h3>Restart Game</h3>}
          {activeDialog === "gameover" && <h3>Game Over</h3>}
          {activeDialog === "restart" && (
            <p>Are you sure want to restart the game?</p>
          )}
          {activeDialog === "gameover" && (
            <p>No more possible move available. Please restart the game.</p>
          )}
          <footer>
            <button className="secondary" onClick={() => setActiveDialog("")}>
              Cancel
            </button>
            <button onClick={() => restart()}>Restart</button>
          </footer>
        </article>
      </dialog>
    </div>
  );
}

export default App;
