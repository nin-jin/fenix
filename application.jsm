"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
let $fenix= $()

let application= new function( ){
	
	this.restart=
	function restart( ){
		$fenix.service.startup.quit( $.iface.nsIAppStartup.eForceQuit | $.iface.nsIAppStartup.eRestart )
	}

}