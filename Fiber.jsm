"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $.Autoload( this )

const Fiber= function( fiber ){
	return function( done, fail ){
		if( !done ) done= function(){}
		if( !fail ) fail= $fenix.fail
		try {
			return fiber.call( this, done, fail )
		} catch( exception ){
			fail( exception )
		}
	}
}
