"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $()

const Dom= $fenix.Factory( new function() {
    
    this.init=
    function init( dom ){
        if( dom instanceof Dom ) dom= dom.nsIDOMNode()
        
        this.nsIDOMNode= function() dom
        
        return this
    }
    
    this.toXMLString=
    function toXMLString( ){
        return $fenix.service.domSerializer.serializeToString( this.nsIDOMNode() )
    }
    
    this.toXML=
    function toXML( ){
        return new XML( this.toXMLString() )
    }

})
