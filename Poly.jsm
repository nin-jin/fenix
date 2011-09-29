"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )

const Poly= function( ){
    var map= arguments
    return function(){
        return map[ arguments.length ].apply( this, arguments )
    }
}
