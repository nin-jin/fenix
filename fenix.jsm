"use strict"

const EXPORTED_SYMBOLS = [ 'EXPORTED_SYMBOLS', '$class', '$Constructor', '$iface', '$result', '$utils', '$fenix' ]

const $class= Components.classes
const $Constructor= Components.Constructor
const $iface= Components.interfaces
const $result= Components.results
const $utils= Components.utils

$utils.import( ( __URI__ && __URI__.spec || __LOCATION__ && __LOCATION__.path ).replace( /([&\\/]*)$/, 'Modules.jsm' ) )

const $fenix= Modules( this )