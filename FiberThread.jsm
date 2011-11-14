"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
let $fenix= $()

function FiberThread( starter ){
    return function wrapper( ){
        let self= this
        let arg= arguments
        let stack= Components.stack.caller // TODO: rebuild stack
    
        function start( ){
            let result= starter.apply( self, arg )
            let isGenerator= {}.toString.apply( result ) === '[object Generator]'
            return [ isGenerator, result ]
        }
    
        return $fenix.Fiber(
        {   run: function( ){
                let[ isGenerator, result ]= start()
                if( isGenerator ) throw new Error( 'Generator can not be returned. May be you want [runAsync] instead [run].' )
                return result
            }
        ,   runAsync: function fiber( done, fail ){
            
                let[ isGenerator, context ]= start()
                if( !isGenerator ) return done( context )
                
                let res
            
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
          
            }
        })
    }
}
