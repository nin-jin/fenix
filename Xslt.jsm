"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
let $fenix= $()

let Xslt= $fenix.Factory( new function() {
    
    let ns= new function() {
        this.xul= 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul'
        this.lux= 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.lux'
    }

    this.init=
    function init( dom ){
        if( dom instanceof $fenix.Xslt ) return dom
        dom= $fenix.Dom( dom )
        
        // security workaround https://bugzilla.mozilla.org/show_bug.cgi?id=600819
        dom.swapNS( ns.xul, ns.lux )
        
        this.dom= function() dom
        
        return this
    }
    
    this.toString=
    function toXMLString( ){
        return String( this.dom() )
    }
    
    this.nsIDOMNode=
    function nsIDOMNode( ){
        return this.dom().nsIDOMNode()
    }
    
    this._nsIXSLTProcessor= null
    this.nsIXSLTProcessor=
    function nsIXSLTProcessor( ){
        if( this._nsIXSLTProcessor ) return this._nsIXSLTProcessor
        return this._nsIXSLTProcessor= $fenix.create.domTransformer( this.nsIDOMNode() )
    }

    this.process=
    function process( dom ){
        let input= $fenix.Dom( dom ).nsIDOMNode()
        let doc= $fenix.Dom.fromString( '<xml/>' ).doc()

        let frag= this.nsIXSLTProcessor().transformToFragment( input, doc.nsIDOMDocument() )
        doc.root().drop()
        doc.append( frag )

        return doc.root().swapNS( ns.lux, ns.xul )
    }
})