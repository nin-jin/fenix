"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
let $fenix= $()

let dates= {}

function gaugeTime( from, to ){
    if( to ){
        let now= dates[ to ]= Date.now()
        $fenix.log( from + ' .. ' + to + ': ' + ( now - dates[ from ] ) )
    } else {
        dates[ from ]= Date.now()
    }
}
