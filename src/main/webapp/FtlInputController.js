(function(angular) {
"use strict";

var AUTOSAVE_INTERVAL = 2000;

angular
.module("spacetrader.PdfEditor")
.controller("PdfEditor.FtlInputController",
["$scope",
 "$http",
 "$sce",
 "$q",
 "$interval",
 "AppContext.ContextPath",
 "PdfEditor.StorageService",
function($scope,
		$http,
		$sce,
		$q,
		$interval,
		contextPath,
		storageService) {
	$scope.template = "";
	$scope.model = "";
	$scope.htmlOutput = null;
	
	$scope.compileErrors = [];
	$scope.emptyTemplateError = false;
	
	$scope.initJsonEditor = function(editor) {
		editor.setOptions({
			enableBasicAutocompletion: true,
			enableLiveAutocompletion: true
		});
		
		editor.setTheme("ace/theme/xcode");
		editor.getSession().setMode("ace/mode/json");;
	};
	
	$scope.initCssEditor = function(editor) {
		editor.setOptions({
			enableBasicAutocompletion: true,
			enableLiveAutocompletion: true
		});
		
		editor.setTheme("ace/theme/xcode");
		editor.getSession().setMode("ace/mode/css");;
	};	
	
	$scope.initFtlEditor = function(editor) {
		editor.setOptions({
			enableBasicAutocompletion: true,
			enableLiveAutocompletion: true
		});
		
		editor.setTheme("ace/theme/xcode");
		editor.getSession().setMode("ace/mode/ftl");;
	};	
	
	function parseModel() {
		try {
			return $q.when(angular.fromJson($scope.model));
		}
		catch (e) {
			if (e instanceof SyntaxError) {
				return $q.reject("Failed to parse model JSON: " +e.message);
			}
			else {
				return $q.reject(e);
			}
		}
	}
	
	$scope.compileHtml = function() {
		if (!$scope.template) {
			$scope.emptyTemplateError = true;
			return;
		}
		
		parseModel()
		.then(function(modelObj) {
			return $http({
				method: "post",
				url: contextPath +"/action/compile",
				data: {
					ftl: $scope.template,
					model: modelObj,
					stylesheet: $scope.stylesheet
				}
			})
			.success(function(data) {
				$scope.compileErrors = (data.errors || [])
				.map(function(error) {
					return { message: error };
				});
				
				if ($scope.compileErrors.length === 0) {
					$scope.htmlOutput = $sce.trustAsHtml(data.document);
				}
			})
			.error(function(data, status) {
				$scope.compileErrors = [{message: "Internal error (" +status +")"}];
			});
		})
		["finally"](function() {
			$scope.emptyTemplateError = false;
		});
	};
	
	$scope.renderPdf = function() {
		parseModel()
		.then(function(modelObj) {
			return $http({
				method: "post",
				url: contextPath +"/action/render?format=base64",
				data: {
					ftl: $scope.template,
					model: modelObj,
					stylesheet: $scope.stylesheet
				},
				headers: {
					"Accept": "application/pdf"
				}
			})
			.success(function(data) {
				$scope.pdfOutput = data;
			})
			.error(function(data, status) {
				
			});			
		});
	};
	
	function saveToStorage() {
		storageService.save($scope.template, $scope.model, $scope.stylesheet);
	}
		
	//autosave to storage on timer
	var autosaveTimer = $interval(saveToStorage, AUTOSAVE_INTERVAL);
	
	$scope.$on("$destroy", function() {
		$interval.cancel(autosaveTimer);
		
		saveToStorage();
	});
	
	//do the initial load from storage
	var saved = storageService.load();
	
	$scope.template = saved.ftl;
	$scope.model = saved.model;
	$scope.stylesheet = saved.stylesheet;
	
	if ($scope.template) {
		$scope.compileHtml();
	}
}]);

})(angular);