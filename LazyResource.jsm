"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $()

const LazyResource= function LazyResource( getter, invalidator ){
    getter= $fenix.FiberThread( getter )
    if( invalidator ) invalidator= $fenix.FiberThread( invalidator )
    
    let cache= {}
  
    let prop= function prop( ) this
  

    function key4args( args ){
        return '\n' + [].slice.call( args ).map( function( key ) key + '\n' ).join( '' )
    }

    prop.get= $fenix.FiberThread( function get( ){
        let key= key4args( arguments )

        if( cache.hasOwnProperty( key ) ){
            yield $fenix.FiberValue( cache[ key ] )
        } else {
            cache[ key ]= yield getter.apply( this(), arguments )
        }
    } )
  
    prop.drop= function drop( ){
        let prefix= key4args( arguments )

        let some= false
        for each( let[ key, value ] in Iterator( cache ) ){
            if( key.indexOf( prefix ) ) continue
            delete cache[ key ]
            some= true
        }
        
        if( invalidator ) return invalidator.apply( this(), arguments )

        return $fenix.FiberValue()
    }
  
    prop.toString= function toString() String( getter )
    
    return prop

}
