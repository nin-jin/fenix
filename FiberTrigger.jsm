"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $( this )

function FiberTrigger( ){
    let doneTrigger
    let failTrigger
    
    let FiberTrigger=
    function( done, fail ){
        doneTrigger= done
        failTrigger= fail
    }

    FiberTrigger.done=
    function( ){
        FiberTrigger.activate()
        doneTrigger( arguments )
    }

    FiberTrigger.fail=
    function( ){
        FiberTrigger.activate()
        failTrigger( arguments )
    }
    
    FiberTrigger.activate=
    function( ){
        FiberTrigger.activate=
        function( ){
            throw new Error( 'FiberTrigger was already activated' )
        }
    }
    
    return FiberTrigger
}

