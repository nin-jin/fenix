"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )

const create= new function(){

    this.timer= $.Maker( '@mozilla.org/timer;1', 'nsITimer', 'initWithCallback' )
    this.error= $.Maker( '@mozilla.org/scripterror;1', 'nsIScriptError', 'init' )
    this.fileLocal= $.Maker( '@mozilla.org/file/local;1', 'nsILocalFile', 'initWithPath' )
    this.converterInput= $.Maker( '@mozilla.org/intl/converter-input-stream;1', 'nsIConverterInputStream', 'init' )
    this.converterUnicode= $.Maker( '@mozilla.org/intl/scriptableunicodeconverter', 'nsIScriptableUnicodeConverter' )
    this.domParser= $.Maker( '@mozilla.org/xmlextras/domparser;1', 'nsIDOMParser', 'init' )

}
