"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
let $fenix= $()

let ProxyMap= $fenix.Factory( new function ProxyMap_proto( ){
    
    this.list= null
    
    this.init=
    function init( list, fieldName ){
        this.list= list || []
        return this
    }
    
    this.add=
    function add( obj ){
        this.drop( obj )
        this.list.push( obj )
        return this
    }
    
    this.drop=
    function drop( obj ){
        let index= this.list.indexOf( obj )
        this.list.splice( index, 1 )
        return this
    }
    
    function get( proxy, name ){
        let list= []
        for each( let [key,obj] in Iterator(this.list) ) {
            let val= obj[ name ]
            if( !val ) return val
            list.push( val )
        }
        return $fenix.ProxyMap( list ).map
    }
    
    function set( proxy, name, value ){
        for each( let obj in this.list ) {
            obj[ name ]= value
        }
        return value
    }

    this.__defineGetter__
    (   'map'
    ,   function( ){
            let list= this.list

            function callTrap( ){
                let result= []
                for each( let obj in list ){
                    result.push( obj.apply( this, arguments ) )
                }
                return $fenix.ProxyMap( result )
            }
    
            return Proxy.createFunction( { get: get, set: set, list: this.list }, callTrap )
        }
    )
    
} )
