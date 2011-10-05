"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )

const service= new function(){

    this.appInfo=
    function()
    $.klass[ '@mozilla.org/xre/app-info;1' ]
    .getService( $.iface.nsIXULAppInfo )
    .QueryInterface( $.iface.nsIXULRuntime )

    this.bookmark=
    function()
    $.klass[ '@mozilla.org/browser/nav-bookmarks-service;1' ]
    .getService( $.iface.nsINavBookmarksService )

    this.console=
    function()
    $.klass[ '@mozilla.org/consoleservice;1' ]
    .getService( $.iface.nsIConsoleService )

    this.dir=
    function()
    $.klass[ '@mozilla.org/file/directory_service;1' ]
    .getService( $.iface.nsIDirectoryService )
    .QueryInterface( $.iface.nsIProperties )

    this.io=
    function()
    $.klass[ '@mozilla.org/network/io-service;1' ]
    .getService( $.iface.nsIIOService )

    this.history=
    function()
    $.klass[ '@mozilla.org/browser/nav-history-service;1' ]
    .getService( $.iface.nsINavHistoryService )

    this.livemark=
    function()
    $.klass[ '@mozilla.org/browser/livemark-service;2' ]
    .getService( $.iface.nsILivemarkService )

    this.pref=
    function()
    $.klass[ '@mozilla.org/preferences-service;1' ]
    .getService( $.iface.nsIPrefService )
    .QueryInterface( $.uface.nsIPrefBranch2 )

    this.security=
    function()
    $.klass[ '@mozilla.org/scriptsecuritymanager;1' ]
    .getService( $.iface.nsIScriptSecurityManager )

    this.domSerializer=
    function()
    $.klass[ '@mozilla.org/xmlextras/xmlserializer;1' ]
    .getService( $.iface.nsIDOMSerializer )

    this.mime=
    function()
    $.klass["@mozilla.org/mime;1"]
    .getService( $.iface.nsIMIMEService ) 

}

for( let key in service ){
    $.gre.XPCOMUtils.defineLazyGetter( key, service[ key ] )
}