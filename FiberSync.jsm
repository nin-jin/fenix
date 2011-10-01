"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $.Autoload( this )

const FiberSync= function( func ){
    return function( ){
  
        let self= this
        let args= arguments
    
        return $fenix.Fiber( function( done, fail ){
            done( func.apply( self, args ) )
        })
  
    }
}

