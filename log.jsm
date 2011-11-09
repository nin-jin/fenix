"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
let $fenix= $()

function log( ){
    for( let i= 0; i < arguments.length; ++i ){ 
        let value= arguments[ i ]
      
        let file= Components.stack.caller.filename
        let line= Components.stack.caller.lineNumber
        let source= Components.stack.caller.sourceLine
        let type= {}.toString.apply( value ).replace( /^\[object (\w+)\]$/, '$1' )
        let message= type + ': ' + value
      
        let error= $fenix.create.error( message, file, source, line, null, null, 'component javascript' )
        $fenix.service.console.logMessage( error )
  
    }
}
