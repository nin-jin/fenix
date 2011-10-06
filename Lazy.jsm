"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $( this )

function Lazy( make ){
    function get( ){
        let val= make.apply( this )
        get= common.Value( val )
        return val
    }
    return function wrapper( ){
        return get.apply( this, arguments )
    }
}
