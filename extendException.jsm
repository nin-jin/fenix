"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $()

function extendException( exception, message ){
    let error= new Error( exception.message + '\n' + message )
    error.name= exception.name
    error.fileName= exception.fileName
    error.lineNumber= exception.lineNumber
    error.stack= exception.stack
    return error
}
