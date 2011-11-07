"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $()

function FiberTrigger( ){
    let doneTrigger
    let failTrigger
    
    let FiberTrigger=
    $fenix.Fiber( function trigger( done, fail ){
        doneTrigger= done
        failTrigger= fail
    } )

    FiberTrigger.done=
    function done( ){
        FiberTrigger.activate()
        doneTrigger( arguments )
    }
    FiberTrigger.done.observe= FiberTrigger.done

    FiberTrigger.fail=
    function fail( ){
        FiberTrigger.activate()
        failTrigger( arguments, doneTrigger )
    }
    
    FiberTrigger.activate=
    function activate( ){
        FiberTrigger.activate=
        function( ){
            $fenix.fail( new Error( 'FiberTrigger was already activated' ) )
        }
    }
    
    return FiberTrigger
}

