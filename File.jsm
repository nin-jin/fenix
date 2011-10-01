"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $.Autoload( this )

const File = $fenix.Factory( new function() {
    
    this.init = function( file ){
        if( file instanceof File ) file= file.nsIFile()
        
        this.nsIFile= function() file
        
        return this
    }
    
    this.path=
    function( ){
        return this.nsIFile().path
    }

    this.follow=
    function( relativePath ){
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
    (   function( ){
            return this.nsIFile().exists() ? this : null
        }
    ,   function( value ){
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
    function( ){
        return this.exists() && this.nsIFile().isReadable() ? this : null
    }
    
    this.writable=
    function( ){
        return this.nsIFile().isWritable() ? this : null
    }
    
    this.file=
    $fenix.Poly
    (   function( ){
            return this.nsIFile().isFile() ? this : null
        }
    ,   function( value ){
            if( !value ) throw new Error( 'Wrong value [' + value + ']' )
            if( this.file() ) return this
    
            this.parent.dir( true )
            this.nsIFile().create( $.iface.nsIFile.NORMAL_FILE_TYPE, -1 )
    
            return this;
        }
    )
    
    this.dir=
    $fenix.Poly
    (   function( ){
            return this.nsIFile().isDirectory() ? this : null
        }
    ,   function( value ){
            if( !value ) throw new Error( 'Wrong value [' + value + ']' )
            if( this.dir() ) return this
    
            this.nsIFile().create( $.iface.nsIFile.DIRECTORY_TYPE, -1 )
    
            return this;
        }
    )
    
    this.mimeType=
    function( ){
        try {
            return $fenix.service.mime.getTypeFromFile( this.nsIFile() )
        } catch( exception ){
            if( exception.name !== 'NS_ERROR_NOT_AVAILABLE' ) throw exception
            return 'application/octet-stream'
        }
    }
    
    this.uri=
    function( ){
        return $fenix.Uri( $fenix.service.io.newFileURI( this.nsIFile() ) )
    }

    this.nsIChannel=
    function( ){
        return this.uri().nsIChannel()
    }

    this.text=
    $fenix.Poly
    (   $fenix.FiberAsync( function( ){
            let self= this
            return $fenix.Fiber( function( done, fail ){
                
                let callback= function( input, status ){
                    try {
                        if( !Components.isSuccessCode( status ) ){
                            throw new Error( 'Read from [' + this.path + '] was ended with status [' + status + ']' )
                        } else {
                            let size= input.available()
                            let convStream= $fenix.create.converterInput( input, null, size, null )
                            try {
                                let data= {}
                                convStream.readString( size, data )
                                done( data.value )
                            } finally {
                                convStream.close();
                            } 
                        }
                    } catch( exception ){
                        fail( exception )
                    }
                }
                
                $.gre.NetUtil.asyncFetch( self.nsIChannel(), callback );
                
            })
        } )
    ,   function( value ){
            let self= this
            return $fenix.Fiber( function( done, fail ){
                
                let output = $.gre.FileUtils.openSafeFileOutputStream( self.nsIFile() )
                
                let converter= $fenix.create.converterUnicode()
                converter.charset= 'UTF-8'
                let input= converter.convertToInputStream( value )
                
                let callback= function( status ){
                  if( Components.isSuccessCode( status ) ) done( self )
                  else throw new Error( 'Write to [' + this.path + '] was ended with status [' + status + ']' )
                }
                
                $.gre.NetUtil.asyncCopy( input, output, callback )

            })
        }
    )
    
    this.json=
    $fenix.Poly
    (   $fenix.FiberAsync( function( ){
            let text= yield this.text()
            let xml= JSON.parse( text )
            yield $fenix.FiberValue( xml )
        } )
    ,   function( value ){
            let text= JSON.stringify( value )
            return this.text( text )
        }
    )
    
    this.dom=
    $fenix.Poly
    (   function( ){
            return $fenix.Dom.fromChannel( this.nsIChannel() )
        }
    ,   function( value ){
            return this.text( $fenix.Dom( value ).toXMLString() )
        }
    )

    this.xml=
    $fenix.Poly
    (   $fenix.FiberAsync( function( ){
            let dom= yield this.dom()
            yield $fenix.FiberValue( dom.toXML() )
        } )
    ,   function( value ){
            return this.text( value.toXMLString() )
        }
    )

})

File.fromPath= function( path ){
    return File( $fenix.create.fileLocal( path ) )
}
