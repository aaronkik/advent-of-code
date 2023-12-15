import { resolve } from "node:path";
import { readTextFileByPath } from "../../helpers";
import { writeFile } from "node:fs";

type Location = {
  x: number;
  y: number;
};

const inputPath = resolve(__dirname, "input.txt");

const STARTING_POINT = "S";
const GROUND = ".";

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

const constructVistedTilesMatrix = (tiles: Array<string>) => {
  return tiles.map((tiles) => {
    const tilesSplitByChar = tiles.split("") as Array<keyof typeof TILES>;
    return [
      ...tilesSplitByChar.map((char) => ({
        char,
        visited: false,
        iteration: -1,
      })),
    ];
  });
};

// const getValidSurroundingTiles = ({
//   tileLocation,
//   tiles,
//   isOutOfBounds,
// }: {
//   tileLocation: Location;
//   tiles: ReturnType<typeof constructVistedTilesMatrix>;
//   isOutOfBounds: (location: Location) => boolean;
// }) => {
//   const { x, y } = tileLocation;
//   const northLocation = { x, y: y - 1 };
//   const eastLocation = { x: x + 1, y };
//   const southLocation = { x, y: y + 1 };
//   const westLocation = { x: x - 1, y };

//   const isNorthLocationValid = !isOutOfBounds(northLocation);
//   const northChar = isNorthLocationValid ? tiles[northLocation.y][northLocation.x].char : undefined;
//   const northCharVisited = isNorthLocationValid ? tiles[northLocation.y][northLocation.x].visited : undefined;

//   const isEastLocationValid = !isOutOfBounds(eastLocation);
//   const eastChar = isEastLocationValid ? tiles[eastLocation.y][eastLocation.x].char : undefined;
//   const eastCharVisited = isEastLocationValid ? tiles[eastLocation.y][eastLocation.x].visited : undefined;

//   const isSouthLocationValid = !isOutOfBounds(southLocation);
//   const southChar = isSouthLocationValid ? tiles[southLocation.y][southLocation.x].char : undefined;
//   const southCharVisited = isSouthLocationValid ? tiles[southLocation.y][southLocation.x].visited : undefined;

//   const isWestLocationValid = !isOutOfBounds(westLocation);
//   const westChar = isWestLocationValid ? tiles[westLocation.y][westLocation.x].char : undefined;
//   const westCharVisited = isWestLocationValid ? tiles[westLocation.y][westLocation.x].visited : undefined;

//   return {
//     ...(northChar &&
//       !isStartingPoint(northChar) &&
//       isTile(northChar) &&
//       !northCharVisited && { north: { tile: northChar, location: northLocation } }),
//     ...(eastChar &&
//       !isStartingPoint(eastChar) &&
//       isTile(eastChar) &&
//       !eastCharVisited && { east: { tile: eastChar, location: eastLocation } }),
//     ...(southChar &&
//       !isStartingPoint(southChar) &&
//       isTile(southChar) &&
//       !southCharVisited && { south: { tile: southChar, location: southLocation } }),
//     ...(westChar &&
//       !isStartingPoint(westChar) &&
//       isTile(westChar) &&
//       !westCharVisited && { west: { tile: westChar, location: westLocation } }),
//   };
// };

const run = async () => {
  const input = await readTextFileByPath(inputPath);
  const tilesSplitByNewLine = input.split("\n");
  const visitedTilesMatrix = constructVistedTilesMatrix(tilesSplitByNewLine);

  const isOutOfBounds = (location: Location) =>
    location.x < 0 ||
    location.y < 0 ||
    location.x > tilesSplitByNewLine[0].length - 1 ||
    location.y > tilesSplitByNewLine.length - 1;

  const getValidSurroundingTiles = async (tileLocation: Location) => {
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

  const startingValidSurroundingTiles = await getValidSurroundingTiles(startingLocation);

  const completedTraversal: Array<Awaited<ReturnType<typeof constructVistedTilesMatrix>>> = [];
  // let nextValidTiles: ReturnType<typeof getValidSurroundingTiles> | undefined = undefined;

  let iteration = 0;

  const maxInterationLocation = new Map<number, Location>();

  const findLongestPath = async (surroundingValidTiles: Awaited<ReturnType<typeof getValidSurroundingTiles>>) => {
    const i = (iteration += 1);
    const surTiles = Object.entries(surroundingValidTiles);

    // if (surTiles.length === 0) {
    //   completedTraversal.push(visitedTilesMatrix);
    //   return;
    // }

    for (let index = 0; index < surTiles.length; index++) {
      const [, tile] = surTiles[index];

      // if (visitedTilesMatrix[tile.location.y][tile.location.x].visited) {
      //   console.log("visited");
      //   return;
      // }

      // const tileLocation = visitedTilesMatrix[tile.location.y][tile.location.x];
      visitedTilesMatrix[tile.location.y][tile.location.x].iteration = i;
      visitedTilesMatrix[tile.location.y][tile.location.x].visited = true;
      // visitedTilesMatrix[tile.location.y][tile.location.x].char = visitedTilesMatrix[tile.location.y][tile.location.x]
      //   .visited
      //   ? TILES[tile.tile].replacementChar
      //   : visitedTilesMatrix[tile.location.y][tile.location.x].char;

      maxInterationLocation.set(i, tile.location);

      const nextValidTiles = await getValidSurroundingTiles(tile.location);

      if (Object.keys(nextValidTiles).length > 0) {
        await findLongestPath(nextValidTiles);
      } else {
        completedTraversal.push(visitedTilesMatrix);
      }
    }
  };

  await findLongestPath(startingValidSurroundingTiles);

  console.log((iteration + 1) / 2);

  const textOutput = completedTraversal[0]
    .map((tiles) => {
      return tiles
        .map((tile) => {
          return tile.visited ? TILES[tile.char].replacementChar : tile.char;
        })
        .join("");
    })
    .join("\n");

  writeFile(`${__dirname}/output-silver.txt`, textOutput, { encoding: "utf8" }, (err) => {
    if (err) throw err;
  });
};

run();
