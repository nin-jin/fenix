"use strict"
Components.utils.import( 'resource://fenix/fenix.jsm' )
const $fenix= $.Autoload( this )

const create= new function(){

    this.timer= $.Maker( '@mozilla.org/timer;1', 'nsITimer', 'initWithCallback' )
    this.error= $.Maker( '@mozilla.org/scripterror;1', 'nsIScriptError', 'init' )

}
