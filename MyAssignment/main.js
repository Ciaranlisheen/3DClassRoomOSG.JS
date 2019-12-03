window.addEventListener("load", main ,true);

var libraryList = [
    'res/js/core.js',
    'res/js/bluebird.js',
    'res/js/hammer.js',
    'res/js/gunzip.min.js',
    'res/js/jquery-3.1.1.min.js',
    'res/js/OSG.js',
    'myOSGLib.js'
];


function loadScript(url, callback)
{
    // adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url+"?time=234234";  // putting in the query string force library to be reloaded

    // then bind the event to the callback function
    // there are several events for cross browser compatibility
    script.onreadystatechange = callback;
    script.onload = callback;

    // fire the loading
    head.appendChild(script);
}

function main() {

    loadNextLibrary();
}

function loadNextLibrary() {
    if(libraryList.length > 0) {
        var library = libraryList.shift();
        loadScript(library, loadNextLibrary);
    }
    else {

        main2();
    }
}

var main2 = function() {

    var filename = qs['filename'];
    if(filename !== undefined) {

        loadScript(filename, function () {

            main3();
        });
    }
    else
        main3();



};

var _disableDefaultLight = false;
var disableDefaultLight = function() {
    _disableDefaultLight = true;
}

var _manipulator = undefined;
function setManipulator(newManipulator) {
    _manipulator = newManipulator;
}

var _disableDefaultManipulator = false;
function disableDefaultManipulator() {
    _disableDefaultManipulator = true;
}

function enablePicking() {
    document.getElementById('canvas').onclick = function onclick(event) {
        var x = event.clientX;
        var y = event.clientY;
        var height = document.getElementById('canvas').clientHeight;

        var viewer = getViewer();
        var hits = viewer.computeIntersections(x, height - y);

        var pickResults = new Array();
        for(var h=0; h<hits.length; h++) {
            var hit = hits[h];
            var nodeDepth = hit.nodepath.length;
            for(var level=nodeDepth-1; level>=0; level--) {
                var node = hit.nodepath[level];
                if(typeof node.onpick === "function" && pickResults.indexOf(node) == -1) {
                    pickResults.push(node);
                    break;
                }
            }
        }

        for(var r=0; r<pickResults.length; r++) {
            pickResults[r].onpick();
        }
    }
}

var viewer;

var getViewer = function() {
    return viewer;
}

var main3 = function() {

    OSG.globalify();
    ee497.globalify();

    if (typeof init === "function") {
        init();
    }

    var canvas = document.getElementById("canvas");
    viewer = new osgViewer.Viewer(canvas, {antialias : true, alpha: true });
    viewer.init();

    if(typeof _disableDefaultLight !== 'undefined' && _disableDefaultLight == true)
        viewer.setLightingMode ( osgViewer.View.LightingMode.NO_LIGHT) ;

    //var rotate = new osg.MatrixTransform();
    var root = createScene();

    /*var displayGraph = osgUtil.DisplayGraph.instance();
    displayGraph.setDisplayGraphRenderer( true );
    displayGraph.createGraph( root );*/

   //rotate.addChild( root );

    viewer.getCamera().setClearColor( [ 0.0, 0.0, 0.0, 0.0 ] );
    viewer.setSceneData(root);

    if(!_disableDefaultManipulator) {
        if(_manipulator != undefined)
            viewer.setupManipulator(_manipulator);
        else
            viewer.setupManipulator(new osgGA.OrbitManipulator());
    }
    //viewer.getManipulator().computeHomePosition();

    viewer.run();
    //clearLog();
    log("Loading complete");
}

function stopViewer() {
    window.cancelAnimationFrame(viewer._requestID);
    alert("done");
}

var qs = (function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split('&'));



function log(message) {
    //document.getElementById("console").value +=  message + "\n";
}

function clearLog() {
    //document.getElementById("console").value =  " ";
}

