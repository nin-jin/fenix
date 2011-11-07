"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $()

function FiberThread( start ){
    return function wrapper( ){
        let self= this
        let arg= arguments
    
        let wrappedFiber= $fenix.Fiber( function fiber( done, fail, stack ){
            if( !stack ) stack= wrappedFiber.stack
            
            var context = start.apply( self, arg )
            if( {}.toString.apply( context ) !== '[object Generator]' ) return done( context )
            
            var res
        
            step()
        
            function step( arg ){
                res= arg
                try {
                    var substack= $fenix.stack(), sub= context.send( arg )
                    sub( step, subfail, sub.stack.replace( substack, stack ) )
                } catch( exception ){
                    if( exception instanceof StopIteration ) return done( res )
                    exception= $fenix.extendException( exception, exception.stack.replace( substack, stack ) )
                    fail( exception, done )
                }
            }
        
            function subfail( exception ){
                try {
                    var substack= $fenix.stack(), sub= context.throw( exception )
                    sub( step, subfail, sub.stack.replace( substack, stack ) )
                } catch( exception ){
                    if( exception instanceof StopIteration ) return done( res )
                    fail( exception, done )
                }
            }
      
        } )
        
        return wrappedFiber
    }
}
