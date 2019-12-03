var radius = 0.2;
var shaderadius = 2.5;
var height = 6;
var faces = 300;

function init() {
    //disableDefaultLight();
}

function createLampScene() {


    var polenode = new osg.Node();
    var shadenode = new osg.Node();



    var material = new osg.Material();
    material.setAmbient([0.2, 0.2, 0.2, 1.0]);
    material.setDiffuse([0.3, 0.3, 0.3, 1.0]);
    material.setSpecular([1.0, 1.0, 1.0, 1.0]);
    material.setEmission([0.0, 0.0, 0.0, 1.0]);
    material.setShininess(128);

    bulbmaterial = new osg.Material();
    bulbmaterial.setAmbient([0.7, 0.7, 0.7, 1.0]);
    bulbmaterial.setDiffuse([0.9, 0.9, 0.9, 1.0]);
    //bulbmaterial.setEmission([0.9, 0.9, 0.9, 1.0]);


    var top = createCylinderTop();
    top.getOrCreateStateSet().setAttributeAndMode(material);
    var body = createCylinderBody();
    body.getOrCreateStateSet().setAttributeAndMode(material);



    var shadeMTRX = new osg.Matrix.create();
    shadeMTRX = osg.Matrix.makeTranslate(0, 0, -height/2, shadeMTRX);//move shade to bottom
    var shadeTrn = new osg.MatrixTransform();
    shadeTrn.setMatrix(shadeMTRX);
    shadenode.addChild(shadeTrn);//add transform to shade node
    var shade = createShade();//create shade
    shade.getOrCreateStateSet().setAttributeAndMode(material);
    shadeTrn.addChild(shade);//add shade to move
    var shadebottom = createShadeBottom();
    shadebottom.getOrCreateStateSet().setAttributeAndMode(bulbmaterial);
    shadenode.addChild(shadebottom);
    var light = createSpotLight(0, 0, -20, .8, .8, .8, 1, 0, 0, 45, 1);
    shadenode.addChild(light);//add light to shade


    var poleMTRX = new osg.Matrix.create();
    poleMTRX = osg.Matrix.makeTranslate(0, 0, -height/2, poleMTRX);
    var poleTrn = new osg.MatrixTransform();
    poleTrn.setMatrix(poleMTRX);
    polenode.addChild(poleTrn);

    poleTrn.addChild(top);
    poleTrn.addChild(body);
    poleTrn.addChild(shadenode);

    var matrixTransform = new osg.MatrixTransform();
    matrixTransform.addChild(polenode);//rotation matrix
    var updateCallback = new SimpleUpdateCallback();
    matrixTransform.addUpdateCallback(updateCallback);

    var root = new osg.Node();
    root.addChild(matrixTransform);//add rotation matrix to root
    return root;
}

var SimpleUpdateCallback = function() {};
var dir = 1;

SimpleUpdateCallback.prototype = {
    // rotation angle
    angle: 0,

    update: function(node, nodeVisitor) {
    var currentTime = nodeVisitor.getFrameStamp().getSimulationTime();
    var dt = currentTime - node._lastUpdate;
    if (dt < 0) return true;
    node._lastUpdate = currentTime;

    // rotation
    var matrix = node.getMatrix();
    osg.Matrix.makeRotate(this.angle, 1.0, -0.3, 0.0, matrix);//rotate by angle both x and y
    if(this.angle<0.8 && dir==1){//up to angle 0.8
        this.angle += 0.01;
    }
    else{//
        this.angle -= 0.01;
        dir = 0;//change direction
    }
    if(this.angle<-0.8) dir =1;//back to -0.8 than chang
    return true;
}
};

function createShade() {

    var angle = 0.0;
    var angleIncrement = (2 * Math.PI) / faces;
    var shadecoordinates = new Array(faces*3+2);
    //array has 1points(3coords) for each face +2 for first face.

    shadecoordinates[0] = (shaderadius);//create first point ar bottom outer shade
    shadecoordinates[1] = (0);
    shadecoordinates[2] = (-2);
    for(var f=0; f<(faces/2)+1; f++) {
        // Generate a coordinate for each face
        //coord at bottom and coord at top of shade per loop
        shadecoordinates[f*6+3] = (radius*Math.cos(angle-angleIncrement));
        shadecoordinates[f*6+4] = (radius*Math.sin(angle-angleIncrement));
        shadecoordinates[f*6+5] = (0);//creates each high point at top inner shade
        angle = angle-angleIncrement;//steps around shade by increment

        shadecoordinates[f*6+6] = (shaderadius*Math.cos((angle-angleIncrement)));
        shadecoordinates[f*6+7] = (shaderadius*Math.sin((angle-angleIncrement)));
        shadecoordinates[f*6+8] = (-2);//creates each subsequent low outer point
        angle = angle-angleIncrement;//steps around shade by increment
    }
    var shadenormals = new Array(faces*3+2);
    shadenormals[0] = Math.cos(angle);//does the same for normals
    shadenormals[1] = Math.sin(angle);
    shadenormals[2] = 0.65;

    for(var f=0; f<(faces/2)+1; f++)
    {
        // Generate normal for each coord
        var n1x = Math.cos(angle);
        var n1y = Math.sin(angle);
        angle -= angleIncrement;
        var n2x = Math.cos(angle);
        var n2y = Math.sin(angle);
        angle -= angleIncrement;
        // Populate the coordinates array
        shadenormals[f*6+3] = n1x;
        shadenormals[f*6+4] = n1y;
        shadenormals[f*6+5] = 0.65;
        shadenormals[f*6+6] = n2x;
        shadenormals[f*6+7] = n2y;
        shadenormals[f*6+8] = 0.65;
    }
    var normalAttribArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null, 3);
    normalAttribArray.setElements(new Float32Array(shadenormals));//sets normals array to attrib
    var vertexAttribArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null , 3);
    vertexAttribArray.setElements(new Float32Array(shadecoordinates));//sets vert array to attrib
    var geometry = new osg.Geometry();
    geometry.setVertexAttribArray('Vertex', vertexAttribArray);//sets vertexes
    geometry.setVertexAttribArray('Normal', normalAttribArray);//sets normals
    geometry.getPrimitives().push(new osg.DrawArrays(osg.PrimitiveSet.TRIANGLE_STRIP, 0, faces+2));
    return geometry;//draws them as trianglestrip and returns object.
}



function createShadeBottom () {
    var angle = 0.0;
    var angleIncrement = (2*Math.PI)/faces;
    var coordinates = new Array(faces*3*3);

    for(var f=0; f<faces; f++) {
        // Generate the four coordinates required for each face
        var x1 = shaderadius * Math.cos(angle);
        var y1 = shaderadius * Math.sin(angle);
        angle += angleIncrement;
        var x2 = shaderadius * Math.cos(angle);
        var y2 = shaderadius * Math.sin(angle);
        coordinates[f*3*3] = 0;
        coordinates[f*3*3+1] = 0;
        coordinates[f*3*3+2] = -height/2.0-2;
        coordinates[f*3*3+3] = x2;
        coordinates[f*3*3+4] = y2;
        coordinates[f*3*3+5] = -height/2.0-2;
        coordinates[f*3*3+6] = x1;
        coordinates[f*3*3+7] = y1;
        coordinates[f*3*3+8] = -height/2.0-2;
    }
    var normals = new Array(faces*3*3);
    for(var f=0; f<faces; f++) {
        // Generate the four coordinates required for each face
        var x1 = Math.cos(angle);
        var y1 =  Math.sin(angle);
        angle += angleIncrement;
        var x2 =  Math.cos(angle);
        var y2 = Math.sin(angle);

        normals[f*3*3] = 0;
        normals[f*3*3+1] = 0;
        normals[f*3*3+2] = -1;
        normals[f*3*3+3] = 0;
        normals[f*3*3+4] = 0;
        normals[f*3*3+5] = -1;
        normals[f*3*3+6] = 0;
        normals[f*3*3+7] = 0;
        normals[f*3*3+8] = -1;
    }
    var vertexAttribArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null , 3);
    vertexAttribArray.setElements(new Float32Array(coordinates));
    var normalAttribArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null, 3);
    normalAttribArray.setElements(new Float32Array(normals ));
    var geometry = new osg.Geometry();
    geometry.setVertexAttribArray('Vertex', vertexAttribArray);
    geometry.setVertexAttribArray('Normal', normalAttribArray);
    geometry.getPrimitives().push(new osg.DrawArrays(osg.PrimitiveSet.TRIANGLES, 0, 3*faces));
    return geometry;
}




function createCylinderTop () {
    var angle = 0.0;
    var angleIncrement = (2*Math.PI)/faces;
    var coordinates = new Array(faces*3*3);
    for(var f=0; f<faces; f++) {
        // Generate the four coordinates required for each face
        var x1 = radius * Math.cos(angle);
        var y1 = radius * Math.sin(angle);
        angle += angleIncrement;
        var x2 = radius * Math.cos(angle);
        var y2 = radius * Math.sin(angle);
        coordinates[f*3*3] = 0;
        coordinates[f*3*3+1] = 0;
        coordinates[f*3*3+2] = height/2.0;
        coordinates[f*3*3+3] = x1;
        coordinates[f*3*3+4] = y1;
        coordinates[f*3*3+5] = height/2.0;
        coordinates[f*3*3+6] = x2;
        coordinates[f*3*3+7] = y2;
        coordinates[f*3*3+8] = height/2.0;
    }

    var normals = new Array(faces*3*3);
    for(var f=0; f<faces; f++) {
        // Generate the four coordinates required for each face
        var x1 = Math.cos(angle);
        var y1 =  Math.sin(angle);
        angle += angleIncrement;
        var x2 =  Math.cos(angle);
        var y2 = Math.sin(angle);
        normals[f*3*3] = 0;
        normals[f*3*3+1] = 0;
        normals[f*3*3+2] = 1;
        normals[f*3*3+3] = 0;
        normals[f*3*3+4] = 0;
        normals[f*3*3+5] = 1;
        normals[f*3*3+6] = 0;
        normals[f*3*3+7] = 0;
        normals[f*3*3+8] = 1;
    }
    var vertexAttribArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null , 3);
    vertexAttribArray.setElements(new Float32Array(coordinates));
    var normalAttribArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null, 3);
    normalAttribArray.setElements(new Float32Array(normals ));
    var geometry = new osg.Geometry();
    geometry.setVertexAttribArray('Vertex', vertexAttribArray);
    geometry.setVertexAttribArray('Normal', normalAttribArray);
    geometry.getPrimitives().push(new osg.DrawArrays(osg.PrimitiveSet.TRIANGLES, 0, 3*faces));
    return geometry;
}


function createCylinderBody() {
    // Define the attributes for the cylinder
    var angle = 0.0;
    var angleIncrement = (2*Math.PI)/faces;
    // create an empty array of floats to hold the coordinates
    var coordinates = new Array(faces*2*3*3);
    for(var f=0; f<faces; f++)
    {
        // Generate the four coordinates required for each face
        var x1 = radius*Math.cos(angle);
        var y1 = radius*Math.sin(angle);
        angle += angleIncrement;
        var x2 = radius*Math.cos(angle);
        var y2 = radius*Math.sin(angle);

        // Populate the coordinates array
        coordinates[f*2*3*3] = x1;
        coordinates[f*2*3*3+1] = y1;
        coordinates[f*2*3*3+2] = -height/2.0;

        coordinates[f*2*3*3+3] = x2;
        coordinates[f*2*3*3+4] = y2;
        coordinates[f*2*3*3+5] = height/2.0;

        coordinates[f*2*3*3+6] = x1;
        coordinates[f*2*3*3+7] = y1;
        coordinates[f*2*3*3+8] = height/2.0;

        coordinates[f*2*3*3+9] = x1;
        coordinates[f*2*3*3+10] = y1;
        coordinates[f*2*3*3+11] = -height/2.0;

        coordinates[f*2*3*3+12] = x2;
        coordinates[f*2*3*3+13] = y2;
        coordinates[f*2*3*3+14] = -height/2.0;

        coordinates[f*2*3*3+15] = x2;
        coordinates[f*2*3*3+16] = y2;
        coordinates[f*2*3*3+17] = height/2.0;
    }
    var normals = new Array(faces*2*3*3);
    for(var f=0; f<faces; f++)
    {
        // Generate the four coordinates required for each face
        var n1x = Math.cos(angle);
        var n1y = Math.sin(angle);
        angle += angleIncrement;
        var n2x = Math.cos(angle);
        var n2y = Math.sin(angle);

        // Populate the coordinates array
        normals[f*2*3*3] = n1x;
        normals[f*2*3*3+1] = n1y;
        normals[f*2*3*3+2] = 0;

        normals[f*2*3*3+3] = n2x;
        normals[f*2*3*3+4] = n2y;
        normals[f*2*3*3+5] = 0;

        normals[f*2*3*3+6] = n1x;
        normals[f*2*3*3+7] = n1y;
        normals[f*2*3*3+8] = 0;

        normals[f*2*3*3+9] = n1x;
        normals[f*2*3*3+10] = n1y;
        normals[f*2*3*3+11] = 0;

        normals[f*2*3*3+12] = n2x;
        normals[f*2*3*3+13] = n2y;
        normals[f*2*3*3+14] = 0;

        normals[f*2*3*3+15] = n2x;
        normals[f*2*3*3+16] = n2y;
        normals[f*2*3*3+17] = 0;
    }
    var vertexAttribArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null , 3);
    vertexAttribArray.setElements(new Float32Array(coordinates));
    var normalAttribArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null, 3);
    normalAttribArray.setElements(new Float32Array(normals ));

    var geometry = new osg.Geometry();
    geometry.setVertexAttribArray('Vertex', vertexAttribArray);
    geometry.setVertexAttribArray('Normal', normalAttribArray);
    geometry.getPrimitives().push(new osg.DrawArrays(osg.PrimitiveSet.TRIANGLES, 0, 6*faces));
    return geometry;
}


var nextLightNumber = 0;
function getNextLightNumber() {
    return nextLightNumber++;
}

function createSpotLight(x, y, z, r, g, b, c, l, q, cutoff, blend) {
    var lightNumber = getNextLightNumber();
    var spotLight = new osg.Light(lightNumber);
    spotLight.setPosition([0, 0, 0, 1]);

    if(typeof x === 'undefined') x = 0.0;
    if(typeof y === 'undefined') y = 1.0;
    if(typeof z === 'undefined') z = 0.0;
    spotLight.setDirection([x, y, z]);

    if(typeof r === 'undefined') r = 0.8;
    if(typeof g === 'undefined') g = 0.8;
    if(typeof b === 'undefined') b = 0.8;
    spotLight.setDiffuse([r, g, b, 1.0]);
    spotLight.setSpecular([r, g, b, 1.0]);
    spotLight.setAmbient([0.0, 0.0, 0.0, 1.0]);

    if(typeof c === 'undefined') c = 1.0;
    if(typeof l === 'undefined') l = 0.0;
    if(typeof q === 'undefined') q = 0.0;
    spotLight.setConstantAttenuation(c);
    spotLight.setLinearAttenuation(l);
    spotLight.setQuadraticAttenuation(q);

    if(typeof cutoff === 'undefined') cutoff = 25.0;
    spotLight.setSpotCutoff(cutoff);

    if(typeof blend === 'undefined') blend = 1.0;
    spotLight.setSpotBlend(blend);

    var lightSource = new osg.LightSource();
    lightSource.setLight(spotLight);
    return lightSource;
}
