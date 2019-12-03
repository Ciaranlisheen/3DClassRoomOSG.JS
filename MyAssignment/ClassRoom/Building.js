function createBuildingScene() {

    var buildingroot = new osg.Node();

    { //whiteboard
        var Board = osg.createTexturedBoxGeometry(4, -0.5, 0, 38, 0.5, 20);
        var Boardmat = new osg.Material();
        Board.getOrCreateStateSet().setTextureAttributeAndMode(0, osg.Texture.createFromURL("ClassRoom/board.jpg"));
        Boardmat.setAmbient([0.9, 0.9, 0.9, 1.0]);
        Boardmat.setDiffuse([0.9, 0.9, 0.9, 1.0]);
        Boardmat.setSpecular([1.0, 1.0, 1.0, 1.0]);
        Boardmat.setEmission([0.0, 0.0, 0.0, 1.0]);
        Boardmat.setShininess(255);
        Board.getOrCreateStateSet().setAttributeAndModes(Boardmat);
    }

    var l = 80;
    var w = 120;
    var h = 30;

    {       //windowed wall
        var vertexAttribArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null , 3);
        vertexAttribArray.setElements(new Float32Array(//creates the points of the object
            [  -l/2, -0, -h/2,
                -l/2, 0, h/2,
                -l/2, 0, 0,
                -l/2, -w/4, h/4,
                -l/2, -w/4, -h/4,
                -l/2, -(w/4)*2, h/2,
                -l/2, -(w/4)*2, -h/2,
                -l/2, -(w/4)*3, h/4,
                -l/2, -(w/4)*3, -h/4,
                -l/2, -w, h/2,
                -l/2, -w, 0,
                -l/2, -w, -h/2]));

        var indices = new osg.BufferArray(osg.BufferArray.ELEMENT_ARRAY_BUFFER, null, 1 );
        indices.setElements(new Uint16Array(
            [ 0, 2, 4,//indices for each triangle
                4, 2, 3,
                3, 2, 1,
                1, 5, 3,
                5, 7, 3,
                5, 9, 7,
                10, 7, 9,
                10, 8, 7,
                11, 8, 10,
                11, 6, 8,
                8, 6, 4,
                4, 6, 0]));


       var normalArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null, 3);
       normalArray.setElements(new Float32Array(
           [1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0]
       ));


       var textureArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null, 2);
       textureArray.setElements(new Float32Array(
           [
               1, 0,//outer points set as normal
               1, 1,
               1, 0.5,
               0.50, 0.70,//points around window centred to meet brown in texture.
               0.50, 0.33,
               0.48, 1,
               0.48, 0,
               0.45, 0.70,
               0.45, 0.33,
               0, 1,//outer points set as normal
               0, 0.5,
               0, 0
           ]
       ));

        var windowwall = new osg.Geometry();
        windowwall.setVertexAttribArray('Vertex', vertexAttribArray);
        windowwall.setVertexAttribArray('Normal', normalArray);
        windowwall.setVertexAttribArray('TexCoord0', textureArray);
        windowwall.getOrCreateStateSet().setTextureAttributeAndMode(0, osg.Texture.createFromURL("ClassRoom/windowwall.jpg"));
        windowwall.getPrimitives().push(new osg.DrawElements(osg.PrimitiveSet.TRIANGLES, indices));
    }

    var wallLong = osg.createTexturedBoxGeometry(0, 0, 0, l, .5, h);
    var wallShort = osg.createTexturedBoxGeometry(0, 0, 0, w, .5, h);
    var floor = osg.createTexturedBoxGeometry(0, 0, 0, l, w, .5);
    var roof = osg.createTexturedBoxGeometry(0, -w/2, h/2, l, w, .5);
    var skybox = osg.createTexturedBoxGeometry(-w*3, 0, 0, 0.5, w*10, l*10);
    var skybox2 = osg.createTexturedBoxGeometry(0, w*3, 0, w*10, 0.5, l*10);

    var floormat = new osg.Material();
    floormat.setDiffuse([1, 0.9, 0.5, 1.0]);
    floor.getOrCreateStateSet().setAttributeAndModes(floormat);
    floor.getOrCreateStateSet().setTextureAttributeAndMode(0, osg.Texture.createFromURL("ClassRoom/floor.jpg"));

    var skyboxmat = new osg.Material();
    skyboxmat.setAmbient([0.5, 0.5, 0.5, 1]);
    skyboxmat.setDiffuse([0, 0, 0, 1]);
    skybox.getOrCreateStateSet().setAttributeAndModes(skyboxmat);
    skybox.getOrCreateStateSet().setTextureAttributeAndMode(0, osg.Texture.createFromURL("ClassRoom/stars.jpg"));
    skybox2.getOrCreateStateSet().setAttributeAndModes(skyboxmat);
    skybox2.getOrCreateStateSet().setTextureAttributeAndMode(0, osg.Texture.createFromURL("ClassRoom/stars.jpg"));

    var wallmaterial = new osg.Material();
    wallmaterial.setAmbient([0.3, 0.3, 0.6, 1.0]);
    wallmaterial.setDiffuse([0.4, 0.4, 0.8, 1.0]);
    wallmaterial.setSpecular([1.0, 1.0, 1.0, 1.0]);
    wallmaterial.setEmission([0.0, 0.0, 0.0, 1.0]);
    wallmaterial.setShininess(128);
    wallLong.getOrCreateStateSet().setTextureAttributeAndMode(0, osg.Texture.createFromURL("ClassRoom/wall.jpg"));
    wallShort.getOrCreateStateSet().setTextureAttributeAndMode(0, osg.Texture.createFromURL("ClassRoom/posterwall.jpg"));
    wallLong.getOrCreateStateSet().setAttributeAndModes(wallmaterial);
    wallShort.getOrCreateStateSet().setAttributeAndModes(wallmaterial);
    windowwall.getOrCreateStateSet().setAttributeAndModes(wallmaterial);

    wallRotateMatrix = new osg.Matrix.create();
    osg.Matrix.makeRotate(1.58, 0.0, 0.0, 1.0, wallRotateMatrix);
    WallRotateTransform = new osg.MatrixTransform();
    WallRotateTransform.setMatrix(wallRotateMatrix);
    WallRotateTransform.addChild(wallShort);

    wallTranslateMatrix = new osg.Matrix.create();
    osg.Matrix.makeTranslate(l/2, -w/2, 0, wallTranslateMatrix)
    WallTranslateTransform = new osg.MatrixTransform();
    WallTranslateTransform.setMatrix(wallTranslateMatrix);
    WallTranslateTransform.addChild(WallRotateTransform);

    floorTranslateMatrix = new osg.Matrix.create();
    osg.Matrix.makeTranslate(0, -w/2, -h/2, floorTranslateMatrix)
    FloorTranslateTransform = new osg.MatrixTransform();
    FloorTranslateTransform.setMatrix(floorTranslateMatrix);
    FloorTranslateTransform.addChild(floor);

    buildingroot.addChild(wallLong);
    buildingroot.addChild(WallTranslateTransform);
    buildingroot.addChild(FloorTranslateTransform);
    buildingroot.addChild(windowwall);
    buildingroot.addChild(roof);
    buildingroot.addChild(skybox);
    buildingroot.addChild(skybox2);
    buildingroot.addChild(Board);
    return buildingroot;

}

