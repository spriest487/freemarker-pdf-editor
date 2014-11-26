package org.spacetrader.pdfeditor;

import java.io.IOException;
import java.io.Reader;
import java.io.StringReader;
import java.io.StringWriter;
import java.util.Map;

import org.springframework.stereotype.Component;

import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;

@Component
public class FtlCompiler {
	private final Configuration configuration;
	
	public FtlCompiler() {
		configuration = new Configuration(Configuration.VERSION_2_3_0);
	}

	public String compile(String ftl, Map<String, Object> model) throws CompileException {
		Reader reader = new StringReader(ftl);
		StringWriter writer = new StringWriter(ftl.length());
		
		try {
			new Template("compileTemplate", reader, configuration)
				.process(model, writer);
		}
		catch (TemplateException e) {
			throw new CompileException(e.getMessage());
		}
		catch (IOException e) {
			throw new CompileException(e.getMessage());
		}
		
		return writer.toString();
	}
}
