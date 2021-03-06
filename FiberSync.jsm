"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
let $fenix= $()

function FiberSync( map ){
    if( !map ) map= []
    
    let sync= $fenix.Fiber({ runAsync: function fiber( done, fail ){
        var result= []
        var ballance= 1
        
        for( var key in map ){
            if( !map.hasOwnProperty( key ) ) continue;
            
            ++ballance;
            let receive= receiver( key )
            let catche= catcher( key )
            
            try {
                map[ key ].runAsync( receive, catche )
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
      
    } })
    
    sync.add=
    function add( fiber ){
        map.push( fiber )
        return sync
    }
    
    return sync
}