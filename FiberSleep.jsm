"use strict"
Components.utils.import( 'resource://fenix/fenix.jsm' )

let Timer = $Constructor( "@mozilla.org/timer;1", 'Ci.nsITimer', 'initWithCallback' )

FiberSleep= function( delay ){
  return function( done, fail ){
    new Timer( { notify: done }, delay, Ci.nsITimer.TYPE_ONE_SHOT )
  }
}