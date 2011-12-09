"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
let $fenix= $()

let Pref= $fenix.Factory( new function Pref( ){
    
    this.init=
    function init( pref ){
        if( pref instanceof Pref ) return pref
        this.nsIPrefBranch= function() pref
        return this
    }
    
    this.destroy=
    function destroy( ){
        this.nsIPrefBranch= null
        return this
    }
    
    this.go=
    function go( rel ){
        return $fenix.Pref.fromString( this + rel )
    }
    
    this.get=
    function get( ){
        let nsIPrefBranch= this.nsIPrefBranch()
        let type= nsIPrefBranch.getPrefType( '' )
        
        if( type === nsIPrefBranch.PREF_INT ) return nsIPrefBranch.getIntPref( '' )
        if( type === nsIPrefBranch.PREF_BOOL ) return nsIPrefBranch.getBoolPref( '' )
        if( type === nsIPrefBranch.PREF_STRING ) return nsIPrefBranch.getCharPref( '' )
        
        let sub= this.sub()
        if( !sub.length ) return null
        
        let map= {}
        let rootLength= String( this ).length
        for each( let pref in sub ){
            let key= String( pref ).substring( rootLength )
            map[ key ]= pref.get()
        }
        return map
    }
    
    this.sub=
    function sub( ){
        let pref= this
        return this.nsIPrefBranch().getChildList( '', [] ).sort().map( function( key ) pref.go( key ) )
    }
    
    this.drop=
    function drop( ){
        try {
            this.nsIPrefBranch().resetBranch( '' )
        } catch( exception ){
            if( exception.name !== 'NS_ERROR_NOT_IMPLEMENTED' ) throw exception
            
            let nsIPrefBranch= this.nsIPrefBranch()
            
            try {
                nsIPrefBranch.clearUserPref( '' )
            } catch( exception2 ){
                if( exception2.name != 'NS_ERROR_UNEXPECTED' ) throw exception2
            }
            
            this.sub().forEach( function( pref ) pref.drop() )
        }
        return this
    }

    this.put=
    function put( value ){
        let type= typeof value
        switch( type ){
            
            case 'string':
                this.drop().nsIPrefBranch().setCharPref( '', value )
                return this
            
            case 'boolean':
                this.drop().nsIPrefBranch().setBoolPref( '', value )
                return this
            
            case 'number':
                this.drop().nsIPrefBranch().setIntPref( '', value )
                return this
            
            case 'object':
                for( let key in value ){
                    this.go( key ).put( value[ key ] )
                }
                return this
            
            default:
                throw new Exception( 'Type [' + type + '] is not suported' )
        }
    }

    this.toString=
    function toString( ){
        return this.nsIPrefBranch().root
    }
    
})

Pref.fromString=
function( id ){
    return $fenix.Pref( $fenix.service.pref.getBranch( id ) )
}