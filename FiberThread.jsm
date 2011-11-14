"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
let $fenix= $()

function FiberThread( start ){
    return function wrapper( ){
        let self= this
        let arg= arguments
        let stack= Components.stack.caller // FIXME: rebuild stack
    
        return $fenix.Fiber({ runAsync: function fiber( done, fail ){
            
            var context = start.apply( self, arg )
            if( {}.toString.apply( context ) !== '[object Generator]' ) return done( context )
            
            var res
        
            step()
        
            function step( arg ){
                res= arg
                try {
                    var sub= context.send( arg )
                    sub.runAsync( step, subfail )
                } catch( exception ){
                    if( exception instanceof StopIteration ) done( res )
                    else fail( $fenix.extendException( exception, stack ), done )
                }
            }
        
            function subfail( exception ){
                try {
                    var sub= context.throw( exception )
                    sub.runAsync( step, subfail )
                } catch( exception ){
                    if( exception instanceof StopIteration ) done( res )
                    else fail( $fenix.extendException( exception, stack ), done )
                }
            }
      
        } })
    }
}
