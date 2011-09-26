"use strict"
Components.utils.import( 'resource://fenix/fenix.jsm' )
const $fenix= $Modules( this )

function FiberAsync( start ){
  return function( ){
    let self= this
    let arg= arguments
    return function( done, fail ){
  
      if( !fail ) fail= $fenix.logError
  
      var context = start.apply( self, arguments )
  
      step()
  
      function step( arg ){
        try {
          var sub = arguments.length ? context.send( arg ) : context.next()
        } catch( exception ){
          if( exception instanceof StopIteration ) return done( arg )
          fail( exception )
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
}
