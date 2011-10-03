"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $.Autoload( this )

const Dom= $fenix.Factory( new function() {
    
    this.init= function( dom ){
        if( dom instanceof Dom ) file= file.nsIDOMNode()
        
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

Dom.fromChannel=
$fenix.FiberThread( function( channel, principal ){
    
    if( arguments.length < 2 ) principal= $fenix.create.systemPrincipal()
    
    var result= $fenix.FiberTrigger()
    $.gre.NetUtil.asyncFetch( channel, result.done )
    let [ input, status ]= yield result

    if( !Components.isSuccessCode( status ) ){
        throw new Error( 'Read from [' + channel.originalURI + '] was ended with status [' + status + ']' )
    } 

    try {
        let domParser= $fenix.create.domParser( principal, channel.originalURI, null )
        let doc= domParser.parseFromStream( input, null, input.available(), 'text/xml' )
        let dom= doc.documentElement
        
        if( dom.namespaceURI === 'http://www.mozilla.org/newlayout/xml/parsererror.xml' ){
            throw new Error( dom.textContent )
        }
        
        yield $fenix.FiberValue( Dom( dom ) )
    } finally {
        input.close();
    }

} )
