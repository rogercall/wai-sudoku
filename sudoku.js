function isValidArray(array, msg){
	//input: an array and a debug message
	//return: none
	//checks if array is in fact an array.  if not alerts user
	//used to help enforce typing issues
	if (Object.prototype.toString.call(array) === '[object Array]') {
		return;
	}
	else{
		alert("Expected an array at function " + msg);
		return;
	}
}

function copyBoard(board){
	//input: board to be copied
	//returns: copied board
	//copys a 9x9 array by value.
	var newBoard = [];
	for (var i=0; i<9;i++){
		var row = [];
		for (var j=0; j<9;j++){
			row[j]=board[i][j];
		}
		newBoard[i] = row;
	}
	return newBoard;
}
 
function loadNextBoard(){
	//input: none
	//returns: none
	//the game has one board loaded at a time
	//this function cycles through the currently selected board
	//boards are pre-loaded in globalVars.js
	puzzleNumber = (puzzleNumber+1) % boards.length;
	board = copyBoard(boards[puzzleNumber]);
	solvedBoard = solvedBoards[puzzleNumber];
	originalBoard = board;
}

function printArray(board){
	//inputs: none
	//returns: none
	//prints out the input array
	//DEPRECATED but useful for debugging
    for(var i=0;i<board.length;i++){
        console.log(board[i]);
        }
}

function printBoard(){
	//inputs: none
	//returns: none
	//prints out the current board state
	//DEPRECATED but useful for debugging
	for(var i=0;i<board.length;i++){
		console.log(board[i]);
	}
}

function point(row, col){
	//this is a data type to represent a point
	//which holds a row value and column value
	//given row and column returns dict of obvious form
	this.row = row;
	this.col = col;
}

function printPoints(points){
	//input: an array of points
	//returns: none
	//prints the array of points
	//currently deprecated
	isValidArray(points,"printPoints");
	for (var i = 0; i < points.length; i++){
		//console.log([points[i].row,points[i].col]);
	}
}

function getBox(box){
	//input: box number
	//returns: the indices as an array of points contained in a given 3x3 box
	//box numbering format:
	//012
	//345
	//678
	var indices = new Array;
	//calculate columns of box geometrically from box number
	var colCoord = box % 3;
	var rowCoord = 0;
	if(box < 3){ rowCoord = 0; }
	else if(box < 6){rowCoord = 1; }
	else if(box < 9){rowCoord = 2; }
	
	for(var i = 0; i < 3; i++){
		for(var j = 0; j < 3; j++){
			var p = new point(3*rowCoord+i,3*colCoord+j);
			indices.push(p);
		}
	}	
	return indices;
}

function getRow(row){
	//input: row number
	//returns: the indices as an array of points contained in a given row
	var indices = new Array;
	for(j = 0; j < 9; j++){
			var p = new point(row,j);
			indices.push(p);
	}	
	return indices;
}

function getCol(col){
	//input: column number
	//returns: the indices as an array of points contained in a given column
	var indices = new Array;
	for(var i = 0; i < 9; i++){
			var p = new point(i,col);
			indices.push(p);
	}	
	return indices;
}

function point2Box(point){
	//input: a point
	//returns: which box the point is in, 0:8
	var box = 0;
	if(point.row < 3){
		if(point.col < 3){ box = 0; }
		else if(point.col < 6){ box = 1; }
		else if(point.col < 9){ box = 2; }
	}
	
	else if(point.row < 6){
		if(point.col < 3){ box = 3; }
		else if(point.col < 6){ box = 4; }
		else if(point.col < 9){ box = 5; }
	}
	
	else if(point.row < 9){
		if(point.col < 3){ box = 6; }
		else if(point.col < 6){ box = 7; }
		else if(point.col < 9){ box = 8; }
	}
	return box;
}

//input: a point
//returns: which row, 0:8 it's in
function point2Row(point){ return point.row; }

//input: a point
//returns: which column, 0:8 it's in
function point2Col(point){ return point.col; }

function find(points, number){
	//inputs: an array of points and a given sudoku value
	//returns: a subset of the the input array consisting of
	//all the points it contains that are that number on the board
	isValidArray(points,"find");
    var subpoints = new Array;
    var count = 0;
    for (var i=0;i<points.length;i++){
		var currentRow = points[i].row;
		var currentCol = points[i].col;
		if (board[currentRow][currentCol] == number){
			subpoints.push(points[i]);      
		}
    }
    return subpoints;
}

function countNum(points, number){
	//inputs: an array of points and a given sudoku value
	//returns: how many instances of the number there is in the array of points
	isValidArray(points,"countNum");
	var myPoints = find(points, number);
	return myPoints.length;
}

function contains(points, number){
	//inputs: an array of points and a given sudoku value
	//returns: true/false for whether the number is in the array of points
	isValidArray(points,"contains");
	var numInstances = countNum(points, number);
	if(numInstances > 0){ return true; }
	else { return false; }
}

function sortWIndices(vec, cmp){
	//input: an array of things that can be compared via "<"
	//returns: [the permutation you apply that sorts the array, the sorted vector]
	isValidArray(vec,"sortWIndices");
    var data = [];
    for (var i=0;i<vec.length;i++){
        data[i]=[vec[i],i];
    }
    data.sort(cmp);
    var inds = [];
    var vals = [];
    for (var i=0;i<data.length;i++){
        inds[i]=data[i][1];
        vals[i]=data[i][0];
    }
    return [vals,inds];
    //console.log(inds);
    //console.log(vals);
}

function cmp(a,b){
	//input: two things to be compared
	//output: a number used to compare with
	//functions as a "<" operator for comparisons
    return a[0]-b[0];
}

function cmpKillZeros(a,b){
	//input: two things to be compared
	//output: a number used to compare with
	//functions as a "<" operator for comparisons
	//in some contexts 0 should be 'high': in particular, a row with no missing entries
	//should not be a high priority row to work on
   if (a[0]==0){
       return 1;
   }
   else if (b[0]==0){
       return -1;
   }
   return a[0]-b[0];
}

function findLeastMissingRows(){
	//inputs: none
	//returns: [the rows ranked in order of least missing, the number of missing entries]
    var counts=[];
    for (var row=0;row<board.length;row++){
        var selection = getRow(row);
        var nMissing = countNum(selection,0);
        counts[row]=nMissing;
    }
    var sorted = sortWIndices(counts, cmpKillZeros);
    var rows = sorted[1];
    var cts = sorted[0];
	return [rows,cts];
}

function findLeastMissingCols(){
	//inputs: none
	//returns: [the cols ranked in order of least missing, the number of missing entries]
    var counts=[];
    for (var j=0;j<board.length;j++){
        var selection = getCol(j);
        var nMissing = countNum(selection,0);
        counts[j]=nMissing;
    }
    var sorted = sortWIndices(counts, cmpKillZeros);
    var cols = sorted[1];
    var cts = sorted[0];
	return [cols,cts];
}

function findLeastMissingBoxes(){
	//inputs: none
	//returns: [the boxes ranked in order of least missing, the number of missing entries]
    var counts=[];
    for (var k=0;k<board.length;k++){
        var selection = getBox(k);
        var nMissing = countNum(selection,0);
        counts[k]=nMissing;
    }
    var sorted = sortWIndices(counts, cmpKillZeros);
    var boxes = sorted[1];
    var cts = sorted[0];
	return [boxes,cts];
}

function bestOptions(n){
	//inputs: an int n
	//returns: [the  
	//used to toggle through the best row/column/box
	//CURRENTLY NOT USED
	var options = findBestOptions();
	//console.log("The best option number ",n, " is",options[0][n-1] , options[1][n-1], "with ", options[2][n-1], "missing");
	return [options[0][n-1],options[1][n-1],options[2][n-1]];
}

function getBoard(){
	//inputs: none
	//returns: the entire board as an array of points
	var points = new Array;
	for(var i = 0; i < board.length; i++){
		for(var j = 0; j < board[0].length; j++){
			var newPoint = new point(i,j);
			points.push(newPoint);
		}
	}
	return points
}

function findBestOptions(){
	//outputs [types,inds,cts], each in order from best to words
	//types = 'row' / 'col' / 'box'
	//inds = 0:8
	//cts = how many missing
	//CURRENTLY NOT USED
    var counts = new Array;
    var i=0;
    for (i=0;i<board.length;i++){
        
        // select points in row/col/box
        var pointsRow = getRow(i);
        var pointsCol = getCol(i);
        var pointsBox = getBox(i);
        
        // count the number missing in selection
        var nMissingRow = countNum(pointsRow,0);
        var nMissingCol = countNum(pointsCol,0);
        var nMissingBox = countNum(pointsBox,0);
     
        // push these onto the counts
        counts.push([nMissingRow,'row',i]);
        counts.push([nMissingCol,'col',i]);
        counts.push([nMissingBox,'box',i]);
        
    }
    
    // sort by nMissing
    counts.sort(cmpKillZeros)
    
    var cts   = [];
    var types = [];
    var inds  = [];
    
    for (i=0;i<counts.length;i++){
        cts[i]   = counts[i][0];
        types[i] = counts[i][1];
        inds[i]  = counts[i][2];
    }

    return [types,inds,cts];
}

function bestRowOptions(n){
	//input: an integer n
	//returns: [the n-th most filled row, how many entries are missing] 
	//filled rows are bottom priority for obvious reasons
    var options = findLeastMissingRows();
    //console.log("The best option number ",n, " is row " , options[0][n-1], "with ", options[1][n-1], "missing");
    return [options[0][n-1],options[1][n-1]];
}

function bestColOptions(n){
	//input: an integer n
	//returns: [the n-th most filled col, how many entries are missing]
	//filled columns are bottom priority for obvious reasons
    var options = findLeastMissingCols();
    //console.log("The best option number ",n, " is column " , options[0][n-1], "with ", options[1][n-1], "missing");
    return [options[0][n-1],options[1][n-1]];
}

function bestBoxOptions(n){
	//input: an integer n
	//returns: [the n-th most filled box, how many entries are missing]
	//filled boxes are bottom priority for obvious reasons
    var options = findLeastMissingBoxes();
    //console.log("The best option number ",n, " is box " , options[0][n-1], "with ", options[1][n-1], "missing");
    return [options[0][n-1],options[1][n-1]];
}

function findMissingNumbers(points){
	//input: an array of points
	//returns: what sudoku numbers are not in those points
	isValidArray(points,"findMissingNumbers");
	var i = 0;
	var missingNumbers = [];
	for(i = 1; i < board.length+1; i++){
		if(!contains(points, i)){
			missingNumbers.push(i);
		}
	}
	return missingNumbers;
}

function getRows(points){
	//input: selection
	//returns: rows the selected points are in, w/o duplicates
	//NOT CURRENTLY USED
	isValidArray(points,"getRows");
	var rows = new Array;
	for(var i = 0; i < points.length; i++){
		rows.push(point2Row(points[i]));
	}
	rows.sort();
	var curr=-1;
	var cleanRows=[];
	for (var i=0; i<rows.length; i++){
		if (rows[i]!=curr){
			cleanRows.push(rows[i]);
			curr=rows[i];
		}
	}
	return cleanRows;
}

function getCols(points){
	//input: selection
	//returns: Cols the selected points are in, w/o duplicates
	//NOT CURRENTLY USED
	isValidArray(points,"getCols");
	var cols = new Array;
	for(var j = 0; j < points.length; j++){
		cols.push(point2Col(points[j]));
	}
	cols.sort();
	var curr=-1;
	var cleanCols=[];
	for (var j=0; j<cols.length; j++){
		if (cols[j]!=curr){
			cleanCols.push(cols[j]);
			curr=cols[j];
		}
	}
	return cleanCols;
}

function getBoxes(points){
	//input: selection
	//returns: boxes the selected points are in, w/o duplicates
	//NOT CURRENTLY USED
	isValidArray(points,"getBoxes");
	var boxes = new Array;
	for(var i = 0; i < points.length; i++){
		boxes.push(point2Box(points[i]));
	}
	boxes.sort();
	var curr=-1;
	var cleanBoxes=[];
	for (var i=0; i<boxes.length; i++){
		if (boxes[i]!=curr){
			cleanBoxes.push(boxes[i]);
			curr=boxes[i];
		}
	}
	return cleanBoxes;
}

function getValue(point){
	//input: a point
	//returns: the sudoku value at the point
	return board[point.row][point.col];
}

function getValues(points){
	//input: an array of points
	//returns: an array containing the values in the points
	isValidArray(points,"getValues");
	var vals = new Array;
	for(var i = 0; i < points.length; i++){
		vals.push(getValue(points[i]));
	}
	return vals;
}

function checkBoardValidity(){
	//checks if board is in a valid configuration
	//returns [validity, mistakes]
	//NOT CURRENTLY USED (we presently just check against the solution board)
    var valid = 1;
    var mistakes = [];
    
    //cycle through all the points
    for (var i=0;i<board.length;i++){
        for (var j=0;j<board.length;j++){
            
            // the the row/col/box and value of the point
            p = new point(i,j);
            var val = getValue(p);
            var row = getRow(point2Row(p));
            var col = getCol(point2Col(p));
            var box = getBox(point2Box(p));
            
            if (val != 0){
            // set board as invalid and push the point onto the mistakes array if invalid
            if (countNum(row,val) > 1){
                valid = 0;
                mistakes.push(p);
            }
            else if (countNum(col,val) > 1){
                valid = 0;
                mistakes.push(p);
            }
            else if (countNum(box,val) > 1){
                valid = 0;
                mistakes.push(p);
            }
                
            } 
                        
        }
    }
    return valid;
}

function updateBoard(row, col, number){
	//inputs: a row, a column, and a sudoku value
	//returns: true iff array successfully changed	
	//updates the board at the point to the number
	//does not let you overwrite original values
	//and at the moment does not let you make invalid moves
	if(originalBoard[row][col] == 0 & solvedBoard[row][col] == number){
		board[row][col] = number;
		return true;
	}
	else{
		return false;
	}
}	

function select(type, num){
	//inputs: a type of the form "row"/"col"/"box" and the number of it 0:8
	//returns: an array of the points in the given zone.
	var sel = [];
    if (type=="row"){
        sel = getRow(num);
    }
    else if (type=="col"){
        sel = getCol(num);
    }
    else if (type=="box"){
        sel = getBox(num);
    }
    //console.log(type, num, "selected");
    isValidArray(sel,"select");
    return sel;
}

function goTo(i,j){
	//input: row i, col j
	//returns: a point as a singleton array consisting of the point(i,j)
    p = new point(i,j);
    return [p]
}

function read(selection){
	//input: an array of values
	//returns: an array of values corresponding to the selection
	//in current form is unnecessary as it just calls getValues
	isValidArray(selection,"read");
	var values = getValues(selection);  
	//console.log(values);
	return values;
}

function canFillPoint(row, col){
	//inputs: a row and column
	//returns: 1 if original board and current board are empty
	//returns: 0 if original board is empty and current board is not 
	//returns: 0 if original board is full
	//essentially, reports whether a user can put in a new value at the given point
	//the functionality here will change if we intend to let the user make mistakes
	//which we currently do not so the user will never need to override their past guesses
	if(originalBoard[row][col] == 0 & board[row][col] == 0){
		return 1;
	}
	else{
		return 0;
	}
}

function checkInput(row, col, number){
	//input: a row, column, and sudoku value
	//returns: 1 iff desired input is correct by checking against the true solution
	if(solvedBoard[row][col] == number){
		return 1;
	}
	else{
		return 0;
	}
}

function getBoardAsArray(){
	//inputs: none
	//returns: the board array
	return board;
}

function getCorrectValues(points){
	//inputs: array of points
	//returns: an array of the correct values at those points
    var values = [];
    for (var i=0;i<points.length;i++){
        var p = points[i];
        var row = point2Row(p);
        var col = point2Col(p);
        values[i] = solvedBoard[row][col];
    }
    return values;
}

function checkSolved(){
	//inputs: none
	//returns: true iff the board is solved

	//does this easily by seeing if any blanks are left
	//obviously if we let the user make mistakes we have to compare also
	//against the true solution
    var missing = countNum(getBoard(),0);
    return (missing==0);
}

function fillRandom(points){
	//input: an array of points
	//returns: the changed point
	//solves a random point out of the selection
	//returns false if failed to change point (e.g. if selection is full)
	//NOT CURRENTLY USED
    var blanks = find(points,0);
    var p
    if (blanks.length>0){
        var rand = Math.floor(Math.random()*(blanks.length));
        p = blanks[rand];
        var correctVal = getCorrectValues([p])[0];
        updateBoard(p.row, p.col,correctVal);
        return p;
        }
	return 0;
}

function solve(){
	//solves the sudoku puzzle
	//NOT CURRENTLY USED
    var nMissing = countNum(getBoard(),0);
    for (var i=0; i<nMissing; i++){
        fillRandom(getBoard());
    }
}
