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
    
    this.transform=
    function transform( xslt ){
        return $fenix.Xslt( xslt ).process( this )
    }
    
    var xulDoc= common.api.XMLUtils.xmlDocFromString( '<window xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul" />' )
    
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
