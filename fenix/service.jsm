"use strict"
Components.utils.import( 'resource://fenix/fenix.jsm' )
const $fenix= $Modules( this )

const service= new function(){

    this.console= $.klass[ "@mozilla.org/consoleservice;1" ].getService( $.iface.nsIConsoleService )
    this.io= $.klass[ "@mozilla.org/network/io-service;1" ].getService( $.iface.nsIIOService )

}
