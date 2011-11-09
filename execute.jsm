"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
let $fenix= $()

let execute= $fenix.FiberThread( function execute( command ){
    let time= Date.now()
    let script= $fenix.dir.temp.go( time + '.cmd' )
    let out= script.go( './' + time + '.out' )

    yield script.put( command + ' > ' + out )
    try {
        yield script.execute()
    } catch( exception ){
        throw $fenix.extendException( exception, 'Command: [' + command + ']' )
    }
    let text= yield out.get()
    yield script.drop()
    yield out.drop()
    yield $fenix.FiberValue( text )

} )
