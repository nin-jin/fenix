"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )

let service= new function(){

    this.appInfo= [ '@mozilla.org/xre/app-info;1', 'nsIXULAppInfo', 'nsIXULRuntime' ]
    this.bookmark= [ '@mozilla.org/browser/nav-bookmarks-service;1', 'nsINavBookmarksService' ]
    this.console= [ '@mozilla.org/consoleservice;1', 'nsIConsoleService' ]
    this.dir=[ '@mozilla.org/file/directory_service;1', 'nsIDirectoryService', 'nsIProperties' ]
    this.io= [ '@mozilla.org/network/io-service;1', 'nsIIOService' ]
    this.history= [ '@mozilla.org/browser/nav-history-service;1', 'nsINavHistoryService' ]
    this.livemark= [ '@mozilla.org/browser/livemark-service;2', 'nsILivemarkService' ]
    this.pref= [ '@mozilla.org/preferences-service;1', 'nsIPrefService', 'nsIPrefBranch2' ]
    this.security= [ '@mozilla.org/scriptsecuritymanager;1', 'nsIScriptSecurityManager' ]
    this.domSerializer= [ '@mozilla.org/xmlextras/xmlserializer;1', 'nsIDOMSerializer' ]
    this.mime= [ '@mozilla.org/mime;1', 'nsIMIMEService' ]

}

function Service([ klass, name, iface ]){
    return function getter( ){
        let service= $.klass[ klass ].getService( $.iface[ name ] )
        if( iface ) service= service.QueryInterface( $.iface[ iface ] )
        return service
    }
}

for( let key in service ){
    $.gre.XPCOMUtils.defineLazyGetter( service, key, Service( service[ key ] ) )
}
