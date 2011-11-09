"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
let $fenix= $()

function Factory( proto ){
    for( let key in proto ){
        if( !proto.hasOwnProperty( key ) ) continue
        if( proto.__lookupGetter__( key ) ) continue
        if( typeof proto[ key ] !== 'function' ) continue
        $fenix.autoBind( proto, key, proto[ key ] )
    }
    
    proto.nsISupports= function( ) this
    proto.QueryInterface= function QueryInterface( iface ){
        if( iface in this ) return this[ iface ]()
        throw Cr.NS_ERROR_NO_INTERFACE
    }

    let Instance= function( ){ }
    Instance.prototype= proto
    
    let factory= function( ){
        let obj= ( this instanceof factory ) ? this : new Instance
        if( obj.init ) return obj.init.apply( obj, arguments )
        return obj
    }
    factory.prototype= proto
    
    proto.constructor= factory

    return factory
}
