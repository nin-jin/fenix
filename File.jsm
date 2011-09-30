"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $.Autoload( this )

const File = $fenix.Factory( new function() {
    
    this.init = function( file ){
        if( file instanceof File ) file= file.nsIFile
        
        this.nsIFile= file
        
        return this
    }

    this.follow = function( relativePath ){
        let file = this.nsIFile.clone()

        let nameList = relativePath.split( '/' )
        for each( let name in nameList ){
            if (!name) continue
            if (name === ".") continue
            if (name === "..") file= file.parent
            else file.append( name )
        }

        return File( file )
    }
    
    this.__defineGetter__( 'exists', function( ){
        return this.nsIFile.exists() ? this : null
    } )
    
    this.__defineSetter__( 'exists', function( value ){
        if( this.exists === value ) return this

        if( value ){
            this.parent.dir= true
            this.nsIFile.create( $.iface.nsIFile.NORMAL_FILE_TYPE, -1 )
        } else {
            this.nsIFile.remove( true )
        }

        return this
    } )
    
    this.__defineGetter__( 'readable', function( ){
        return this.exists && this.nsIFile.isReadable() ? this : null
    } )
    
    this.__defineGetter__( 'writable', function( ){
        return this.nsIFile.isWritable() ? this : null
    } )
    
    this.__defineGetter__( 'file', function( ){
        return this.nsIFile.isFile() ? this : null
    } )
    
    this.__defineGetter__( 'dir', function( ){
        return this.nsIFile.isDirectory() ? this : null
    } )
    
    this.__defineSetter__( 'dir', function( value ){
        if( !value ) throw new Error( 'Wrong value [' + value + ']' )
        if( this.dir ) return this

        common.api.Files.forceDirectories(this.follow("..").nsIFile);
        return this;
    } )
    
    this.__defineGetter__( 'nsIURI', function( ){
        return $fenix.service.io.newFileURI( this.nsIFile )
    } )

    this.__defineGetter__( 'nsIChannel', function( ){
        return $fenix.service.io.newChannelFromURI( this.nsIURI )
    } )

    this.__defineGetter__( 'dataURI', function( ){
        return common.api.Files.getDataUri(this.nsIFile);
    } )
    
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
                
                $fenix.module.NetUtil.asyncFetch( self.nsIChannel, callback );
                
            })
        } )
    ,   function( value ){
            let self= this
            return $fenix.Fiber( function( done, fail ){
                
                let output = $fenix.module.FileUtils.openSafeFileOutputStream( self.nsIFile )
                
                let converter= $fenix.create.converterUnicode()
                converter.charset= 'UTF-8'
                let input= converter.convertToInputStream( value )
                
                let callback= function( status ){
                  if( Components.isSuccessCode( status ) ) done( self )
                  else throw new Error( 'Write to [' + this.path + '] was ended with status [' + status + ']' )
                }
                
                $fenix.module.NetUtil.asyncCopy( input, output, callback )

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
            return $fenix.Dom.fromChannel( this.nsIChannel )
        }
    ,   function( value ){
            return this.text( $fenix.Dom( value ).toXMLString() )
        }
    )

    this.xml=
    $fenix.Poly
    (   $fenix.FiberAsync( function( ){
            let dom= yield this.dom()
            let xml= new XML( dom.toXMLString() )
            yield $fenix.FiberValue( xml )
        } )
    ,   function( value ){
            let text= value.toXMLString()
            return this.text( text )
        }
    )

})

File.fromPath= function( path ){
    return File( $fenix.create.fileLocal( path ) )
}
