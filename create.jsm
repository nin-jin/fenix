"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )

let create= new function(){

    this.converterInput= $.Maker( '@mozilla.org/intl/converter-input-stream;1', 'nsIConverterInputStream', 'init' )
    this.converterOutput= $.Maker( '@mozilla.org/intl/converter-output-stream;1', 'nsIConverterOutputStream', 'init' )
    this.converterUnicode= $.Maker( '@mozilla.org/intl/scriptableunicodeconverter', 'nsIScriptableUnicodeConverter' )
    this.domDoc= $.Maker( '@mozilla.org/xml/xml-document;1', 'nsIDOMDocument' )
    this.domParser= $.Maker( '@mozilla.org/xmlextras/domparser;1', 'nsIDOMParser', 'init' )
    this.domTransformer= $.Maker( '@mozilla.org/document-transformer;1?type=xslt', 'nsIXSLTProcessor', 'importStylesheet' )
    this.error= $.Maker( '@mozilla.org/scripterror;1', 'nsIScriptError', 'init' )
    this.fileLocal= $.Maker( '@mozilla.org/file/local;1', 'nsILocalFile', 'initWithPath' )

    this.htmlDoc= function( ){
        return create.domDoc().implementation.createHTMLDocument( "" )
    }

    this.pipe= $.Maker( '@mozilla.org/pipe;1', 'nsIPipe', 'init' )
    this.process= $.Maker( '@mozilla.org/process/util;1', 'nsIProcess', 'init' )
    this.systemPrincipal= $.Maker( '@mozilla.org/systemprincipal;1', 'nsIPrincipal' )
    this.timer= $.Maker( '@mozilla.org/timer;1', 'nsITimer', 'initWithCallback' )
    this.uri= $.Maker( '@mozilla.org/network/simple-uri;1', 'nsIURI' )

}
