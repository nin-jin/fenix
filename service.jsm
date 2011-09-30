"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )

const service= new function(){

    this.console= $.klass[ '@mozilla.org/consoleservice;1' ].getService( $.iface.nsIConsoleService )
    this.io= $.klass[ '@mozilla.org/network/io-service;1' ].getService( $.iface.nsIIOService )
    this.security= $.klass[ '@mozilla.org/scriptsecuritymanager;1' ].getService( $.iface.nsIScriptSecurityManager )
    this.domSerializer = $.klass[ '@mozilla.org/xmlextras/xmlserializer;1' ].getService( $.iface.nsIDOMSerializer )

}
