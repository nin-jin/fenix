"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $()

function autoBind( proto, key, func ){
    proto.__defineGetter__( key, function lazy( ){
        if( this.hasOwnProperty( key ) ) return func
        let self= this
        
        let wrapper=
        Proxy.createFunction( new function() {

            this.get=
            function( proxy, name ){
                return func[ name ]
            }

        }, function( ) func.apply( self, arguments ) )
        
        //wrapper.observe= wrapper
        //wrapper.handleEvent= wrapper
        //wrapper.notify= wrapper
        
        delete proto[ key ]
        this[ key ]= wrapper
        proto.__defineGetter__( key, lazy )

        return this[ key ]
    } )
}
