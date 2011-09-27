"use strict"
Components.utils.import( 'resource://fenix/fenix.jsm' )
const $fenix= $.Autoload( this )

function FiberPipe( func ){
  let fiberList= arguments
  return Fiber( function( done, fail ){
    for( var i= 0; i < fiberList.length; ++i ){
      yield fiberList[ i ]
    }
  })
}

