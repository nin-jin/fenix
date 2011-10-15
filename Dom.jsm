"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $()

const Dom= $fenix.Factory( new function() {
    
    this.init=
    function init( dom ){
        if( dom instanceof Dom ) return dom
        this.nsIDOMNode= function() dom
        return this
    }
    
    this.destroy=
    function destroy( ){
        this.nsIDOMNode= null
    }
    
    this.toString=
    function toString( ){
        return $fenix.service.domSerializer.serializeToString( this.nsIDOMNode() )
    }
    
    this.transform=
    function transform( xslt ){
        return $fenix.Xslt( xslt ).process( this )
    }
    
    let xulDoc= $fenix.create.domDoc( 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul' )

    this.swapNS=
    function swapNS( sourceNS, targetNS ){
        let rootNode= this.nsIDOMNode()
        let doc= rootNode.ownerDocument
        let sourceElements= doc.evaluate( '//from:*', rootNode, function() sourceNS, null, null )
        
        for( let sourceNode; sourceNode= sourceElements.iterateNext(); ){
            let targetNode= xulDoc.createElementNS( targetNS, sourceNode.localName )
            targetNode= doc.importNode( targetNode, true )
            
            let attrs= sourceNode.attributes
            for( let i= 0, len= attrs.length; i < len; i++ ){
                let sourceAttr= attrs[i]
                if( sourceAttr.prefix ){
                    let attrNS= sourceNode.namespaceURI
                    if( attrNS === sourceNS ) attrNS= targetNS
                    targetNode.setAttributeNS( attrNS, sourceAttr.localName, sourceAttr.nodeValue )
                } else {
                    targetNode.setAttribute( sourceAttr.localName, sourceAttr.nodeValue )
                }
            }

            for( let childNode; childNode= sourceNode.firstChild; ){
                targetNode.appendChild( childNode )
            }

            sourceNode.parentNode.replaceChild( targetNode, sourceNode )
        }
        
        return this
    }

})

Dom.fromString=
function fromString( text, uri, principal ){
    if( arguments.length < 2 ) uri= $fenix.Uri.fromString( 'null:null' ).nsIURI()
    if( arguments.length < 3 ) principal= $fenix.create.systemPrincipal()
    let parser= $fenix.create.domParser( principal, uri, null )
    let dom= parser.parseFromString( String( text ), 'text/xml' ).documentElement
    if( dom.namespaceURI === 'http://www.mozilla.org/newlayout/xml/parsererror.xml' ){
        throw new Error( dom.textContent )
    }
    return Dom( dom )
}    

Dom.fromResource=
$fenix.FiberThread( function fromResource( resource, principal ){
    let text= yield resource.get()
    let dom= Dom.fromString( text, resource.nsIURI(), principal )
    yield $fenix.FiberValue( dom )
} )
