"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $()

function fail( e ){
  if( !e || !e.message ) e= { message: e }
  
  let file= e.fileName || e.filename || Components.stack.caller.filename
  let line= e.lineNumber || Components.stack.caller.lineNumber
  let source= e.sourceLine || Components.stack.caller.sourceLine
  let stack= e.stack
  
  if( stack ){
    stack= stack.replace( /^.*?\n/, '' )
  } else {
    stack= []
    let frame= Components.stack
    while( frame= frame.caller ){
      stack.push( frame ) 
    }
    stack= stack.join( '\n' )
  }
  
  let message= String( e.message ) + '\n' + stack

  let error= $fenix.create.error( message, file, source, line, null, $.iface.nsIScriptError.exceptionFlag, 'component javascript' )
  $fenix.service.console.logMessage( error )

}
