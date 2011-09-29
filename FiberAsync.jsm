"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $.Autoload( this )

function FiberAsync( start ){
  return function( ){
    let self= this
    let arg= arguments
    return $fenix.Fiber( function( done, fail ){

      var context = start.apply( self, arg )
      var res
  
      step()
  
      function step( arg ){
        res= arg
        try {
          var sub = arguments.length ? context.send( arg ) : context.next()
        } catch( exception ){
          if( exception instanceof StopIteration ) return done( res )
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
          if( exception instanceof StopIteration ) return done( res )
          fail( exception )
        }
      }
  
    } )
  }
}
