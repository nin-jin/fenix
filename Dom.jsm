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

Dom.fromChannel= function( channel, principal ){
    if( arguments.length < 2 ) principal= $fenix.create.systemPrincipal()
    return $fenix.Fiber( function( done, fail ){
        
        let callback= function( input, status ){
            try {
                try {
                    let domParser= $fenix.create.domParser( principal, channel.originalURI, null )
                    let doc= domParser.parseFromStream( input, null, input.available(), 'text/xml' )
                    let dom= doc.documentElement
                    
                    if( dom.namespaceURI === 'http://www.mozilla.org/newlayout/xml/parsererror.xml' ){
                        throw new Error( dom.textContent )
                    }
                    
                    done( Dom( dom ) );
                }
                finally {
                    input.close();
                }
            } catch( exception ){
                fail( exception )
            }
        }
        
        $.gre.NetUtil.asyncFetch( channel, callback )

    } )
}
