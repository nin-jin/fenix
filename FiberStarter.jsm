"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $( this )

const FiberStarter= function( fiber ){
	return function( ){
		return fiber.apply( this, arguments )()
	}
}
