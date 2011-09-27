"use strict"
Components.utils.import( 'resource://fenix/fenix.jsm' )
const $fenix= $.Autoload( this )

const FiberValue= $fenix.FiberSync( function( value ) value )
