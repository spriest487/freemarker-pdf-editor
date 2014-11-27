package org.spacetrader.pdfeditor;

@SuppressWarnings("serial")
public class PdfRenderException extends Exception {
	public PdfRenderException() {
	}

	public PdfRenderException(String message) {
		super(message);
	}

	public PdfRenderException(Throwable cause) {
		super(cause);
	}

	public PdfRenderException(String message, Throwable cause) {
		super(message, cause);
	}
}
