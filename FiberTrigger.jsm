"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $()

function FiberTrigger( ){
    let doneTrigger
    let failTrigger
    
    let FiberTrigger=
    function trigger( done, fail ){
        doneTrigger= done
        failTrigger= fail
    }

    FiberTrigger.done=
    function done( ){
        FiberTrigger.activate()
        doneTrigger( arguments )
    }

    FiberTrigger.fail=
    function fail( ){
        FiberTrigger.activate()
        failTrigger( arguments )
    }
    
    FiberTrigger.activate=
    function activate( ){
        FiberTrigger.activate=
        function( ){
            throw new Error( 'FiberTrigger was already activated' )
        }
    }
    
    return FiberTrigger
}

