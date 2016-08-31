var grid = [[0,0,0], [0,0,0], [0,0,0]];
var grid_ids = [['#a1','#a2','#a3'], ['#b1','#b2','#b3'], ['#c1','#c2','#c3']];
var score;

$(document).ready(function(){
	score = load_score();

	$(grid_ids[0][0]).on('click', function(){ turn(0,0,1); });
	$(grid_ids[0][1]).on('click', function(){ turn(0,1,1); });
	$(grid_ids[0][2]).on('click', function(){ turn(0,2,1); });
	$(grid_ids[1][0]).on('click', function(){ turn(1,0,1); });
	$(grid_ids[1][1]).on('click', function(){ turn(1,1,1); });
	$(grid_ids[1][2]).on('click', function(){ turn(1,2,1); });
	$(grid_ids[2][0]).on('click', function(){ turn(2,0,1); });
	$(grid_ids[2][1]).on('click', function(){ turn(2,1,1); });
	$(grid_ids[2][2]).on('click', function(){ turn(2,2,1); });
});

function load_score(){
	var stored_scores = get_score();
	if( stored_scores == null ){
		stored_scores = set_score(null);
	} 
	displayScoreboard(stored_scores);
	return stored_scores;
}

function set_score(the_score){	
	if( the_score == null ){
		score = { win: 0, lose: 0, draw: 0 };
		the_score = score;
	} 

	localStorage.setItem('tictactoe_score', JSON.stringify(the_score))
	return the_score;
}

function get_score(){
	return JSON.parse( localStorage.getItem('tictactoe_score') );
}

function displayScoreboard(the_score){
	$('#playerScore').empty();
	$('#aiScore').empty();
	$('#draws').empty();

	$('#playerScore').append(the_score['win']);
	$('#aiScore').append(the_score['lose']);
	$('#draws').append(the_score['draw']);
}

function turn(x, y, val){
	if( grid[x][y] == 0){

		grid[x][y] = val;

		if( val == 1 ){
			$(grid_ids[x][y]).empty();
			$(grid_ids[x][y]).append(
				"<i class='glyphicon glyphicon-remove'></i>"
				);
			if( win(1) ){
				alert('YOU WIN!');
				updateScore(1);
			} 
			else if( draw() ){
				alert('DRAW!');
				updateScore(0);
			}
			else {
				get_computer_turn();
			}

		}
		else if(val == -1){
			$(grid_ids[x][y]).empty();
			$(grid_ids[x][y]).append(
				"<i class='glyphicon glyphicon-unchecked'></i>"
				);
			if( win(-1) ){
				alert('I WIN!');
				updateScore(-1);
			} 
			else if( draw() ){
				alert('DRAW!');
				updateScore(0);
			}
		}
	}
}

function get_computer_turn(){
	var x = -1;
	var y = -1;
	var moveFound = false;

	//check if ai has winning move available and win
	for(var i=0; i<3; i++){
		for(var k=0; k<3; k++){
			if( canWinOrBlock(i, k, -2) ){
				moveFound = true;
				x = i;
				y = k;
				break;
			}
		}
		if(moveFound){ break; }
	}
	//check if ai can block user from winning
	for(var i=0; i<3 && !moveFound; i++){
		for(var k=0; k<3 && !moveFound; k++){
			if( canWinOrBlock(i, k, 2) ){
				moveFound = true;
				x = i;
				y = k;
				break;
			}
		}
		if(moveFound){ break; }
	}


	//check if middle is available
	if(grid[1][1] == 0 && !moveFound){ 
		x = 1;
		y = 1;
		moveFound = true;
	}

	//go to next available
	if(!moveFound){
		var i=0, k=0;
		while( x == -1 && y == -1){
			if(grid[i][k] == 0){ x = i; y = k; }
			else if(grid[i][k+1] == 0){ x = i; y = k+1; }
			else if(grid[i][k+2] == 0){ x = i; y = k+2; }
			else{ i++; }
		}
	}


	return turn(x, y, -1);
}

function win(val){
	var result = false;

	//top row
	if( grid[0][0] == val && grid[0][1] == val && grid[0][2] == val){ result = true; }

	//middle row
	else if( grid[1][0] == val && grid[1][1] == val && grid[1][2] == val){ result = true; }

	//bottom row
	else if( grid[2][0] == val && grid[2][1] == val && grid[2][2] == val){ result = true; }

	//left column
	else if( grid[0][0] == val && grid[1][0] == val && grid[2][0] == val){ result = true; }

	//middle column
	else if( grid[0][1] == val && grid[1][1] == val && grid[2][1] == val){ result = true; }

	//right column
	else if( grid[0][2] == val && grid[1][2] == val && grid[2][2] == val){ result = true; }

	//forward diagonal
	else if( grid[0][0] == val && grid[1][1] == val && grid[2][2] == val){ result = true; }

	//backward diagonal
	else if( grid[0][2] == val && grid[1][1] == val && grid[2][0] == val){ result = true; }

	return result;
}

function draw(){
	/***
		Checks to see if all squares have been played
		Does not check if there is a win, this should be checked 
			before calling this function
	***/
	var result = true;

	for(var i=0; i<3; i++){
		for(var k=0; k<3; k++){
			if(grid[i][k] == 0){
				result = false;
			}
		}
	}

	return result;
}

function updateScore(val){
	if(val == 1){
		score.win += 1
	}
	else if(val == 0){
		score.draw += 1
	}
	else if(val == -1){
		score.lose += 1
	}

	grid = [[0,0,0], [0,0,0], [0,0,0]];
	set_score(score);
	displayScoreboard(score);
	reset_game();
}

function reset_game(){
	setTimeout(function(){
		for(var i=0; i<3; i++){
			for(var k=0; k<3; k++){
				$(grid_ids[i][k]).empty();
				$(grid_ids[i][k]).append("<i class='glyphicon glyphicon-stop'></i>");
			}
		}
	}, 1000);
	
}

function canWinOrBlock(x, y, val){
	var result = false;

	if(grid[x][y] == 0){
		if( onForwardDiagonal(x, y) && sumForwardDiagonal() == val ){	result = true; }
		else if( ( sumRow(grid[x]) == val ) || ( sumCol(y) == val) ){ result = true; }
		else if( onBackwardDiagonal(x,y) && sumBackwardDiagonal() == val ){ result = true; }
	}
	

	return result;
}

function sumRow(row){
	return row.reduce( (a,b) => a+b, 0);
}

function sumCol(y){
	var sum = 0;
	for(var i=0; i<3; i++){
		sum += grid[i][y];
	}

	return sum;
}

function sumForwardDiagonal(){
	return grid[0][0] + grid[1][1] + grid[2][2];
}

function sumBackwardDiagonal(){
	return grid[0][2] + grid[1][1] + grid[2][0];
}

function onBackwardDiagonal(x, y){
	var result = false;
	if( (x == 1 && y == 1) || (x == 0 && y == 2) || (x == 2 && y == 0) ){
		result = true;
	}

	return result;
}

function onForwardDiagonal(x, y){
	var result = false;
	if( (x == 1 && y == 1) || (x == 0 && y == 0) || (x == 2 && y == 2)){
		result = true;
	}

	return result;
}