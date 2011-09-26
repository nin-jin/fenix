"use strict"
Components.utils.import( 'resource://fenix/fenix.jsm' )

function FiberSync( func ){
  return function fibered_func( ){
    let self= this
    let args= arguments
    return function fiber( done, fail ){
      try {
        done( func.apply( self, args ) )
      } catch( exception ){
        fail( exception )
      }
    }
  }
}

