"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
let $fenix= $()

function FiberSleep( delay ){
    let timer
    return $fenix.Fiber({ runAsync: function fiber( done, fail ){
        timer= $fenix.create.timer( { notify: done }, delay, $.iface.nsITimer.TYPE_ONE_SHOT )
    } })
}