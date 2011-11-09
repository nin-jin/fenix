"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
let $fenix= $()

let dir= new function( ){
    
    this.profile= $fenix.File( $fenix.service.dir.get( 'ProfD', $.iface.nsIFile ) )
    this.temp= $fenix.File( $fenix.service.dir.get( 'TmpD', $.iface.nsIFile ) )
    
}
