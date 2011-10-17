"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $()

function FiberThread( start ){
    return function wrapper( ){
        let self= this
        let arg= arguments
        return $fenix.Fiber( function fiber( done, fail ){
    
            var context = start.apply( self, arg )
            if( {}.toString.apply( context ) !== '[object Generator]' ) return done( context )
            
            var res
        
            step()
        
            function step( arg ){
                res= arg
                try {
                    var sub= arguments.length ? context.send( arg ) : context.next()
                    sub( step, subfail )
                } catch( exception ){
                    if( exception instanceof StopIteration ) done( res )
                    else fail( exception, done )
                }
            }
        
            function subfail( exception ){
                try {
                    var sub= context.throw( exception )
                } catch( exception ){
                    if( exception instanceof StopIteration ) done( res )
                    else fail( exception, done )
                }
            }
      
        } )
    }
}
