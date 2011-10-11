"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $()

const execute= $fenix.FiberThread( function execute( command ){
    let time= Date.now()
    let script= $fenix.dir.temp.follow( time + '.cmd' )
    let out= script.follow( './' + time + '.out' )

    try {
        yield script.text( command + ' > ' + out.path() )
        try {
            yield script.execute()
        } catch( exception ){
            throw $fenix.extendException( exception, 'Command: [' + command + ']' )
        }
        yield out.text()
    } finally {
        script.exists( false )
        out.exists( false )
    }
} )
