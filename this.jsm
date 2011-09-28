"use strict"

const EXPORTED_SYMBOLS= [ 'EXPORTED_SYMBOLS', '$' ]

const $= {}

$.klass= Components.classes
$.Maker= Components.Constructor
$.iface= Components.interfaces
$.result= Components.results
$.util= Components.utils

$.util.import( 'resource://gre/modules/XPCOMUtils.jsm' )

$.Autoload = this.Proxy ? Autoload4 : Autoload3

const $io= $.klass[ "@mozilla.org/network/io-service;1" ].getService( $.iface.nsIIOService )

function Autoload4( baseURI ){
    if (typeof baseURI == "string") {
        baseURI = $io.newURI(baseURI, null, null);
    } else if (baseURI.__URI__) {
        baseURI = $io.newURI(baseURI.__URI__, null, null);
    } else if (baseURI.__LOCATION__) {
        baseURI = $io.newFileURI(baseURI.__LOCATION__.parent);
    }
    
    let proto = new function() {
        this.$follow = function(relativePath) {
            return $.Autoload(baseURI.resolve(relativePath + "/"));
        }
    }
    
    return Proxy.create( new function() {
        this.get= function( proxy, name ){
            if (name[0] === "$") return proto[name];
            let url = baseURI.resolve(name + ".jsm");
            return $.util.import(url, {})[name];
        }
    })
}

function Autoload3(context) {
    let aDir = context.__LOCATION__ || context
    if (!aDir.isDirectory()) aDir = aDir.parent;
    
    return new function() {

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
