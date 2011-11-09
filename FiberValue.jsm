"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
let $fenix= $()

let FiberValue= $fenix.FiberThread( function( value ) value )
