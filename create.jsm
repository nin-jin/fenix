"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )

const create= new function(){

    this.timer= $.Maker( '@mozilla.org/timer;1', 'nsITimer', 'initWithCallback' )
    this.error= $.Maker( '@mozilla.org/scripterror;1', 'nsIScriptError', 'init' )
    this.file=  $.Maker( '@mozilla.org/file/local;1', 'nsILocalFile', 'initWithPath' )

}
