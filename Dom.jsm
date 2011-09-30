"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $.Autoload( this )

const Dom= $fenix.Factory( new function() {
    
    this.init= function( dom ){
        if( dom instanceof Dom ) file= file.nsIDOMNode
        
        this.nsIDOMNode= dom
        
        return this
    }
    
    this.toXMLString= function( ){
        return $fenix.service.domSerializer.serializeToString( this.nsIDOMNode )
    }

})

Dom.fromChannel= function( channel ){
    return $fenix.Fiber( function( done, fail ){
                
        let callback= function( input, status ){
            try {
                try {
                    let security= $fenix.service.security
                    let principal= security.getSystemPrincipal && security.getSystemPrincipal() || null
                    
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
        
        $fenix.module.NetUtil.asyncFetch( channel, callback )

    } )
}
