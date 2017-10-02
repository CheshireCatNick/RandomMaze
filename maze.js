'use strict';

const length = 30;
const width = 30;
const maze = [];
const visualizeMaze = [];
const startCell = {
	x: 0,
	y: 0
};
const stack = [];
const path = [];
const directions = [
	{x: 1, y: 0},
	{x: -1, y: 0},
	{x: 0, y: 1},
	{x: 0, y: -1}
];
const mirror = [1, 0, 3, 2];

function printMaze() {
	for (let i = 0; i < length; i++) {
		for (let j = 0; j < width; j++)
			process.stdout.write(maze[i][j] + ' ');
		console.log();
	}
}
function hasUnvisitedCell() {
	for (let i = 0; i < length; i++) 
		for (let j = 0; j < width; j++)
			if (maze[i][j] === 0)
				return true;
	return false;
}
function removeWall(cell, chosenCell, direction) {
	visualizeMaze[cell.x][cell.y][direction] = 0;
	visualizeMaze[chosenCell.x][chosenCell.y][mirror[direction]] = 0;
}
// TODO: randomize
function pickAnUnvisitedNeighbor(cell) {
	let x = cell.x;
	let y = cell.y;
	const candidates = [];
	for (let i = 0; i < 4; i++) {
		let checkCell = {
			x: x + directions[i].x,
			y: y + directions[i].y
		};
		// check boundary
		if (checkCell.x < 0 || checkCell.y < 0 || 
				checkCell.x >= length || checkCell.y >= width)
			continue;
		if (maze[checkCell.x][checkCell.y] === 0) {
			candidates.push({
				cell: checkCell,
				direction: i
			});
		}
	}
	if (candidates.length === 0) return null;
	let r = Math.floor((Math.random() * candidates.length));
	removeWall(cell, candidates[r].cell, candidates[r].direction);
	return candidates[r].cell;
}
function printPath() {
	for (let i = 0; i < path.length; i++) {
		let p = path[i];
		console.log(`there is a path from (${p.from.x}, ${p.from.y}) to (${p.to.x}, ${p.to.y})`);
	}
}
function visualize() {
	// print the top of the maze
	console.log('___'.repeat(width));
	// print the cell one by one
	for (let x = 0; x < length; x++) {
		// print left-most wall
		process.stdout.write('|');
		// print |
		for (let y = 0; y < width; y++) {
			let wall = visualizeMaze[x][y];
			//process.stdout.write('__|');
			if (wall[0] === 0 && wall[2] === 0) 
				process.stdout.write('   ');
			else if (wall[0] === 0)
				process.stdout.write('  |');
			else if (wall[2] === 0)
				process.stdout.write('__ ');
			else
				process.stdout.write('__|');
		}
		console.log();
	}
}

// init maze map and visualize map
for (let i = 0; i < length; i++) {
	maze.push([]);
	visualizeMaze.push([]);
	for (let j = 0; j < width; j++) {
		maze[i].push(0);
		visualizeMaze[i].push([1, 1, 1, 1]);
	}
}
printMaze();
// init starting point as visited
maze[startCell.x][startCell.y] = 1;
let currentCell = startCell;
while (hasUnvisitedCell()) {
	let nextCell = pickAnUnvisitedNeighbor(currentCell);
	if (nextCell !== null) {
		// remove the wall and record the path
		path.push({
			from: currentCell,
			to: nextCell
		});
		// push current cell to stack
		stack.push(currentCell);
		// set it as current cell and mark it as visited
		currentCell = nextCell;
		maze[currentCell.x][currentCell.y] = 1;
	}
	else if (stack.length > 0) {
		// pop a cell from stack and set it as current cell
		currentCell = stack.pop();
	}
}
printMaze();
printPath();
visualize();
