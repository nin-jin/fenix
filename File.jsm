"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
let $fenix= $()

let File= $fenix.Factory( new function Data( ){
    
    this.nsIFile= null
    
    this.init=
    function init( file ){
        if( file instanceof File ) return file
        this.nsIFile= function() file
        return this
    }
    
    this.destroy=
    function destroy( ){
        this.nsIFile= null
        return this
    }
    
    this.nsIURI=
    function nsIURI( ){
        return $fenix.service.io.newFileURI( this.nsIFile() )
    }
    
    this.nsIChannel=
    function nsIChannel( ){
        return this.uri().nsIChannel()
    }

    this.uri=
    function uri( ){
        return $fenix.Uri( this.nsIURI() )
    }
    
    this.fenixResource=
    function fenixResource( ){
        return this
    }
    
    this.toString=
    function toString( ){
        return this.nsIFile().path
    }
    
    this.exists=
    $fenix.FiberThread( function exists( ){
        return this.nsIFile().exists() ? this : null
    } )
    
    this.get=
    function get( ){
        return $fenix.Uri( this.nsIURI() ).get()
    }
    
    this.put=
    $fenix.FiberThread( function put( data ){
        let exists= yield this.exists()
        if( !exists ){
            let dir= this.go( '.' )
            let dirExists= yield dir.exists()
            if( !dirExists ) dir.nsIFile().create( $.iface.nsIFile.DIRECTORY_TYPE, -1 )
            this.nsIFile().create( $.iface.nsIFile.NORMAL_FILE_TYPE, -1 )
        }
        
        let output = $.gre.FileUtils.openSafeFileOutputStream( this.nsIFile() )
        
        let converter= $fenix.create.converterUnicode()
        converter.charset= 'UTF-8'
        let input= converter.convertToInputStream( data )

        var result= $fenix.FiberTrigger()
        $.gre.NetUtil.asyncCopy( input, output, result.done )
        let [ status ]= yield result

        if( !Components.isSuccessCode( status ) ){
            throw new Error( 'Write to [' + this + '] was ended with status [' + status + ']' )
        }
    } )
    
    this.sub=
    $fenix.FiberThread( function sub( ){
        return []
    } )
    
    this.go=
    function go( uri ){
        return this.uri().go( uri ).file()
    }
    
    this.execute=
    $fenix.FiberThread( function( ){
        let process= $fenix.create.process( this.nsIFile() )
        let result= $fenix.FiberTrigger()
        process.runAsync( arguments, arguments.length, result.done )
        let[ subject, topic, data ]= yield result

        if( topic === 'process-failed' ) throw new Error( 'Failed execution of [' + this + ']' )
        if( process.exitValue ) throw new Error( 'Execution of [' + this + '] ends with code [' + process.exitValue + ']' )
    } )

    this.mimeType=
    function mimeType( ){
        try {
            return $fenix.service.mime.getTypeFromFile( this.nsIFile() )
        } catch( exception ){
            if( exception.name !== 'NS_ERROR_NOT_AVAILABLE' ) throw exception
            return 'application/octet-stream'
        }
    }
    
    this.drop=
    $fenix.FiberThread( function drop( ){
        return this.nsIFile().remove( true )
    } )

})

File.fromString=
function( path ){
    return File( $fenix.create.fileLocal( path ) )
}