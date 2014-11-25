package org.spacetrader.pdfeditor;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.StringReader;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.xhtmlrenderer.pdf.ITextRenderer;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import com.lowagie.text.DocumentException;

@Component
public class PdfRenderer {
	private static final String REMOVE_TAGS = "<thead>|<tbody>|</thead>|</tbody>|<tfoot>|</tfoot>";
	
	private static final ThreadLocal<DocumentBuilderFactory> docBuilderFactory = new ThreadLocal<DocumentBuilderFactory>() {
		@Override
		public DocumentBuilderFactory initialValue() {
			return DocumentBuilderFactory.newInstance();
		}
	};
	
	public PdfRenderer() {
	}
	
	public byte[] render(String html, String baseUrl) throws PdfRenderException {
		DocumentBuilder docBuilder;
		try {
			docBuilder = docBuilderFactory.get().newDocumentBuilder();
		}
		catch (ParserConfigurationException e) {
			throw new PdfRenderException(e);
		}
		
		String cleanHtml = html.replaceAll(REMOVE_TAGS, "");
		
		try {
			Document doc = docBuilder.parse(
				new InputSource(
					new StringReader(cleanHtml)));
			
			ITextRenderer renderer = new ITextRenderer();
			renderer.setDocument(doc, baseUrl);
			
			renderer.layout();
			
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			renderer.createPDF(baos);
			
			return baos.toByteArray();
		}
		catch (DocumentException e) {
			throw new PdfRenderException(e);
		}
		catch (IOException e) {
			throw new PdfRenderException(e);
		}
		catch (SAXException e) {
			throw new PdfRenderException(e);
		}
	}
}
