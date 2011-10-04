"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $( this )

const Channel= $fenix.Factory( new function() {
    
    this.init=
    function( channel ){
        if( channel instanceof Channel ) channel= Channel.nsIChannel()
        
        this.nsIChannel= function() channel
        
        return this
    }
    
    this.uriTarget=
    function( ){
        return $fenix.Uri( this.nsIChannel().URI )
    }
    
    this.uriSource=
    function( ){
        return $fenix.Uri( this.nsIChannel().originalURI )
    }
    
    this.text=
    $fenix.Poly
    (   $fenix.FiberThread( function( ){

            var result= $fenix.FiberTrigger()
            $.gre.NetUtil.asyncFetch( this.nsIChannel(), result.done )
            let [ input, status ]= yield result

            if( !Components.isSuccessCode( status ) ){
                throw new Error( 'Read from [' + this.uriSource() + '] was ended with status [' + status + ']' )
            } 

            let size= input.available()
            let convStream= $fenix.create.converterInput( input, null, size, null )
            try {
                let data= {}
                convStream.readString( size, data )
                yield $fenix.FiberValue( data.value )
            } finally {
                convStream.close();
            } 
        
        } )
    )

    this.json=
    $fenix.Poly
    (   $fenix.FiberThread( function( ){
            let text= yield this.text()
            let xml= JSON.parse( text )
            yield $fenix.FiberValue( xml )
        } )
    )
    
    this.dom=
    $fenix.Poly
    (   $fenix.FiberThread( function( ){
            
            //if( arguments.length < 2 )
            principal= $fenix.create.systemPrincipal()
            
            var result= $fenix.FiberTrigger()
            $.gre.NetUtil.asyncFetch( this.nsIChannel(), result.done )
            let [ input, status ]= yield result
        
            if( !Components.isSuccessCode( status ) ){
                throw new Error( 'Read from [' + this.uriSource() + '] was ended with status [' + status + ']' )
            } 
        
            try {
                let domParser= $fenix.create.domParser( principal, this.uriSource().nsIURI(), null )
                let doc= domParser.parseFromStream( input, null, input.available(), 'text/xml' )
                let dom= doc.documentElement
                
                if( dom.namespaceURI === 'http://www.mozilla.org/newlayout/xml/parsererror.xml' ){
                    throw new Error( dom.textContent )
                }
                
                yield $fenix.FiberValue( $fenix.Dom( dom ) )
            } finally {
                input.close();
            }
        
        } )
    )

    this.xml=
    $fenix.Poly
    (   $fenix.FiberThread( function( ){
            let dom= yield this.dom()
            yield $fenix.FiberValue( dom.toXML() )
        } )
    )

    this.toString=
    function( ){
        let source= String( this.uriSource() )
        let target= String( this.uriTarget() )
        
        if( source === target ) return 'Channel: ' + source
        else return 'Channel: ' + source + ' -> ' + target
    }
    
})
