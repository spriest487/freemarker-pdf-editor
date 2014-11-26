package org.spacetrader.pdfeditor;

import java.util.Map;

public class CompileHtmlRequest {
	private String ftl;
	private Map<String, Object> model;
	
	public String getFtl() {
		return ftl;
	}
	
	public Map<String, Object> getModel() {
		return model;
	}
}
