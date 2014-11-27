<!doctype html>
<html>
<head>
	<title>PDF Editor</title>
	
	<#macro scriptLib lib files>
		<#list files as file>
			<script src="${requestContext.contextPath}/lib/${lib}/${file}"></script>
		</#list>
	</#macro>
	
	<#macro script src>
		<script src="${requestContext.contextPath}/${src}"></script>
	</#macro>
	
	<#macro stylesheet src>
		<link rel="stylesheet" type="text/css" href="${requestContext.contextPath}/${src}" />
	</#macro>

	<@scriptLib lib="ace-builds/src-noconflict"
		files=["ace.js",
			"mode-ftl.js",
			"mode-json.js",
			"mode-css.js",
			"theme-xcode.js",
			"ext-language_tools.js"] />
			
	<@scriptLib lib="jquery" files=["dist/jquery.min.js"] />
	<@scriptLib lib="angular" files=["angular.js"] />
		
	<@scriptLib lib="angular-ui-ace" files=["ui-ace.js"] />		
	<@scriptLib lib="angular-ui-bootstrap-bower" files=["ui-bootstrap-tpls.min.js"] />		
	<@stylesheet src="lib/bootstrap/dist/css/bootstrap.min.css" />
	
	<@scriptLib lib="split-pane" files=["split-pane.js"] />
	<@stylesheet src="lib/split-pane/split-pane.css" />
	<@scriptLib lib="angular-split-pane" files=["angular-split-pane.js"] />
	
	<@script src="PdfEditor.js" />
	<@script src="StorageService.js" />
	<@script src="UpdateService.js" />
	<@script src="EditorController.js" />	
	<@stylesheet src="theme.css" />
	
	<script>		
		angular.module("spacetrader.AppContext", [])
			.constant("AppContext.ContextPath", "${requestContext.contextPath}");
	</script>	
</head>

<body ng-app="spacetrader.PdfEditor" ng-controller="PdfEditor.EditorController">
	<script id="defaultFtl" type="text/plain"><html>		
<head>
</head>

<body>
    <h1>${r"${header}"}</h1>
    
    <ul>
        <${r"#"}list wraiths as wraith>
            <li>Hello, ${r"${wraith}"}!</li>
        </${r"#"}list>
    </ul>
</body>

</html></script>	
	<script id="defaultModel" type="text/plain">{
	"header": "Hello, world!",
	"wraiths": [
	    "Antilles",
	    "Janson",
	    "Donos",
	    "Tainer",
	    "Notsil",
	    "Nelprin",
	    "saBinring",
	    "Sarkin",
	    "Targon"
	]
}</script>

	<div class="editorHeader">
		<button type="button" class="button glyphicon glyphicon-play" ng-click="update()"></button>
	
		<span class="editorTitle">FreeMarker PDF Editor</span>		
	</div>
	
	<split-pane class="editorPanes">
		<split-pane-component width="50%">
			<tabset>
				<tab heading="Template">
					<div ui-ace="{ onLoad: initFtlEditor }" ng-model="editor.template" class="editorPaneContent"></div>
				</tab>
				<tab heading="JSON model">
					<div ui-ace="{ onLoad: initJsonEditor }" ng-model="editor.model" class="editorPaneContent"></div>
				</tab>
			</tabset>
		</split-pane-component>
		
		<split-pane-divider></split-pane-divider>
				
		<split-pane-component>
			<tabset style="width: 50%; left: 50%">
				<tab heading="Processed HTML">
					<div class="htmlOutput editorPaneContent">
						<iframe ng-if="!!htmlOutput" srcdoc="{{htmlOutput}}"></iframe>
					</div>
				</tab>
				<tab heading="PDF">
					<div class="pdfOutput editorPaneContent">
						<object ng-if="!!pdfOutput" 
							type="application/pdf"
							data="data:application/pdf;base64,{{pdfOutput}}"></object>
					</div>
				</tab>
			</tabset>
		</split-pane-component>
	</split-pane>
	
	<div class="editorFooter">
		<span class="errors" ng-show="compileErrors.length > 0">
			{{compileErrors.length}} error(s) - {{compileErrors[0].message}}
			<span ng-if="compileErrors.length > 1">
				(click for more)
			</span>
		</span>
	</div>
</body>
</html>