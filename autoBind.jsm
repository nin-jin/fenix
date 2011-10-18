"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )

function autoBind( proto, key, func ){
    proto.__defineGetter__( key, function lazy( ){
        if( this.hasOwnProperty( key ) ) return func
        let self= this
        
        let wrapper=
        function wrapper( ){
            return func.apply( self, arguments )
        }
        
        wrapper.toString=
        function wrapper_toString( ){
            return String( func )
        }
        
        wrapper.observe= wrapper
        wrapper.handleEvent= wrapper
        wrapper.notify= wrapper
        
        delete proto[ key ]
        this[ key ]= wrapper
        proto.__defineGetter__( key, lazy )

        return this[ key ]
    } )
}
