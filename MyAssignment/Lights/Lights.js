function init() {
    disableDefaultLight();
}


function createScene() {

    var root = new osg.Node();

    var sphere = osg.createTexturedSphere( 5.0, 40, 40 );
    var material = new osg.Material();
    material.setAmbient([0.2, 0.2, 0.2, 1.0]);
    material.setDiffuse([1.0, 0.0, 0.0, 1.0]);
    material.setSpecular([1.0, 1.0, 1.0, 1.0]);
    material.setEmission([0.0, 0.0, 0.0, 1.0]);
    material.setShininess(128);
    sphere.getOrCreateStateSet().setAttributeAndMode(material);
    root.addChild(sphere);

    root.addChild(createDirectionalLight(1, -1, 1));
    root.addChild(createAmbientLight(0.8, 0.8, 0.8));
    // root.addChild(createLightTransform(-5, -5, -5, createPointLight(1.0, 0.0, 0.0)));
    return root;
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
    //lightSource.setLight(ambientLight);
    return lightSource;
}

function createLightTransform(x, y, z, light) {
    var lightMatrix = new osg.Matrix.create();
    lightMatrix = osg.Matrix.makeTranslate(x, y, z, lightMatrix);
    var lightMatrixTransform = new osg.MatrixTransform();
    lightMatrixTransform.setMatrix(lightMatrix);

    lightMatrixTransform.addChild(light);
    return lightMatrixTransform;
}

function createPointLight(r, g, b, c, l, q) {

    var lightNumber = getNextLightNumber();
    var pointLight = new osg.Light(lightNumber);
    pointLight.setPosition([0, 0, 0, 1]);

    if(typeof r === 'undefined') r = 0.8;
    if(typeof g === 'undefined') g = 0.8;
    if(typeof b === 'undefined') b = 0.8;
    pointLight.setDiffuse([r, g, b, 1.0]);
    pointLight.setSpecular([r, g, b, 1.0]);
    pointLight.setAmbient([0.0, 0.0, 0.0, 1.0]);

    if(typeof c === 'undefined') c = 1.0;
    if(typeof l === 'undefined') l = 0.0;
    if(typeof q === 'undefined') q = 0.0;
    pointLight.setConstantAttenuation(c);
    pointLight.setLinearAttenuation(l);
    pointLight.setQuadraticAttenuation(q);

    var lightSource = new osg.LightSource();
    lightSource.setLight(pointLight);

    return lightSource;
}

function createDirectionalLight(x, y, z, r, g, b) {

    var lightNumber = getNextLightNumber();
    var directionalLight = new osg.Light(lightNumber);

    if(typeof x === 'undefined') x = 1.0;
    if(typeof y === 'undefined') y = -1.0;
    if(typeof z === 'undefined') z = 1.0;
    directionalLight.setPosition([x, y, z, 0.0]);

    if(typeof r === 'undefined') r = 0.8;
    if(typeof g === 'undefined') g = 0.8;
    if(typeof b === 'undefined') b = 0.8;
    directionalLight.setDiffuse([r, g, b, 1.0]);
    directionalLight.setSpecular([r, g, b, 1.0]);
    directionalLight.setAmbient([0.0, 0.0, 0.0, 1.0]);

    var lightSource = new osg.LightSource();
    lightSource.setLight(directionalLight);
    return lightSource;
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
