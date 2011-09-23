Components.utils.import( 'resource://fenix/fenix.jsm' )

function FiberMap( map ){
  return function( done, fail ){
    var result= []
    var errors
    var ballance= 1
    
    for( var key in map ){
      if( !map.hasOwnProperty( key ) ) continue;
      ++ballance;
      map[ key ]( receiver( key ), catcher( key ) )
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
        if( !errors ) errors= []
        errors[ key ]= exception
        subdone()
      }
    }
    
    function subdone( ){
      if( --ballance ) return
      done([ result, errors ])
    }
    
  }
}