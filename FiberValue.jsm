"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $()

const FiberValue= $fenix.FiberThread( function( value ) value )
