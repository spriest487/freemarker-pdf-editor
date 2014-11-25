<!doctype html>
<html>
<head>
	<title>PDF Editor</title>
	
	<!--ACE -->
	<script src="${requestContext.contextPath}/lib/ace.js"></script>
	<script src="${requestContext.contextPath}/lib/mode-ftl.js"></script>
	<script src="${requestContext.contextPath}/lib/mode-json.js"></script>
	<script src="${requestContext.contextPath}/lib/mode-css.js"></script>
	<script src="${requestContext.contextPath}/lib/theme-xcode.js"></script>	
	<script src="${requestContext.contextPath}/lib/ext-language_tools.js"></script>
	
	<!--angular -->
	<script src="${requestContext.contextPath}/lib/angular.js"></script>
	<script src="${requestContext.contextPath}/lib/ui-ace.js"></script>
	
	<script>		
		angular.module("spacetrader.AppContext", [])
			.constant("AppContext.ContextPath", "${requestContext.contextPath}");
	</script>
	
	<script src="${requestContext.contextPath}/PdfEditor.js"></script>
	<script src="${requestContext.contextPath}/StorageService.js"></script>
	<script src="${requestContext.contextPath}/FtlInputController.js"></script>
	
	<link href="${requestContext.contextPath}/theme.css" type="text/css" rel="stylesheet" />
</head>

<body ng-app="spacetrader.PdfEditor">
	<h1>PDF editor</h1>
	
	<form name="inputForm" ng-controller="PdfEditor.FtlInputController">
		<label class="modelInput panel">
			<h2>JSON Model</h2>
			<div ui-ace="{ onLoad: initJsonEditor }" ng-model="model"></div>
		</label>
	
		<label class="ftlInput panel">
			<div ng-if="emptyTemplateError" class="errors">
				<h2>The template must not be empty.</h2>
			</div>
		
			<h2>FreeMarker Template</h2>
			<div ui-ace="{ onLoad: initFtlEditor }" ng-model="template"></div>
		</label>
		
		<label class="cssInput panel">		
			<h2>Stylesheet</h2>
			<div ui-ace="{ onLoad: initCssEditor }" ng-model="stylesheet"></div>
		</label>
				
		<div class="panel">
			<h2>HTML output</h2>
			
			<div ng-if="compileErrors.length > 0" class="errors">
				<h2>There were compilation errors</h2> 
				<ul>
					<li ng-repeat="_e in compileErrors">{{_e.message}}</li>
				</ul>
			</div>
			
			<iframe ng-if="!!htmlOutput"
				srcdoc="{{htmlOutput}}"
				class="htmlOutput">
			</iframe>
			
			<button type="button"
				ng-click="compileHtml()">
				Update
			</button>
		</div>
				
		<div class="panel">
			<h2>PDF output</h2>
			
			<div class="pdfOutput">
				<object type="application/pdf"
					data="data:application/pdf;base64,{{pdfOutput}}"></object>
			</div>
			
			<button type="button"
				ng-click="renderPdf()"
				ng-disabled="!htmlOutput">Update</button>
		</div>
	</form>
</body>
</html>