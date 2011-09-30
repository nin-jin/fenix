"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )

const module= new function(){

    this.XPCOMUtils= $.util.import( 'resource://gre/modules/XPCOMUtils.jsm', {} ).XPCOMUtils
    this.NetUtil= $.util.import( 'resource://gre/modules/NetUtil.jsm', {} ).NetUtil
    this.FileUtils= $.util.import( 'resource://gre/modules/FileUtils.jsm', {} ).FileUtils

}
