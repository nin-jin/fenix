"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
let $fenix= $()

function FiberSleep( delay ){
    return $fenix.Fiber( function fiber( done, fail ){
        $fenix.create.timer( { notify: done }, delay, $.iface.nsITimer.TYPE_ONE_SHOT )
    } )
}