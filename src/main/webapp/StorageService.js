(function(angular, localStorage) {
"use strict";

var STORAGE_KEY = "PdfEditor.StorageService.STATE";

angular
.module("spacetrader.PdfEditor")
.service("PdfEditor.StorageService",
[function() {	
	this.save = function(ftl, model, stylesheet) {
		localStorage[STORAGE_KEY] = angular.toJson({
			ftl: ftl,
			model: model,
			stylesheet: stylesheet
		});
	};
	
	this.load = function() {
		try {
			return angular.fromJson(localStorage[STORAGE_KEY]);
		}
		catch (e) {
			if (e instanceof SyntaxError) {
				return {};
			}
			else throw e;
		}
	};
}]);

})(angular, localStorage);