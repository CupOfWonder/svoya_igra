$(document).ready(function() {
	init();
	
	function init() {
		var game = new Game();
		game.start();
		
		document.oncontextmenu = function() {return false;};
	}
});
function Game() {
	
	const ANIMATION_DURATION = 350;
	
	var prize = 0;
	
	var gameField = $("#game_field");
	var questField = $("#question");
	var victoryField = $("#victory");
	
	var tableQuestMap = {};
	
	var actionHistory = [];
	var answeredQuestions = [];

	this.start = function() {
		loadAndInitTable();
		refreshStats();
	}
	
	function loadAndInitTable() {
		var questions = loadQuestions();
		renderTable(questions);
	}
	
	function renderTable(questions) {
		var table = $("#main_table");
		
		for(theme in questions) {
			var tr = $("<tr></tr>");
			
			var themeTd = $("<td>"+theme+"</td>");
			tr.append(themeTd);
			
			questions[theme].forEach(function(q) {
				q.id = IdGenerator.newId();
				
				var td = tdForQuestion(q);
				tableQuestMap[q.id] = td;
				
				tr.append(td);
			});
			table.append(tr);
		}
		
		table.contextmenu(function() {
			undoAnswer();
		});
	}	
	
	function tdForQuestion(question) {
		var td = $("<td class='quest-td'></td>");
		initTd(td, question);
		return td;
	}
	
	function initTd(td, question) {
		td.click(function() {
			if(!questionAlreadyAnswered(question)) {
				showQuestion(question);				
			}
		});
		td.html(question.points);
	}
	
	function questionAlreadyAnswered(question) {
		return answeredQuestions.includes(question.id);
	}
	
	function refreshStats() {
		$("#prize").html(prize+" руб.");
	}
	
	function showQuestion(question) {
		gameField.animate({
			opacity: 0,
		}, ANIMATION_DURATION, 
		function() {
			gameField.hide();
			
			renewQuestHandlers(question);
			questField.html(question.text);
			questField.show();
			questField.animate({
				opacity: 1,
			}, ANIMATION_DURATION, function() {

			});
		});
	}
	
	function showGame() {
		questField.animate({
			opacity: 0,
		}, ANIMATION_DURATION, 
		function() {
			questField.hide();
			gameField.show();
			
			gameField.animate({
				opacity: 1,
			}, ANIMATION_DURATION, function() {
			});
		});
	}
	
	function showVictory() {
		questField.animate({
			opacity: 0,
		}, ANIMATION_DURATION, 
		function() {
			questField.hide();
			
			victoryField.show();
			victoryField.animate({
					opacity: 1
				}, ANIMATION_DURATION);
		});
	}
	
	function renewQuestHandlers(question) {
		questField.unbind();
		questField.click(function() {
			questionWasAnswered(question, true);
		});
		questField.contextmenu(function() {
			questionWasAnswered(question, false);
		});
	}
	
	function questionWasAnswered(question, right) {
		var answer = new Answer();
		answer.answeredQuestion = question;
		answer.right = right;
		
		processAnswer(answer);
	}
	
	function processAnswer(answer) {
		var q = answer.answeredQuestion;
		var td = tableQuestMap[q.id];
		
		if(answer.right) {
			prize += q.points;
			if(prize >= 10000) {
				prize = 10000; 
				showVictory();
				return;
			}
			refreshStats();
			td.html("");
		} else {
			td.html("")
		}
		
		answeredQuestions.push(q.id);
		
		actionHistory.push(answer);
		
		showGame();
	}
	
	function undoAnswer() {
		var answer = actionHistory.pop();
		
		if(answer == null) {return; }

		var q = answer.answeredQuestion;
		
		if(answer.right) {
			prize -= q.points;
			refreshStats();
		}
		
		answeredQuestions.splice(answeredQuestions.indexOf(q.id), 1);
		
		var td = tableQuestMap[answer.answeredQuestion.id];
		initTd(td, q);
	}
	
}

function Answer() {
	this.answeredQuestion = null;
	this.right = false;
}

function IdGenerator() {}
IdGenerator.lastId = 1;
IdGenerator.newId = function () {
	return IdGenerator.lastId++;
}