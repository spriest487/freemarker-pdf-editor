package org.spacetrader.pdfeditor;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CompileHtmlResult {
	public final String document;
	public final List<String> errors;
	
	public CompileHtmlResult(String document, List<String> errors) {
		this.document = document;
		this.errors = errors != null? new ArrayList<String>(errors) : Collections.<String>emptyList();
	}
}
