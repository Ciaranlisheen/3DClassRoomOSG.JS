var KEY_CODE_LEFT_ARROW = 37;
var KEY_CODE_RIGHT_ARROW = 39;

var leftRightAngle = 0;
var leftRightMatrix;
var leftRightTransform;


function init() {
    disableDefaultLight();
    enablePicking();
    var canvas = document.getElementById("canvas");
    canvas.addEventListener("keydown", keyPressed);
    canvas.focus();
}

function createScene() {

    var root = new osg.Node();
    var Deskrow = new osg.Node();
    var i;
    var j;
    var lightlevel = 0;

    for(i=0; i<3; i++){ //creates a row of desks four times
            var MTRX = new osg.Matrix.create();
            MTRX = osg.Matrix.makeTranslate(0, -(i*15)-20, -8, MTRX);//i dictates spacing
            var Trn = new osg.MatrixTransform();
            Trn.setMatrix(MTRX);
            Trn.addChild(createDesk());
            Deskrow.addChild(Trn);//adds desk to DeskRow node
    }
    for(j=0; j<4; j++){//adds each row of four desks to column
        var MTRXcol = new osg.Matrix.create();
        MTRXcol = osg.Matrix.makeTranslate(j*15-20, 0, 0, MTRXcol);//j dictates spacing
        var Trncol = new osg.MatrixTransform();
        Trncol.setMatrix(MTRXcol);
        Trncol.addChild(Deskrow);//adds each row
        root.addChild(Trncol);//adds to root
    }

    var MTRXlamp = new osg.Matrix.create();
    MTRXlamp = osg.Matrix.makeTranslate(13, -30, 15, MTRXlamp);
    var Trnlamp = new osg.MatrixTransform();
    Trnlamp.setMatrix(MTRXlamp);
    Trnlamp.addChild(createLampScene());
    root.addChild(Trnlamp);

    root.addChild(createBuildingScene());
    root.addChild(createAmbientLight(0.2, 0.2, 0.2)); //create dark ambient light

    var lights = new osg.LightSource();//create light source
    var LightOn = new osg.Light(getNextLightNumber());//create light object
    LightOn.setPosition([0, -30, 10, 1]);//set pos
    LightOn.setDiffuse([0, 0, 0, 1.0]);//no light to start
    LightOn.setSpecular([0, 0, 0, 1.0]);//no specular ever (dont want ball shaped shine)
    LightOn.setAmbient([0.0, 0.0, 0.0, 1.0]);
    LightOn.setConstantAttenuation(1);
    LightOn.setLinearAttenuation(0);
    LightOn.setQuadraticAttenuation(0)

    var lswitch = osg.createTexturedBoxGeometry(-30, -1, 0, 2, 0.3, 3);
    var switchmat = new osg.Material();
    switchmat.setAmbient([0.6, 0.6, 0.6, 1.0]);
    switchmat.setDiffuse([0.9, 0.9, 0.9, 1.0]);
    switchmat.setSpecular([1.0, 1.0, 1.0, 1.0]);
    switchmat.setShininess(128);
    lswitch.getOrCreateStateSet().setAttributeAndModes(switchmat);

    lswitch.onpick = function (){//on click of lightswitch
        if(0==lightlevel){//if light off
            lightlevel = 1;//set on
            LightOn.setDiffuse([0.8, 0.8, 0.8, 1.0]);}//set light level
        else{
           lightlevel = 0;//set off
            LightOn.setDiffuse([0.0, 0.0, 0.0, 1.0]);}//set level 0
    };

    leftRightMatrix = new osg.Matrix.create();
    osg.Matrix.makeRotate(leftRightAngle, 0.0, 0.0, 1.0, leftRightMatrix);
    leftRightTransform = new osg.MatrixTransform();
    leftRightTransform.setMatrix(leftRightMatrix);

    lights.setLight(LightOn);//set light source to light object
    root.addChild(lights);
    root.addChild(lswitch);

    var cammat = new osg.Matrix.create();
    cammat = osg.Matrix.makeTranslate(0, 50, 0, cammat);
    var camTrn = new osg.MatrixTransform();
    camTrn.setMatrix(cammat);
    leftRightTransform.addChild(camTrn);
    camTrn.addChild(root);
    return leftRightTransform;
}



var currentpos = 1;
function keyPressed(event) {
    var keyCode = event.keyCode;
    if(keyCode == KEY_CODE_LEFT_ARROW && currentpos>0) {//if not looking left
        //alert("left");
        leftRightAngle -= 1;//rotate left
        currentpos--;//update view
    }
    else if(keyCode == KEY_CODE_RIGHT_ARROW && currentpos<2) {//if not looking right
        //alert("right");
        leftRightAngle += 1;//rotate right
        currentpos++;//update view
    }
    osg.Matrix.makeRotate(leftRightAngle, 0.0, 0.0, 1.0, leftRightMatrix);//update matrix
    leftRightTransform.setMatrix(leftRightMatrix);//set matrix
}


var nextLightNumber = 0;
function getNextLightNumber() {
    return nextLightNumber++;
}

function createAmbientLight(r, g, b) {
    var lightNumber = getNextLightNumber();
    var ambientLight = new osg.Light(lightNumber);
    ambientLight.setPosition([0, 0, 0, 1]);
    if(typeof r === 'undefined') r = 0.8;
    if(typeof g === 'undefined') g = 0.8;
    if(typeof b === 'undefined') b = 0.8;
    ambientLight.setDiffuse([0.0, 0.0, 0.0, 1.0]);
    ambientLight.setSpecular([0.0, 0.0, 0.0, 1.0]);
    ambientLight.setAmbient([r, g, b, 1.0]);
    var lightSource = new osg.LightSource();
    lightSource.setLight(ambientLight);
    return lightSource;
}
