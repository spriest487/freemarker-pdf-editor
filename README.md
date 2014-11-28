freemarker-pdf-editor
==

A simple webapp to edit FreeMarker FTL templates with quick conversion and
previews of
the result in HTML and PDF. Written in Spring and AngularJS.

This tool is intended to fit into the workflow of writing FTL templates that
are rendered as HTML or PDF in your app. FlyingSaucer is used to render PDFs
from the intermediate HTML, so the HTML your template generates must be valid
XML.

The model passed to FreeMarker for rendering can be edited as JSON. At the
moment there is no support for simulating resources being loaded from the
server, so any resource URLs (images, stylesheets) must be fully qualified
external URLs.

Getting started
==
You will need Maven 3 and NPM installed. Clone the project and run the command
`mvn jetty:run` in that directory. The app will be available on 
`http://localhost:8080/pdf-editor/action/index`. If you need to use a different
port, run the command with `-Djetty.port=(port number)`.

Warning
==
This app is a development tool and is not intended to be deployed in public.
There are lots of issues with allowing users to execute arbritrary FTL code.
See the FreeMarker website for more details.