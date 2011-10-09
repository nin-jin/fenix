"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $()

const File = $fenix.Factory( new function() {
    
    this.init=
    function init( file ){
        if( typeof file === 'string' ) file= $fenix.create.fileLocal( file )
        if( file instanceof File ) file= file.nsIFile()
        
        this.nsIFile= function() file
        
        return this
    }
    
    this.path=
    function path( ){
        return this.nsIFile().path
    }
    
    this.toString=
    function toString( ){
        return this.path()
    }

    this.follow=
    function follow( relativePath ){
        let file = this.nsIFile().clone()

        let nameList = relativePath.split( '/' )
        for each( let name in nameList ){
            if (!name) continue
            if (name === ".") continue
            if (name === "..") file= file.parent
            else file.append( name )
        }

        return File( file )
    }
    
    this.exists=
    $fenix.Poly
    (   function exists_get( ){
            return this.nsIFile().exists() ? this : null
        }
    ,   function exists_put( value ){
            if( this.exists() === value ) return this
    
            if( value ){
                this.file( true )
            } else {
                this.nsIFile().remove( true )
            }
    
            return this
        }
    )
    
    this.readable=
    function readable( ){
        return this.exists() && this.nsIFile().isReadable() ? this : null
    }
    
    this.writable=
    function eritable( ){
        return this.nsIFile().isWritable() ? this : null
    }
    
    this.file=
    $fenix.Poly
    (   function file_get( ){
            return this.nsIFile().isFile() ? this : null
        }
    ,   function file_put( value ){
            if( !value ) throw new Error( 'Wrong value [' + value + ']' )
            if( this.file() ) return this
    
            this.parent.dir( true )
            this.nsIFile().create( $.iface.nsIFile.NORMAL_FILE_TYPE, -1 )
    
            return this;
        }
    )
    
    this.dir=
    $fenix.Poly
    (   function dir_get( ){
            return this.nsIFile().isDirectory() ? this : null
        }
    ,   function dir_put( value ){
            if( !value ) throw new Error( 'Wrong value [' + value + ']' )
            if( this.dir() ) return this
    
            this.nsIFile().create( $.iface.nsIFile.DIRECTORY_TYPE, -1 )
    
            return this;
        }
    )
    
    this.mimeType=
    function mimeType( ){
        try {
            return $fenix.service.mime.getTypeFromFile( this.nsIFile() )
        } catch( exception ){
            if( exception.name !== 'NS_ERROR_NOT_AVAILABLE' ) throw exception
            return 'application/octet-stream'
        }
    }
    
    this.uri=
    function uri( ){
        return $fenix.Uri( $fenix.service.io.newFileURI( this.nsIFile() ) )
    }

    this.channel=
    function channel( ){
        return this.uri().channel()
    }

    this.text=
    $fenix.Poly
    (   function text_get( ){
            return this.channel().text()
        }
    ,   $fenix.FiberThread( function text_put( value ){

            let output = $.gre.FileUtils.openSafeFileOutputStream( self.nsIFile() )
            
            let converter= $fenix.create.converterUnicode()
            converter.charset= 'UTF-8'
            let input= converter.convertToInputStream( value )

            var result= $fenix.FiberTrigger()
            $.gre.NetUtil.asyncCopy( input, output, result.done )
            let [ status ]= yield result

            if( !Components.isSuccessCode( status ) ){
                throw new Error( 'Write to [' + this.path + '] was ended with status [' + status + ']' )
            } 

        } )
    )
    
    this.json=
    $fenix.Poly
    (   function json_get( ){
            return this.channel().json()
        }
    ,   function json_put( value ){
            let text= JSON.stringify( value )
            return this.text( text )
        }
    )
    
    this.dom=
    $fenix.Poly
    (   function dom_get( ){
            return this.channel().dom()
        }
    ,   function dom_put( value ){
            return this.text( $fenix.Dom( value ).toXMLString() )
        }
    )

    this.xml=
    $fenix.Poly
    (   function xml_get( ){
            return this.channel().xml()
        }
    ,   function xml_put( value ){
            return this.text( value.toXMLString() )
        }
    )

})
