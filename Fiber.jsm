"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $()

const Fiber= function factory( fiber ){
    let wrapper= function wrapper( done, fail, stack ){
        if( !done ) done= function ignore( ){ }
        if( !fail ) fail= function fail( exception ) $fenix.fail( exception )
        if( !stack ) stack= $fenix.stack().replace( /^([^\n]*\n){,2}/, '' )
        try {
            var substack= $fenix.stack(), res= fiber.call( this, done, fail, stack )
            return res
        } catch( exception ){
            exception= $fenix.extendException( exception, exception.stack.replace( substack, stack ) )
            return fail( exception, done )
        }
    }
    wrapper.stack= $fenix.stack().replace( /^[^\n]*\n/, '' )
    return wrapper
}
