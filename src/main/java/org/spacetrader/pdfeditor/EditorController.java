package org.spacetrader.pdfeditor;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.bouncycastle.util.encoders.Base64;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class EditorController {
	private FtlCompiler ftlCompiler;
	private PdfRenderer pdfRenderer;
	
	@Inject
	public EditorController(FtlCompiler compiler,
			PdfRenderer pdfRenderer) {
		this.ftlCompiler = compiler;
		this.pdfRenderer = pdfRenderer;
	}
	
	@RequestMapping(value="/index", method=RequestMethod.GET)
	public String index() {
		return "index";
	}
	
	@ResponseBody
	@ExceptionHandler(CompileException.class)
	public ResponseEntity<String>andleCompileException(CompileException e) {		
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.contentType(MediaType.TEXT_PLAIN)
				.body(ExceptionUtils.getRootCauseMessage(e));
	}
	
	@ResponseBody
	@ExceptionHandler(PdfRenderException.class)
	public ResponseEntity<String> handlePdfRenderException(PdfRenderException e) {		
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.contentType(MediaType.TEXT_PLAIN)
				.body(ExceptionUtils.getRootCauseMessage(e));
	}

	@ResponseBody
	@RequestMapping(value="/compile",
		method=RequestMethod.POST,
		consumes=MediaType.APPLICATION_JSON_VALUE,
		produces=MediaType.TEXT_HTML_VALUE)
	public String compile(@RequestBody CompileHtmlRequest request)
			throws CompileException {	
		String html = ftlCompiler.compile(
				request.getFtl() != null? request.getFtl() : "",
				request.getModel());
		
		return html;
	}
	
	@RequestMapping(value="/render",
		method=RequestMethod.POST,
		consumes=MediaType.APPLICATION_JSON_VALUE,
		produces="application/pdf")
	public ResponseEntity<byte[]> render(@RequestBody CompileHtmlRequest request,
			@RequestParam("format") String format,
			HttpServletRequest httpRequest,
			HttpServletResponse response)
			throws PdfRenderException, CompileException {
		String html = ftlCompiler.compile(request.getFtl(), request.getModel());
		byte[] pdf = pdfRenderer.render(html, String.format(
				"%s://%s:%s%s",
				httpRequest.getScheme(),
				httpRequest.getServerName(),
				httpRequest.getServerPort(),
				httpRequest.getContextPath()));
		
		if ("base64".equals(format)) {
			response.setHeader("Content-Encoding", "base64");
			pdf = Base64.encode(pdf);
		}
		
		return new ResponseEntity<byte[]>(pdf, HttpStatus.OK);
	}
}
