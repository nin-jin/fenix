"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $( this )

const Dom= $fenix.Factory( new function() {
    
    this.init=
    function( dom ){
        if( dom instanceof Dom ) dom= dom.nsIDOMNode()
        
        this.nsIDOMNode= function() dom
        
        return this
    }
    
    this.toXMLString=
    function( ){
        return $fenix.service.domSerializer.serializeToString( this.nsIDOMNode() )
    }
    
    this.toXML=
    function( ){
        return new XML( this.toXMLString() )
    }

})
