"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
let $fenix= $()

let Dom= $fenix.Factory( new function() {
    
    this.init=
    function init( dom ){
        if( dom instanceof Dom ) return dom
        this.nsIDOMNode= function() dom
        return this
    }
    
    this.nsIDOMDocument=
    function nsIDOMDocument( ){
        let nsIDOMNode= this.nsIDOMNode()
        return nsIDOMNode.ownerDocument || nsIDOMNode
    }
    
    this.doc=
    function doc( ){
        return $fenix.Dom( this.nsIDOMDocument() )
    }
    
    this.root=
    function doc( ){
        return $fenix.Dom( this.nsIDOMDocument().documentElement )
    }
    
    this.destroy=
    function destroy( ){
        this.nsIDOMNode= null
    }
    
    this.toString=
    function toString( ){
        return $fenix.service.domSerializer.serializeToString( this.nsIDOMNode() )
    }
    
    this.select=
    function select( xpath, xmlns ){
        let found= this.nsIDOMDocument().evaluate( xpath, this.nsIDOMNode(), function( prefix ) xmlns[ prefix ], null, null )
        let list= []
        for( let node; node= found.iterateNext(); ) list.push( $fenix.Dom( node ) )
        return list
    }
    
    this.name=
    function name( ){
        return this.nsIDOMNode().nodeName
    }
    
    this.value=
    function value( ){
        return this.nsIDOMNode().textContent
    }
    
    this.drop=
    function drop( ){
        let nsIDOMNode= this.nsIDOMNode()
        nsIDOMNode.parentNode.removeChild( nsIDOMNode )
        return this
    }
    
    this.clone=
    function clone( ){
        return Dom( this.nsIDOMNode().cloneNode( true ) )
    }
    
    this.append=
    function parent( dom ){
        this.nsIDOMNode().appendChild( Dom( dom ).clone().nsIDOMNode() )
        return this
    }
    
    this.transform=
    function transform( xslt ){
        return $fenix.Xslt( xslt ).process( this )
    }
    
    let xulDoc= $fenix.create.domDoc( 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul' )

    this.swapNS=
    function swapNS( sourceNS, targetNS ){
        let doc= this.nsIDOMDocument()
        let sourceNodes= doc.evaluate( '//from:*', this.nsIDOMNode(), function() sourceNS, null, null )
        let sourceElements= []
        for( let sourceNode; sourceNode= sourceNodes.iterateNext(); ) sourceElements.push( sourceNode )
        
        for each( let sourceNode in sourceElements ){
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
    if( uri === void 0 ) uri= $fenix.Uri.fromString( 'null:null' ).nsIURI()
    if( principal === void 0 ) principal= this

    let parser= $fenix.create.domParser( principal, uri, uri )
    let dom= parser.parseFromString( String( text ), 'text/xml' ).documentElement
    
    if( dom.namespaceURI === 'http://www.mozilla.org/newlayout/xml/parsererror.xml' ){
        throw new Error( dom.textContent )
    }
    
    return Dom( dom )
}    

Dom.fromHTMLString=
function fromHTMLString( text ){
    return $fenix.Dom( $fenix.create.htmlDoc().createRange().createContextualFragment( text ) )
}

Dom.fromResource=
$fenix.FiberThread( function fromResource( resource, principal ){
    let text= yield resource.get()
    let dom= Dom.fromString( text, resource.nsIURI(), principal )
    yield $fenix.FiberValue( dom )
} )
