"use strict"

const EXPORTED_SYMBOLS = [ 'EXPORTED_SYMBOLS', '$class', '$Constructor', '$iface', '$result', '$utils', '$fenix' ]

const $class= Components.classes
const $Constructor= Components.Constructor
const $iface= Components.interfaces
const $result= Components.results
const $utils= Components.utils

$utils.import( ( __URI__ && __URI__.spec || __LOCATION__ && __LOCATION__.path ).replace( /([&\\/]*)$/, 'Modules.jsm' ) )
$utils.import("resource://gre/modules/XPCOMUtils.jsm");


const IOService = $class["@mozilla.org/network/io-service;1"].getService($iface.nsIIOService);
const Modules = this.Proxy ? Modules4 : Modules3;

const $fenix= Modules( this )

function Modules4(baseURI) {
    if (typeof baseURI == "string") {
        baseURI = IOService.newURI(baseURI, null, null);
    } else if (baseURI.__URI__) {
        baseURI = IOService.newURI(baseURI.__URI__, null, null);
    } else if (baseURI.__LOCATION__) {
        baseURI = IOService.newFileURI(baseURI.__LOCATION__.parent);
    }
    
    let proto = new function() {
        this.$follow = function(relativePath) {
            return Modules(baseURI.resolve(relativePath + "/"));
        }
    }
    
    return Proxy.create( new function() {
        this.get = function Modules__get(proxy, name) {
            if (name[0] === "$") return proto[name];
            let url = baseURI.resolve(name + ".jsm");
            return Cu.import(url, {})[name];
        }
    })
}

function Modules3(context) {
    let aDir = context.__LOCATION__ || context;
    if (!aDir.isDirectory()) aDir = aDir.parent;
    
    return new function() {

        let i = aDir.directoryEntries;
        while (i.hasMoreElements()) {
            let file = i.getNext().QueryInterface(Ci.nsIFile);
            if (!file.isFile()) continue;

            let name = file.leafName.replace(/\.jsm$/, "");
            if (name === file.leafName) continue;
            
            XPCOMUtils.defineLazyGetter(this, name, function() {
                let url = IOService.newFileURI(file).spec;
                return Cu.import(url, {})[name];
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
            return Modules(newDir);
        }
        
    }
}
