"use strict"

const EXPORTED_SYMBOLS= [ 'EXPORTED_SYMBOLS', '$' ]


const $= {}

$.klass= Components.classes
$.iface= Components.interfaces
$.util= Components.utils
$.Maker= Components.Constructor

$.util.import( 'resource://gre/modules/XPCOMUtils.jsm' )
const $io= $.klass[ "@mozilla.org/network/io-service;1" ].getService( $.iface.nsIIOService )

$.Autoload= this.Proxy ? AutoloadFF4 : AutoloadFF3

const cache= {}

$.gre= $.Autoload( 'resource://gre/modules/' )

function AutoloadFF4( baseURI ){
    if (typeof baseURI == "string") {
        baseURI = $io.newURI(baseURI, null, null);
    } else if (baseURI.__URI__) {
        baseURI = $io.newURI(baseURI.__URI__, null, null);
    } else if (baseURI.__LOCATION__) {
        baseURI = $io.newFileURI(baseURI.__LOCATION__.parent);
    }
    
    let instance= cache[ baseURI.spec ]
    if( instance ) return instance
    
    let proto = new function() {
        this.$follow = function(relativePath) {
            return $.Autoload(baseURI.resolve(relativePath + "/"));
        }
    }
    
    return cache[ baseURI.spec ]= Proxy.create( new function() {
        this.get= function( proxy, name ){
            if (name[0] === "$") return proto[name];
            let url = baseURI.resolve(name + ".jsm");
            return $.util.import(url, {})[name];
        }
    })
}

function AutoloadFF3(context) {
    let aDir = context.__LOCATION__ || context
    if( typeof aDir === 'string' ){
        aDir= $io.newURI( aDir, null, null ).QueryInterface( $.iface.nsIFileURL ).file
    }
    if (!aDir.isDirectory()) aDir = aDir.parent
    
    let instance= cache[ aDir.path ]
    if( instance ) return instance
    
    return cache[ aDir.path ]= new function() {

        let i = aDir.directoryEntries;
        while (i.hasMoreElements()) {
            let file = i.getNext().QueryInterface($.iface.nsIFile);
            if (!file.isFile()) continue;

            let name = file.leafName.replace(/\.jsm$/, "");
            if (name === file.leafName) continue;
            
            XPCOMUtils.defineLazyGetter(this, name, function() {
                let url = $io.newFileURI(file).spec;
                return $.util.import(url, {})[name];
            });

        }
        
        this.$follow = function(relativePath) {
            let names = relativePath.split("/");
            let newDir = aDir.clone();
            while (names.length) {
                let name = names.shift();
                if (!name) continue;
                if (name === "..") newDir = newDir.parent;
                else newDir.append(name);
            }
            return $.Autoload(newDir);
        }
        
    }
}
