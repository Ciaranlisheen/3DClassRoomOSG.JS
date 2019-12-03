/*function getDefaultShaderProgram() {
    var vertexshader = [
        '#ifdef GL_ES',
        'precision highp float;',
        '#endif',
        'attribute vec3 Vertex;',
        'attribute vec4 Color;',
        'uniform mat4 uModelViewMatrix;',
        'uniform mat4 uProjectionMatrix;',
        '',
        'varying vec4 vColor;',
        '',
        'void main(void) {',
        '  gl_Position = uProjectionMatrix * (uModelViewMatrix * vec4(Vertex, 1.0));',
        '  vColor = Color;',
        '}'
    ].join( '\n' );

    var fragmentshader = [
        '#ifdef GL_ES',
        'precision highp float;',
        '#endif',
        'varying vec4 vColor;',

        'void main(void) {',
        'gl_FragColor = vColor;',
        '}'
    ].join( '\n' );

    return program123 = new osg.Program( new osg.Shader( 'VERTEX_SHADER', vertexshader ), new osg.Shader( 'FRAGMENT_SHADER', fragmentshader ) );
}*/

/*function objectInherit(base) {
    function F() {}
    F.prototype = base;
    var obj = new F();
    return obj;
}

var Switch = function () {
    osg.Node.call( this );
};

Switch.prototype = objectInherit(osg.Node.prototype);

Switch.getChildIndex = function(child) {
    for ( var i = 0, l = this.children.length; i < l; i++ ) {
        if ( this.children[ i ] === child ) {
            return i;
        }
    }
    return -1;
};*/

//window.addEventListener("load", main ,true);

function objectInherit(base) {
    function F() {}
    F.prototype = base;
    var obj = new F();
    return obj;
}


var ee497 = {};

ee497.globalify = function() {

    var Switch = function () {
        osg.Node.call( this );
    };

    Switch.prototype = objectInherit(osg.Node.prototype);

    Switch.prototype._values = [];

    Switch.prototype.newChildDefaultValue=true;

    Switch.prototype.traverse = function (visitor) {
        var children = this.children;
        for ( var i = 0, l = children.length; i < l; i++ ) {
            var child = children[ i ];
            if(this._values[i])
                child.accept(visitor);
        }
    };

    Switch.prototype.setNewChildDefaultValue = function(value) {
        this.newChildDefaultValue = value;
    };

    Switch.prototype.addChild = function(child, childValue) {
        var childPosition = this.children.length;
        osg.Node.prototype.addChild.call(this, child);
        this._values[childPosition] = childValue;
    };

    /*Switch.prototype.addChild = function(child) {
        this.addChild(child, this.newChildDefaultValue);
    };*/

    Switch.prototype.getChildIndex = function(child) {
        for ( var i = 0, l = this.children.length; i < l; i++ ) {
            if ( this.children[ i ] === child ) {
                return i;
            }
        }
        return -1;
    };

    Switch.prototype.setChildValue = function(child, value) {
        var pos = this.getChildIndex(child);
        this._values[pos] = value;
        //this.dirtyBound();
    };

    this.Switch = Switch;
}







