package org.spacetrader.pdfeditor;

@SuppressWarnings("serial")
public class CompileException extends Exception {
	public CompileException() {
		super();
	}

	public CompileException(String message, Throwable cause) {
		super(message, cause);
	}

	public CompileException(String message) {
		super(message);
	}

	public CompileException(Throwable cause) {
		super(cause);
	}
}
