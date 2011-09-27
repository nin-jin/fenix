"use strict"
Components.utils.import( 'resource://fenix/fenix.jsm' )

function FiberRace( map ){
  return function( done, fail ){
    var result= []
    var ballance= 1
    
    for( var key in map ){
      if( !map.hasOwnProperty( key ) ) continue;
      
      ++ballance;
      let receive= receiver( key )
      let catche= catcher( key )
      
      try {
        map[ key ]( receive, catche )
      } catch( exception ){
        catche( exception )
      }
    }
    
    subdone()
    
    function receiver( key ){
      return function( value ){
        result[ key ]= value
        subdone()
      }
    }
    
    function catcher( key ){
      return function( exception ){
        result.__defineGetter__( key, function(){ throw exception } )
        subdone()
      }
    }
    
    function subdone( ){
      if( --ballance ) return
      done( result )
    }
    
  }
}