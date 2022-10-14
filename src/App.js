import { useState, useEffect, useCallback } from "react";
import classnames from "classnames";
import UIfx from "uifx";
import { generateGameState, statusWatcher } from "./utils";
import { SIZE, BOARD_SIZE, TEMPLATES } from "./constants";
import wehWehSound from "./weh-weh.mp3";

import "./App.css";

const wehWeh = new UIfx(wehWehSound);

function App() {
  const [type, setType] = useState("cross");
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

  const restart = useCallback(() => {
    const newGameState = generateGameState(type);
    setGameState(newGameState);
    setActiveDialog("");
    setStep(0);
    clearActive();
  }, [type, clearActive]);

  useEffect(() => {
    restart()
  }, [type, restart]);

  useEffect(() => {
    clearActive();
    const { availableMoves, itemLeft } = statusWatcher(gameState);
    if (itemLeft === 1) {
      setActiveDialog("win");
    } else if (step > 0 && availableMoves < 1) {
      wehWeh.play();
      setActiveDialog("gameover");
    }
  }, [step, gameState, clearActive, setActiveDialog]);

  useEffect(() => {
    const newGameState = generateGameState();
    setGameState(newGameState);
  }, []);

  return (
    <div className="App">
      <div
        className="game-wrap"
        style={{ width: BOARD_SIZE, height: BOARD_SIZE }}
      >
        {gameState.map((row, r) => {
          return (
            <div key={`row-${r}`} className="row">
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
      <div className="panel" style={{ width: BOARD_SIZE }}>
        <div>
          <button onClick={() => setActiveDialog("restart")}>Restart</button>
          <div style={{ padding: "0 1rem" }}>
            <small>{`Move: ${step}`}</small>
          </div>
        </div>
        <div>
          {Object.keys(TEMPLATES).map((item) => {
            return (
              <button
                style={{ background: item === type ? 'rgb(16, 149, 193)' : '#333' }}
                key={item}
                onClick={() => setType(item)}
              >
                {item.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>
      <dialog open={!!activeDialog}>
        <article>
          {activeDialog === "win" && <h3>You Won</h3>}
          {activeDialog === "restart" && <h3>Restart Game</h3>}
          {activeDialog === "gameover" && <h3>Game Over</h3>}
          {activeDialog === "win" && <p>Click restart to start a new game.</p>}
          {activeDialog === "restart" && (
            <p>Are you sure want to restart the game?</p>
          )}
          {activeDialog === "gameover" && (
            <p>No more possible move available. Please restart the game.</p>
          )}
          <footer>
            <button
              style={{ marginBottom: 0 }}
              className="secondary"
              onClick={() => setActiveDialog("")}
            >
              Cancel
            </button>
            <button style={{ marginBottom: 0 }} onClick={() => restart()}>
              Restart
            </button>
          </footer>
        </article>
      </dialog>
    </div>
  );
}

export default App;
