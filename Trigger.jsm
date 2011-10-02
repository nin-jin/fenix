"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $.Autoload( this )

function Trigger( ){
    let doneTrigger
    let failTrigger
    
    let trigger=
    function( done, fail ){
        doneTrigger= done
        failTrigger= fail
    }

    trigger.done=
    function( ){
        trigger.activate()
        doneTrigger( arguments )
    }

    trigger.fail=
    function( ){
        trigger.activate()
        failTrigger( arguments )
    }
    
    trigger.activate=
    function( ){
        trigger.activate=
        function( ){
            throw new Error( 'Trigger was already activated' )
        }
    }
    
    return trigger
}

