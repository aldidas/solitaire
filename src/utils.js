import flatten from "lodash/flatten";
import { TEMPLATES } from "./constants";

export const generateGameState = (type = "pyramid") => {
  return TEMPLATES[type];
};

export const statusWatcher = (gameState) => {
  let availableMoves = 0;
  gameState.forEach((row, r) => {
    row.forEach((item, i) => {
      if (item === "1") {
        const north = {
          x: i,
          y: r - 1,
        };
        const northA = {
          x: i,
          y: r - 2,
        };
        const nVal = gameState[north.y]?.[north.x];
        const naVal = gameState[northA.y]?.[northA.x];
        if (nVal && nVal === "1" && naVal && naVal === "0") availableMoves += 1;
        const west = {
          x: i - 1,
          y: r,
        };
        const westA = {
          x: i - 2,
          y: r,
        };
        const wVal = gameState[west.y]?.[west.x];
        const waVal = gameState[westA.y]?.[westA.x];
        if (wVal && wVal === "1" && waVal && waVal === "0") availableMoves += 1;
        const south = {
          x: i,
          y: r + 1,
        };
        const southA = {
          x: i,
          y: r + 2,
        };
        const sVal = gameState[south.y]?.[south.x];
        const saVal = gameState[southA.y]?.[southA.x];
        if (sVal && sVal === "1" && saVal && saVal === "0") availableMoves += 1;
        const east = {
          x: i + 1,
          y: r,
        };
        const eastA = {
          x: i + 2,
          y: r,
        };
        const eVal = gameState[east.y]?.[east.x];
        const eaVal = gameState[eastA.y]?.[eastA.x];
        if (eVal && eVal === "1" && eaVal && eaVal === "0") availableMoves += 1;
      }
    });
  });
  const itemLeft = flatten(gameState).filter((i) => i === "1");
  return {
    availableMoves,
    itemLeft: itemLeft.length,
  };
};
