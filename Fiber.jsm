"use strict"
Components.utils.import( 'resource://fenix/fenix.jsm' )

function Fiber( start ){
  return function( done, fail ){

    if( !fail ) fail= logError

    var context = start( )

    step()

    function step( arg ){
      try {
        var sub = arguments.length ? context.send( arg ) : context.next()
      } catch( exception ){
        if( exception instanceof StopIteration ) return done( step.result )
        fail( exception )
        return
      }
      
      if( typeof sub !== 'function' ){
        step( result= sub.result )
        return
      }
      
      try {
        sub( step, subfail )
      } catch( exception ){
        subfail( exception )
      }
    }

    function subfail( exception ){
      try {
        var sub= context.throw( exception )
      } catch( exception ){
        if( exception instanceof StopIteration ) return done( step.result )
        fail( exception )
      }
    }

  }
}

Fiber.result= function( value ){
  return function( done, fail ){
    done( done.result= value )
  }
}
