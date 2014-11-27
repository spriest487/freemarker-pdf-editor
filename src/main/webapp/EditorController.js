(function(angular) {
"use strict";

var AUTOSAVE_INTERVAL = 2000;

var DEFAULT_FTL = ["<html>",
"<head>",
"</head>",
"",
"<body>",
"	<h1>${header}</h1>",
"",
"	<ul>",
"		<#list wraith in wraiths>",
"			<li>Hello, ${wraith}!</li>",
"		</#list>",
"</ul>",
"</body>",
"",
"</html>"].join("\n");

var DEFAULT_MODEL = ["{",
"   'header': 'Hello, world!',",
"   'wraiths': [",
"       'Antilles',",
"		'Janson',",
"       'Donos',",
"       'Tainer',",
"		'Notsil',",
"       'Nelprin',",
"       'saBinring',",
"       'Sarkin',",
"       'Targon'",
"    ]",
"}"]

angular
.module("spacetrader.PdfEditor")
.controller("PdfEditor.EditorController",
["$scope",
 "$sce",
 "$interval",
 "PdfEditor.StorageService",
 "PdfEditor.UpdateService",
function($scope,
		$sce,
		$interval,
		storageService,
		updateService) {
	$scope.editor = {
		template: "",
		model: ""
	};
	
	$scope.htmlOutput = null;
	
	$scope.compileErrors = [];
	$scope.emptyTemplateError = false;
	
	function initEditor(editor, mode) {
		editor.setOptions({
			enableBasicAutocompletion: true,
			enableLiveAutocompletion: true
		});
		
		editor.setTheme("ace/theme/xcode");
		editor.getSession().setMode(mode);
	}
		
	$scope.initJsonEditor = function(editor) {
		initEditor(editor, "ace/mode/json");
	};
	
	$scope.initFtlEditor = function(editor) {
		initEditor(editor, "ace/mode/ftl");
	};
	
	$scope.update = function() {
		updateService.update($scope.editor.template, $scope.editor.model)
		.then(function(output) {
			$scope.htmlOutput = output.html;
			$scope.pdfOutput = output.pdf;
			
			$scope.compileErrors = [];
		})
		["catch"](function(e) {
			$scope.compileErrors = (e instanceof Array? e : [e])
			.map(function(error) {
				return { message: error };
			});
		});
	};
	
	function saveToStorage() {
		storageService.save($scope.editor.template, $scope.editor.model);
	}
		
	//autosave to storage on timer
	var autosaveTimer = $interval(saveToStorage, AUTOSAVE_INTERVAL);
	
	$scope.$on("$destroy", function() {
		$interval.cancel(autosaveTimer);
		
		saveToStorage();
	});
	
	//do the initial load from storage
	var saved = storageService.load();
	
	if (saved.ftl && saved.model) {	
		$scope.editor.template = saved.ftl;
		$scope.editor.model = saved.model;	
	}
	else {
		$scope.editor.template = angular.element("#defaultFtl").html();
		$scope.editor.model = angular.element("#defaultModel").html();
	}
	
	$scope.update();
}]);

})(angular);