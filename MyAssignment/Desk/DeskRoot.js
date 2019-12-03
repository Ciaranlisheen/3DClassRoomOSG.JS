
function createDesk() {

    var desknode = new osg.Node();
    var chairnode = new osg.Node();

    var tabletop = osg.createTexturedBoxGeometry(0, 0, 0, 6, 5, 0.3);
    var material = new osg.Material();
    material.setDiffuse([1, 0.9, 0.5, 1.0]);
    tabletop.getOrCreateStateSet().setAttributeAndModes(material);
    tabletop.getOrCreateStateSet().setTextureAttributeAndMode(0, osg.Texture.createFromURL("Desk/wood.jpg"));

    var chairseat = osg.createTexturedBoxGeometry(0, -7.75, -3.25, 5, 4, 0.3);
    chairseat.getOrCreateStateSet().setAttributeAndModes(material);
    chairseat.getOrCreateStateSet().setTextureAttributeAndMode(0, osg.Texture.createFromURL("Desk/wood.jpg"));
    var chairback = osg.createTexturedBoxGeometry(0, -9.75, 0, 5, 0.3, 4);
    chairback.getOrCreateStateSet().setAttributeAndModes(material);
    chairback.getOrCreateStateSet().setTextureAttributeAndMode(0, osg.Texture.createFromURL("Desk/wood.jpg"));

    var leg = osg.createTexturedBoxGeometry(0, 0, 0, 0.5, 0.5, 7);
    var legmaterial = new osg.Material();
    legmaterial.setAmbient([0.2, 0, 0, 1.0]);
    legmaterial.setDiffuse([0.7, 0.1, 0.1, 1.0]);
    legmaterial.setSpecular([1.0, 1.0, 1.0, 1.0]);
    legmaterial.setEmission([0.0, 0.0, 0.0, 1.0]);
    legmaterial.setShininess(128);
    leg.getOrCreateStateSet().setAttributeAndModes(legmaterial);

    var chairlegfrnt = osg.createTexturedBoxGeometry(-2, -6, -5, 0.5, 0.5, 3.5);
    chairlegfrnt.getOrCreateStateSet().setAttributeAndModes(legmaterial); //chair leg created and placed at front left

    var chairlegbck = osg.createTexturedBoxGeometry(-2, -10, -3, 0.5, 0.5, 9.5);
    chairlegbck.getOrCreateStateSet().setAttributeAndModes(legmaterial);  //chair leg created and placed at front right

    chairnode.addChild(chairlegfrnt);
    chairnode.addChild(chairlegbck);
    chairnode.addChild(chairseat);
    chairnode.addChild(chairback);

    var chairMTRX = new osg.Matrix.create();    //translate leftside legs to rightside
    chairMTRX = osg.Matrix.makeTranslate(4, 0, 0, chairMTRX);
    var chairTrn = new osg.MatrixTransform();
    chairTrn.setMatrix(chairMTRX);
    chairnode.addChild(chairTrn);
    chairTrn.addChild(chairlegbck);
    chairTrn.addChild(chairlegfrnt);

    var frontleftMTRX = new osg.Matrix.create();//translation for each table leg
    frontleftMTRX = osg.Matrix.makeTranslate(-2.6, -2, -3.5, frontleftMTRX);
    var frontleftTrn = new osg.MatrixTransform();
    frontleftTrn.setMatrix(frontleftMTRX);
    desknode.addChild(frontleftTrn);
    frontleftTrn.addChild(leg);

    var frontrightMTRX = new osg.Matrix.create();
    frontrightMTRX = osg.Matrix.makeTranslate(2.6, -2, -3.5, frontrightMTRX);
    var frontrightTrn = new osg.MatrixTransform();
    frontrightTrn.setMatrix(frontrightMTRX);
    desknode.addChild(frontrightTrn);
    frontrightTrn.addChild(leg);

    var backleftMTRX = new osg.Matrix.create();
    backleftMTRX = osg.Matrix.makeTranslate(-2.6, 2, -3.5, backleftMTRX);
    var backleftTrn = new osg.MatrixTransform();
    backleftTrn.setMatrix(backleftMTRX);
    desknode.addChild(backleftTrn);
    backleftTrn.addChild(leg);

    var backrightMTRX = new osg.Matrix.create();
    backrightMTRX = osg.Matrix.makeTranslate(2.6, 2, -3.5, backrightMTRX);
    var backrightTrn = new osg.MatrixTransform();
    backrightTrn.setMatrix(backrightMTRX);
    desknode.addChild(backrightTrn);
    backrightTrn.addChild(leg);

    desknode.addChild(tabletop);
    desknode.addChild(chairnode);
    return desknode;
}