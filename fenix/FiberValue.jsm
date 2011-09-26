"use strict"
Components.utils.import( 'resource://fenix/fenix.jsm' )

function FiberResult( value ){
  return function( done, fail ){
    done( value )
  }
}
