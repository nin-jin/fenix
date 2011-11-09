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
        if( dom instanceof $fenix.Xslt ) dom= dom.dom()
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
    
    this.nsIXSLTProcessor=
    function nsIXSLTProcessor( ){
        return $fenix.create.domTransformer( this.dom().nsIDOMNode() )
    }

    this.process=
    function process( dom ){
        let input= $fenix.Dom( dom ).nsIDOMNode()

        let doc= $fenix.create.domDoc()
        let frag= this.nsIXSLTProcessor().transformToFragment( input, doc )
        doc.appendChild(frag)

        let result= $fenix.Dom( doc.documentElement ).swapNS( ns.lux, ns.xul )
        return result;
    }
})