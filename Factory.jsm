"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $.Autoload( this )

function autobind( proto, key, func ){
    proto.__defineGetter__( key, function lazy( ){
        if( this.hasOwnProperty( key ) ) return func
        let self= this
        delete proto[ key ]
        this[ key ]= function( ){
            return func.apply( self, arguments )
        }
        proto.__defineGetter__( key, lazy )
        return this[ key ]
    } )
}

function Factory( proto ){
    for( let key in proto ){
        if( !proto.hasOwnProperty( key ) ) continue
        if( proto.__lookupGetter__( key ) ) continue
        if( typeof proto[ key ] !== 'function' ) continue
        autobind( proto, key, proto[ key ] )
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
