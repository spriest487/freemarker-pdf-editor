(function(angular) {
"use strict";

angular.module("spacetrader.PdfEditor")
.service("PdfEditor.UpdateService",
["$q",
 "$http",
 "$sce",
 "AppContext.ContextPath",
function($q,
		$http,
		$sce,
		contextPath) {
	function parseModel(modelJson) {
		try {
			return $q.when(angular.fromJson(modelJson));
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
	
	function compileHtml(template, model) {
		var result = $q.defer();
				
		$http({
			method: "post",
			url: contextPath +"/action/compile",
			data: {
				ftl: template,
				model: model
			}
		})
		.success(function(data) {			
			result.resolve($sce.trustAsHtml(data));
		})
		.error(function(data, status) {
			result.reject(data);
		});
		
		return result.promise;
	}
	
	function renderPdf(template, model) {
		var result = $q.defer();
		
		$http({
			method: "post",
			url: contextPath +"/action/render?format=base64",
			data: {
				ftl: template,
				model: model
			},
			headers: {
				"Accept": "application/pdf"
			}
		})
		.success(function(data) {
			result.resolve(data);
		})
		.error(function(data, status) {
			result.reject(data);
		});
		
		return result.promise;
	}
	
	this.update = function(ftl, model) {
		var result = $q.defer();
		
		if (!ftl) {
			result.reject("Template is empty");
		}
		
		parseModel(model)
		.then(function(model) {
			return $q.all({
				html: compileHtml(ftl, model),
				pdf: renderPdf(ftl, model)
			});
		})
		.then(function(output) {
			result.resolve(output);
		})
		["catch"](function(error) {
			result.reject(error);
		});
		
		return result.promise;
	};	
}]);

})(angular);