"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )

function Factory(proto) {
    let Instance = function(){};
    Instance.prototype = proto;
    
    let factory = function Factory_instance() {
        let obj = (this instanceof factory) ? this : new Instance;
        if (obj.init) return obj.init.apply(obj, arguments);
        return obj;
    }
    factory.prototype = proto;
    
    proto.constructor = factory;

    return factory;
}
