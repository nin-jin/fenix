"use strict"
Components.utils.import( 'resource://fenix/fenix.jsm' )
const $fenix= $.Autoload( this )

FiberSleep= function( delay ){
  return function( done, fail ){
    $fenix.create.timer( { notify: done }, delay, Ci.nsITimer.TYPE_ONE_SHOT )
  }
}