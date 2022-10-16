import { useState, useEffect, useCallback } from "react";
import classnames from "classnames";
import UIfx from "uifx";
import { generateGameState, statusWatcher, throttle } from "./utils";
import { SIZE, BOARD_SIZE, TEMPLATES, ICONS } from "./constants";
import wehWehSound from "./audios/weh-weh.mp3";
import epicSound from "./audios/epic.mp3";
import undoImg from "./images/undo.png";

import "./App.css";

// const splat = new UIfx(splatSound);
const wehWeh = new UIfx(wehWehSound);
const epic = new UIfx(epicSound);

function App() {
  const [scale, setScale] = useState(1);
  const [undoTree, setUndoTree] = useState([]);
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

  const undo = useCallback(() => {
    const count = undoTree.length;
    if (count < 1) return false;
    const withoutLast = undoTree.slice(0, -1);
    const targetStateIndex = withoutLast.length - 1;
    const stateCheck = undoTree[targetStateIndex];
    const targetState = stateCheck || TEMPLATES[type];

    setUndoTree(withoutLast);
    setGameState(targetState);
  }, [undoTree, type, setUndoTree, setGameState]);

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
      // splat.play();
      setGameState(stateAfterBetween);
      setUndoTree(prev => [...prev, stateAfterBetween]);
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
    setUndoTree([]);
    clearActive();
  }, [type, clearActive]);

  useEffect(() => {
    restart();
  }, [type, restart]);

  useEffect(() => {
    clearActive();
    const { availableMoves, itemLeft } = statusWatcher(gameState);
    if (itemLeft === 1) {
      epic.play();
      setActiveDialog("win");
    } else if (step > 0 && availableMoves < 1) {
      wehWeh.play();
      setActiveDialog("gameover");
    }
  }, [step, gameState, clearActive, setActiveDialog]);

  useEffect(() => {
    const newGameState = generateGameState();
    setGameState(newGameState);

    const watchWindowSize = throttle(() => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const aspectRatio = BOARD_SIZE / (BOARD_SIZE + 45);
      const viewPortAspectRatio = windowWidth / windowHeight;
      if (windowWidth < BOARD_SIZE || windowHeight < BOARD_SIZE + 45) {
        const curScale =
          viewPortAspectRatio < aspectRatio
            ? windowWidth / BOARD_SIZE
            : windowHeight / (BOARD_SIZE + 45);
        setScale(curScale);
      } else {
        setScale(1);
      }
    }, 500);
    watchWindowSize();
    window.addEventListener("resize", watchWindowSize);
    return () => window.removeEventListener("resize", watchWindowSize);
  }, []);

  return (
    <div className="AppWrap">
      <div
        className="App"
        style={{
          width: BOARD_SIZE,
          height: BOARD_SIZE + 45,
          transform: `translate3d(-50%, -50%, 0) scale(${scale})`,
        }}
      >
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
            <button
              className="icon"
              disabled={undoTree.length < 1}
              style={{ backgroundImage: `url(${undoImg})` }}
              onClick={() => undo()}
            >
              Undo
            </button>
            <button onClick={() => setActiveDialog("restart")}>Restart</button>
            <div style={{ padding: "0 1rem" }}>
              <small>{`Move: ${step}`}</small>
            </div>
          </div>
          <div>
            {Object.keys(TEMPLATES).map(item => {
              return (
                <button
                  className="icon"
                  style={{
                    backgroundColor:
                      item === type
                        ? "rgb(16, 149, 193)"
                        : "rgba(255, 255, 255, 0.1)",
                    backgroundImage: `url(${ICONS[item]})`,
                  }}
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
            {activeDialog === "win" && (
              <p>Click restart to start a new game.</p>
            )}
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
    </div>
  );
}

export default App;
