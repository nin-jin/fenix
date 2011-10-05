"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )

function Poly( ){
    var map= arguments
    return function wrapper(){
        return map[ arguments.length ].apply( this, arguments )
    }
}
