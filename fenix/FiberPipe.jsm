"use strict"
Components.utils.import( 'resource://fenix/fenix.jsm' )

function FiberPipe( func ){
  let fiberList= arguments
  return Fiber( function( done, fail ){
    for( var i= 0; i < fiberList.length; ++i ){
      yield fiberList[ i ]
    }
  })
}

