"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $()

const console2socket= $fenix.FiberThread( function( host, port ){

    let transport = $fenix.service.socket.createTransport( null, 0, host, port, null )
    let output= transport.openOutputStream( 0, 0, 0 )
    
    $fenix.service.console.registerListener({ observe: function( message ){
        send( message )
    } } )

    let out= {}
    $fenix.service.console.getMessageArray( out, {} )
    let messageList= out.value
    
    for each( let message in messageList ){
        try {
            message= message.QueryInterface( $.iface.nsIScriptError )
            message= message.QueryInterface( $.iface.nsIScriptError2 )
        } catch( e ){ }
        send( message )
    }

    function send( message ){
        let file= message.sourceName || ''
        let line= message.lineNumber || 0
        let time= message.timeStamp || 0
        
        let level
        switch( message.flags ){
            case $.iface.nsIScriptError.exceptionFlag: level= 'ERROR'; break
            case $.iface.nsIScriptError.errorFlag: level= 'ERROR'; break
            case $.iface.nsIScriptError.warningFlag: level= 'WARN'; break
        }

        let descr= message.errorMessage || message.message
        
        let matches= /^\[JavaScript (Error|Warning): "([\s\S]*)" \{file: "(.*)" line: (\d+)(?: column: (\d+))?(?: source: "(.*)")?\}\]$/.exec( descr )
        if( matches ) try {
            file= file || matches[3]
            line= line || matches[4]
            descr= matches[2]
            level= level || matches[1]
        } catch( e ){ }
        
        if( !file ) file= 'unknown'
        if( !level ) level= 'DEBUG'
        if( !time ) time= Date.now()
        
        let logger= 'Firefox.' + file.split( $fenix.dir.profile.uri() + '' ).join( '' ).replace( /\.\w+/g, '' ).replace( /[\/\\]+/g, '.' )

        let messageXML= <>
            <log4j:event xmlns:log4j='' logger={logger} level={level} thread='unknown' timestamp={time}>
                <log4j:message>{descr}</log4j:message> 
                <log4j:locationInfo class='Abc' method='foo' file={file} line={line}/>
            </log4j:event>
        </>.toXMLString()
        
        output.write( messageXML, messageXML.length )
    }
        
} )
