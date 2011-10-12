"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $()

const Data= $fenix.Factory( new function Data( ){
    
    this._data= null
    
    this.init=
    function init( data ){
        this.put( data )
        return this
    }
    
    this.destroy=
    function init( data ){
        this.put( null )
        return this
    }
    
    this.id=
    function id( ){
        return null
    }
    
    this.fenixResource=
    function( ){
        return this
    }
    
    this.toString=
    function toString( ){
        return 'Data[' + this.id() + ']'
    }
    
    this.exists=
    $fenix.FiberThread( function exists( ){
        return this
    } )
    
    this.get=
    $fenix.FiberThread( function get( ){
        return this._data
    } )
    
    this.put=
    $fenix.FiberThread( function put( data ){
        this._data= data
        return this
    } )
    
    this.sub=
    $fenix.FiberThread( function sub( ){
        return []
    } )
    
    this.go=
    $fenix.FiberThread( function go( uri ){
        return $fenix.Uri( uri )
    } )
    
})
