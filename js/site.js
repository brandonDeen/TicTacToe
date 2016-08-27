var grid = [[0,0,0], [0,0,0], [0,0,0]];
var grid_ids = [['#a1','#a2','#a3'], ['#b1','#b2','#b3'], ['#c1','#c2','#c3']];
var score;

$(document).ready(function(){
	score = get_score();
	load_score(score);

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

function load_score(the_score){
	if( score == null ){
		set_score(null);
	} 
	else {
		$('#scoreboard').append(
			"<p><h3>Score</h3></p>"
			);
	}
}

function set_score(the_score){	
	if( the_score == null ){
		score = { win: 0, lose:0, draw: 0 };
		the_score = score;
	} 

	localStorage.setItem('tictactoe_score', JSON.stringify(the_score))
}

function get_score(){
	return JSON.parse( localStorage.getItem('tictactoe_score') );
}

function turn(x, y, val){
	if( grid[x][y] == 0){
		grid[x][y] = val;
		if( val == 1 ){
			$(grid_ids[x][y]).empty();
			$(grid_ids[x][y]).append(
				"<i class='glyphicon glyphicon-remove'></i>"
				);

			get_computer_turn();

		}
		else if(val == -1){
			$(grid_ids[x][y]).empty();
			$(grid_ids[x][y]).append(
				"<i class='glyphicon glyphicon-record'></i>"
				);
		}
	}
}

function get_computer_turn(){
	var x = 1;
	var y = 1;



	return turn(x, y, -1);
}

function win(){
	var result = false;


	return result;
}

function draw(){
	var result = false;


	return result;
}