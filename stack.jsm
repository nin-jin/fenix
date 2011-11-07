"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $()

function stack( ){
    return ( new Error ).stack.replace( /^[^\n]*\n/, '' )
}
