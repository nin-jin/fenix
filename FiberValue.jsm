"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $.Autoload( this )

const FiberValue= $fenix.Thread( function( value ) value )
