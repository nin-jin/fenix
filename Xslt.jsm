"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $( this )

const Xslt= $fenix.Factory( new function() {
    
    let nSpaces= new function() {
        this.xul= 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul'
        this.lux= 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.lux'
    }

    this.init=
    function init( dom ){
        if( dom instanceof $fenix.Xslt ) dom= dom.dom()
        dom= $fenix.Dom( dom )
        
        // security workaround 
        dom.swapNS( nSpaces.xul, nSpaces.lux )
        
        this.dom= function() dom
        
        return this
    }
    
    this.toXMLString=
    function toXMLString( ){
        return this.xml().toXMLString()
    }
    
    this.toXML=
    function toXML( ){
        return this.xml().toXML()
    }
    
    this.nsIXSLTProcessor=
    function nsIXSLTProcessor( ){
        return $.create.domTransformer( this.dom().nsIDOMNode() )
    }

    this.process=
    function process( dom ){
        dom= $fenix.Dom( dom )
        
        let doc= $fenix.create.domDoc()
        let frag= this.nsIXSLTProcessor().transformToFragment( dom, doc )

        // https://bugzilla.mozilla.org/show_bug.cgi?id=600819
        doc.appendChild( frag )
        
        let result= $fenix.Dom( doc.documentElement ).swapNS( nSpaces.lux, nSpaces.xul )
        
        return result;
    }
})
