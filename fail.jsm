"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $.Autoload( this )


function fail( e ){
  if( e && e.message ){
    let ee= $fenix.create.error( e.name + '(' + e.message + ')', e.fileName || e.filename, null, e.lineNumber, null, $.iface.nsIScriptError.exceptionFlag, 'component javascript' )
    $fenix.service.console.logMessage( ee )
    if( e.stack ) $fenix.service.console.logMessage({ message: String( e.stack ) })
  } else {
    let ee= $fenix.create.error( String( e ), null, null, null, null, $.iface.nsIScriptError.exceptionFlag, 'component javascript' )
    $fenix.service.console.logMessage( ee )
  }
}
