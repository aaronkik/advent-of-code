// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { resolve } from "node:path";
import { readTextFileByPath } from "../../helpers";
import { writeFile } from "node:fs";

interface Location {
  x: number;
  y: number;
}

const inputPath = resolve(__dirname, "input.txt");

const STARTING_POINT = "S";
const GROUND = ".";
const ENCLOSED_BY_LOOP = "I";
const NOT_ENCLOSED_BY_LOOP = "O";

const TILES = {
  S: {
    validConnections: ["NORTH", "EAST", "SOUTH", "WEST"],
    validNorthConnections: ["|", "7", "F"],
    validEastConnections: ["-", "7", "J"],
    validSouthConnections: ["|", "L", "J"],
    validWestConnections: ["-", "L", "F"],
    replacementChar: STARTING_POINT,
  },
  "|": {
    validConnections: ["NORTH", "SOUTH"],
    validNorthConnections: ["|", "7", "F"],
    validEastConnections: [],
    validSouthConnections: ["|", "L", "J"],
    validWestConnections: [],
    replacementChar: "|",
  },
  "-": {
    validConnections: ["EAST", "WEST"],
    validNorthConnections: [],
    validEastConnections: ["-", "7", "J"],
    validSouthConnections: [],
    validWestConnections: ["-", "L", "F"],
    replacementChar: "-",
  },
  L: {
    validConnections: ["NORTH", "EAST"],
    validNorthConnections: ["|", "7", "F"],
    validEastConnections: ["-", "7", "J"],
    validSouthConnections: [],
    validWestConnections: [],
    replacementChar: "┗",
  },
  J: {
    validConnections: ["NORTH", "WEST"],
    validNorthConnections: ["|", "7", "F"],
    validEastConnections: [],
    validSouthConnections: [],
    validWestConnections: ["-", "L", "F"],
    replacementChar: "┛",
  },
  "7": {
    validConnections: ["SOUTH", "WEST"],
    validNorthConnections: [],
    validEastConnections: [],
    validSouthConnections: ["|", "L", "J"],
    validWestConnections: ["-", "L", "F"],
    replacementChar: "┓",
  },
  F: {
    validConnections: ["SOUTH", "EAST"],
    validNorthConnections: [],
    validEastConnections: ["-", "7", "J"],
    validSouthConnections: ["|", "L", "J"],
    validWestConnections: [],
    replacementChar: "┏",
  },
} as const;

const isStartingPoint = (tile: string): tile is typeof STARTING_POINT => tile === STARTING_POINT;

const isTile = (tile: string): tile is keyof Omit<typeof TILES, "S"> => {
  if (tile === GROUND) return false;
  return Object.keys(TILES).includes(tile);
};

const constructVistedTilesMatrix = (tiles: string[]) => {
  return tiles.map((tiles) => {
    const tilesSplitByChar = tiles.split("") as (keyof typeof TILES)[];
    return [
      ...tilesSplitByChar.map((char) => ({
        char,
        visited: false,
        iteration: -1,
      })),
    ];
  });
};

const run = async () => {
  const input = await readTextFileByPath(inputPath);
  const tilesSplitByNewLine = input.split("\n");
  const visitedTilesMatrix = constructVistedTilesMatrix(tilesSplitByNewLine);

  const isOutOfBounds = (location: Location) =>
    location.x < 0 ||
    location.y < 0 ||
    location.x > tilesSplitByNewLine[0].length - 1 ||
    location.y > tilesSplitByNewLine.length - 1;

  const getValidSurroundingTiles = (tileLocation: Location) => {
    const { x, y } = tileLocation;
    const northLocation = { x, y: y - 1 };
    const eastLocation = { x: x + 1, y };
    const southLocation = { x, y: y + 1 };
    const westLocation = { x: x - 1, y };

    const currentTileChar = visitedTilesMatrix[y][x].char;

    const isNorthLocationValid = !isOutOfBounds(northLocation);
    const northChar = isNorthLocationValid ? visitedTilesMatrix[northLocation.y][northLocation.x].char : undefined;
    const northCharVisited = isNorthLocationValid
      ? visitedTilesMatrix[northLocation.y][northLocation.x].visited
      : undefined;

    const northCharCanConnect =
      isNorthLocationValid && northChar && isTile(northChar)
        ? TILES[currentTileChar].validNorthConnections.includes(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            visitedTilesMatrix[northLocation.y][northLocation.x].char,
          )
        : undefined;

    const isEastLocationValid = !isOutOfBounds(eastLocation);
    const eastChar = isEastLocationValid ? visitedTilesMatrix[eastLocation.y][eastLocation.x].char : undefined;
    const eastCharVisited = isEastLocationValid
      ? visitedTilesMatrix[eastLocation.y][eastLocation.x].visited
      : undefined;
    const eastCharCanConnect =
      isEastLocationValid && eastChar && isTile(eastChar)
        ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          TILES[currentTileChar].validEastConnections.includes(visitedTilesMatrix[eastLocation.y][eastLocation.x].char)
        : undefined;

    const isSouthLocationValid = !isOutOfBounds(southLocation);
    const southChar = isSouthLocationValid ? visitedTilesMatrix[southLocation.y][southLocation.x].char : undefined;
    const southCharVisited = isSouthLocationValid
      ? visitedTilesMatrix[southLocation.y][southLocation.x].visited
      : undefined;
    const southCharCanConnect =
      isSouthLocationValid && southChar && isTile(southChar)
        ? TILES[currentTileChar].validSouthConnections.includes(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            visitedTilesMatrix[southLocation.y][southLocation.x].char,
          )
        : undefined;

    const isWestLocationValid = !isOutOfBounds(westLocation);
    const westChar = isWestLocationValid ? visitedTilesMatrix[westLocation.y][westLocation.x].char : undefined;
    const westCharVisited = isWestLocationValid
      ? visitedTilesMatrix[westLocation.y][westLocation.x].visited
      : undefined;
    const westCharCanConnect =
      isWestLocationValid && westChar && isTile(westChar)
        ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          TILES[currentTileChar].validWestConnections.includes(visitedTilesMatrix[westLocation.y][westLocation.x].char)
        : undefined;

    return {
      ...(northChar &&
        !isStartingPoint(northChar) &&
        isTile(northChar) &&
        !northCharVisited &&
        northCharCanConnect && { north: { tile: northChar, location: northLocation } }),
      ...(eastChar &&
        !isStartingPoint(eastChar) &&
        isTile(eastChar) &&
        !eastCharVisited &&
        eastCharCanConnect && { east: { tile: eastChar, location: eastLocation } }),
      ...(southChar &&
        !isStartingPoint(southChar) &&
        isTile(southChar) &&
        !southCharVisited &&
        southCharCanConnect && { south: { tile: southChar, location: southLocation } }),
      ...(westChar &&
        !isStartingPoint(westChar) &&
        isTile(westChar) &&
        !westCharVisited &&
        westCharCanConnect && { west: { tile: westChar, location: westLocation } }),
    };
  };

  const startingLocation: Location = { x: 0, y: 0 };
  let startingLocationFound = false;

  visitedTilesMatrix.forEach((tiles, yIndex) => {
    if (startingLocationFound) return;
    tiles.forEach((tile, xIndex) => {
      if (startingLocationFound) return;
      if (tile.char === STARTING_POINT) {
        tile.visited = true;
        startingLocationFound = true;
        startingLocation.x = xIndex;
        startingLocation.y = yIndex;
      }
    });
  });

  const startingValidSurroundingTiles = getValidSurroundingTiles(startingLocation);

  const completedTraversal: ReturnType<typeof constructVistedTilesMatrix>[] = [];

  let iteration = 0;

  const findLongestPath = async (surroundingValidTiles: Awaited<ReturnType<typeof getValidSurroundingTiles>>) => {
    const i = (iteration += 1);
    const surTiles = Object.entries(surroundingValidTiles);

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let index = 0; index < surTiles.length; index++) {
      const [, tile] = surTiles[index];

      visitedTilesMatrix[tile.location.y][tile.location.x].iteration = i;
      visitedTilesMatrix[tile.location.y][tile.location.x].visited = true;

      const nextValidTiles = getValidSurroundingTiles(tile.location);

      if (Object.keys(nextValidTiles).length > 0) {
        await findLongestPath(nextValidTiles);
      } else {
        completedTraversal.push(visitedTilesMatrix);
      }
    }
  };

  await findLongestPath(startingValidSurroundingTiles);

  let numberOfEnclosedTiles = 0;

  visitedTilesMatrix.forEach((tiles, yIndex) => {
    tiles.forEach((tile, xIndex) => {
      if (!tile.visited) {
        const yColumn = visitedTilesMatrix.map((tiles) => tiles[xIndex]);

        const tileLeadsToNorthEdge = yColumn.slice(0, yIndex).every((tile) => !tile.visited);
        const tileLeadsToEastEdge = tiles.slice(xIndex).every((tile) => !tile.visited);
        const tileLeadsToSouthEdge = yColumn.slice(yIndex).every((tile) => !tile.visited);
        const tileLeadsToWestEdge = tiles.slice(0, xIndex).every((tile) => !tile.visited);

        // Can see an "edge" from this tile
        const tileLeadsToEdge =
          tileLeadsToNorthEdge || tileLeadsToEastEdge || tileLeadsToSouthEdge || tileLeadsToWestEdge;

        if (tileLeadsToEdge) {
          tile.char = NOT_ENCLOSED_BY_LOOP;
          return;
        }

        // const topLeftTile = visitedTilesMatrix[yIndex - 1]?.[xIndex - 1] || undefined;

        // if (topLeftTile && topLeftTile.visited === false) {
        //   tile.char = NOT_ENCLOSED_BY_LOOP;
        // }

        // const topRightTile = visitedTilesMatrix[yIndex - 1]?.[xIndex + 1] || undefined;

        // if (topRightTile && topRightTile.visited === false) {
        //   tile.char = NOT_ENCLOSED_BY_LOOP;
        // }

        // const bottomLeftTile = visitedTilesMatrix[yIndex + 1]?.[xIndex - 1] || undefined;

        // if (bottomLeftTile && bottomLeftTile.visited === false) {
        //   tile.char = NOT_ENCLOSED_BY_LOOP;
        // }

        // const bottomRightTile = visitedTilesMatrix[yIndex + 1]?.[xIndex + 1] || undefined;

        // if (bottomRightTile && bottomRightTile.visited === false) {
        //   tile.char = NOT_ENCLOSED_BY_LOOP;
        // }

        // const topLeftTile = visitedTilesMatrix[yIndex - 1]?.[xIndex - 1] || undefined;
        // const topTile = visitedTilesMatrix[yIndex - 1]?.[xIndex] || undefined;
        // const topRightTile = visitedTilesMatrix[yIndex - 1]?.[xIndex + 1] || undefined;

        // const rightTile = tiles[xIndex + 1] || undefined;
        // const leftTile = tiles[xIndex - 1] || undefined;

        // const bottomLeftTile = visitedTilesMatrix[yIndex + 1]?.[xIndex - 1] || undefined;
        // const bottomTile = visitedTilesMatrix[yIndex + 1]?.[xIndex] || undefined;
        // const bottomRightTile = visitedTilesMatrix[yIndex + 1]?.[xIndex + 1] || undefined;

        // const cornerTilesLeadToEdge =
        //   topLeftTileLeadsToEdge || topRightTileLeadsToEdge || bottomLeftTileLeadsToEdge || bottomRightTileLeadsToEdge;

        // if (cornerTilesLeadToEdge) {
        //   tile.char = NOT_ENCLOSED_BY_LOOP;
        //   return;
        // }

        tile.char = ENCLOSED_BY_LOOP;
        numberOfEnclosedTiles += 1;
      }
    });
  });

  console.log({ numberOfEnclosedTiles });

  const textOutput = completedTraversal[0]
    .map((tiles) => tiles.map((tile) => (tile.visited ? TILES[tile.char].replacementChar : tile.char)).join(""))
    .join("\n");

  writeFile(`${__dirname}/output-gold-ref.txt`, textOutput, { encoding: "utf8" }, (err) => {
    if (err) throw err;
  });
};

await run();
