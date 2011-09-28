"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $.Autoload( this )

function FiberSleep( delay ){
  return function( done, fail ){
    $fenix.create.timer( { notify: done }, delay, $.iface.nsITimer.TYPE_ONE_SHOT )
  }
}