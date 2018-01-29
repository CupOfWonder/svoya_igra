$(document).ready(function() {
	init();
	
	function init() {
		loadAndInitTable();
	}
	
	function loadAndInitTable() {
		var questions = loadQuestions();
		renderTable(questions);
	}
	
	function renderTable(questions) {
		alert(JSON.stringify(questions));
	}
});