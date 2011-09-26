"use strict"
Components.utils.import( 'resource://fenix/fenix.jsm' )

const $fenix= $Modules( this )

const service= new function(){

    this.console= $class[ "@mozilla.org/consoleservice;1" ].getService( $iface.nsIConsoleService )
    this.io= $class[ "@mozilla.org/network/io-service;1" ].getService( $iface.nsIIOService )

}
