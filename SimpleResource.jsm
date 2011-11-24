"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $()

const SimpleResource= function SimpleResource( getter ){
    getter= $fenix.FiberThread( getter )

    let prop= function prop( ) this
  
    prop.get= function get( key ){
        return getter.apply( this(), arguments )
    }
  
    prop.toString= function toString() String( getter )
    
    return prop

}
