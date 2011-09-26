"use strict"
Components.utils.import( 'resource://fenix/fenix.jsm' )

const ScriptError = $Constructor( "@mozilla.org/scripterror;1", "nsIScriptError", "init" )

function logError( e ){
  if( e.message ){
    let ee= new ScriptError( e.name + '[' + e.message + ']', e.fileName, null, e.lineNumber, null, $iface.nsIScriptError.exceptionFlag, 'component javascript' )
    $fenix.service.console.logMessage( ee )
    if( e.stack ) $fenix.service.console.logMessage({ message: String( e.stack ) })
  } else {
    let ee= new ScriptError( String( e ), null, null, null, null, $iface.nsIScriptError.exceptionFlag, 'component javascript' )
    $fenix.service.console.logMessage( ee )
  }
}
