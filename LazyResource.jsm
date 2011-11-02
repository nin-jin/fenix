"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $( '../fx/' )

const LazyResource= function LazyResource( getter, invalidator ){
    getter= $fenix.FiberThread( getter )
    if( invalidator ) invalidator= $fenix.FiberThread( invalidator )
    
    let cache
  
    let prop= function prop( ) this
  
    prop.get= $fenix.FiberThread( function get( key ){
        let value= cache && cache[ key ]
        if( value === void 0 ){
            if( !cache ) cache= { }
            cache[ key ]= yield getter.apply( this(), arguments )
        } else {
            yield $fenix.FiberValue( value )
        }
    } )
  
    prop.drop= $fenix.FiberThread( function drop( key ){
        if( cache ){
            if( key === void 0 ){
                cache= void 0
                if( invalidator ) yield invalidator.apply( this(), arguments )
            } else {
                let key= key4args( arguments )
                let value= cache[ key ]
                if( value !== void 0 ){
                    cache[ key ]= void 0
                    if( invalidator ){
                        yield invalidator.apply( this(), arguments )
                    }
                }
            }
        }
    } )
  
    prop.toString= function toString() String( getter )
    
    return prop

}

function key4args( args ){
    return [].join.call( args, '\n' )
}
