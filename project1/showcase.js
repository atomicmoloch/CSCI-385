//
// Program 1: object showcase
//
// showcase.js
//
// CSCI 385: Computer Graphics, Reed College, Fall 2024.
//
// This is a sample `opengl.js` program that displays a tetrahedron 
// made up of triangular facets, and also a cube and a cylinder.
//
// The OpenGL drawing part of the code occurs in `drawScene` and that
// function relies on `drawObject` to do its work. There is a global
// variable `gShowWhich` that can be changed by the user (by pressing
// number keys handled by handleKey). The `drawObject` code calls
// `glBeginEnd` to draw the chosen object.
//
// Your assignment is to add these models to the showcase code:
//
// - Sphere: A faceted model of the surface of a sphere.
// - Platonic: One of the other three Platomnic solids.
// - Torus: A faceted model of the surface of a torus.
// - Revolution: Two other *surfaces of revolution*.
//
// For each of these, you'll write functions that describe the
// object in 3-space, modify `drawObject` to draw them, and modify
// the keyboard handler code in `handleKey` to allow the user to
// select and configure them.
//
// This is all described in the web document
//
//   http://jimfix.github.io/csci385/assignments/showcase.html
//

// ***** GLOBALS *****

// Globals for tracking mouse drags.
//
let gOrientation = quatClass.for_rotation(0.0, new Vector3d(1.0,0.0,0.0));
let gMouseStart  = {x: 0.0, y: 0.0};
let gMouseDrag   = false;

// Global for which object is being shown.
//
let gShowWhich = 1;

let smoothness = 24;

// ***** MAKERS *****
//
// Functions that describe objects in the showcase. These get called
// in `main` when the applications sets itself up.
//

//
// makeCube
//
// This describes the facets of a cube whose sides are unit length
// and is centered at the origin.
//
// The name of the object is "Cube".
//
function makeCube() {
    
    glBegin(GL_TRIANGLES,"Cube",true);
    // front
    glColor3f(0.5,0.5,0.0);
    glVertex3f(-0.5,-0.5, 0.5);
    glVertex3f( 0.5,-0.5, 0.5);
    glVertex3f( 0.5, 0.5, 0.5);
    
    glVertex3f( 0.5, 0.5, 0.5);
    glVertex3f(-0.5, 0.5, 0.5);
    glVertex3f(-0.5,-0.5, 0.5);
    
    // back
    glColor3f(0.5,0.5,1.0);
    glVertex3f(-0.5,-0.5,-0.5);
    glVertex3f( 0.5,-0.5,-0.5);
    glVertex3f( 0.5, 0.5,-0.5);
    
    glVertex3f( 0.5, 0.5,-0.5);
    glVertex3f(-0.5, 0.5,-0.5);
    glVertex3f(-0.5,-0.5,-0.5);

    // left
    glColor3f(1.0,0.5,0.5);
    glVertex3f(-0.5,-0.5,-0.5);
    glVertex3f(-0.5, 0.5,-0.5);
    glVertex3f(-0.5, 0.5, 0.5);
    
    glVertex3f(-0.5, 0.5, 0.5);
    glVertex3f(-0.5,-0.5, 0.5);
    glVertex3f(-0.5,-0.5,-0.5);
    
    // right
    glColor3f(0.0,0.5,0.5);
    glVertex3f( 0.5,-0.5,-0.5);
    glVertex3f( 0.5, 0.5,-0.5);
    glVertex3f( 0.5, 0.5, 0.5);
    
    glVertex3f( 0.5, 0.5, 0.5);
    glVertex3f( 0.5,-0.5, 0.5);
    glVertex3f( 0.5,-0.5,-0.5);
    
    // top
    glColor3f(0.5,1.0,0.5);
    glVertex3f(-0.5, 0.5,-0.5);
    glVertex3f( 0.5, 0.5,-0.5);
    glVertex3f( 0.5, 0.5, 0.5);
    
    glVertex3f( 0.5, 0.5, 0.5);
    glVertex3f(-0.5, 0.5, 0.5);
    glVertex3f(-0.5, 0.5,-0.5);

    // bottom
    glColor3f(0.5,0.0,0.5);
    glVertex3f(-0.5,-0.5,-0.5);
    glVertex3f( 0.5,-0.5,-0.5);
    glVertex3f( 0.5,-0.5, 0.5);
    
    glVertex3f( 0.5,-0.5, 0.5);
    glVertex3f(-0.5,-0.5, 0.5);
    glVertex3f(-0.5,-0.5,-0.5);

    //
    glEnd();
}

//
// makeCylinder
//
// Describes the facets of a cylindrical object. 
//
// The `smoothness` parameter gives the number of sides in the polygon
// of the cylinder's cross section. It should be even, because of the
// coloring.
//
// The object name for glBeginEnd is "Cylinder".
//
function makeCylinder() {
    
    const width = 1.0;
    const numFacets = smoothness;
    const dAngle = 2.0 * Math.PI / numFacets;

    glBegin(GL_TRIANGLES, "Cylinder", true);

    // Produce the top.
    for (let i = 0; i < numFacets; i += 1) {
        const aTop = dAngle * i;
        const xTop0 = Math.cos(aTop);
        const yTop0 = Math.sin(aTop);
        const xTop1 = Math.cos(aTop + dAngle);
        const yTop1 = Math.sin(aTop + dAngle);
        if (i % 2 == 0) {
            glColor3f(0.25, 0.50, 0.75);
        } else {
            glColor3f(0.50, 0.75, 0.80);
        }
        glVertex3f(  0.0,   0.0, width / 2.0);
        glVertex3f(xTop0, yTop0, width / 2.0);
        glVertex3f(xTop1, yTop1, width / 2.0);
    }
    
    // Produce the sides.
    for (let i = 0; i < numFacets; i += 1) {
        const aMid = dAngle * i;
        const xMid0 = Math.cos(aMid);
        const yMid0 = Math.sin(aMid);
        const xMid1 = Math.cos(aMid + dAngle);
        const yMid1 = Math.sin(aMid + dAngle);
        
        glColor3f(0.25, 0.50, 0.75);
        glVertex3f(xMid0, yMid0,  width / 2.0);
        glVertex3f(xMid0, yMid0, -width / 2.0);
        glVertex3f(xMid1, yMid1, -width / 2.0);

        glColor3f(0.50, 0.75, 0.80);
        glVertex3f(xMid0, yMid0,  width / 2.0);
        glVertex3f(xMid1, yMid1, -width / 2.0);
        glVertex3f(xMid1, yMid1,  width / 2.0);

    }
    
    // Produce the bottom.
    for (let i = 0; i < numFacets; i += 1) {
        const aBottom = dAngle * i;
        const xBottom0 = Math.cos(aBottom);
        const yBottom0 = Math.sin(aBottom);
        const xBottom1 = Math.cos(aBottom + dAngle);
        const yBottom1 = Math.sin(aBottom + dAngle);
        if (i % 2 == 0) {
            glColor3f(0.25, 0.50, 0.75);
        } else {
            glColor3f(0.50, 0.75, 0.80);
        }
        glVertex3f(     0.0,      0.0, -width / 2.0);
        glVertex3f(xBottom0, yBottom0, -width / 2.0);
        glVertex3f(xBottom1, yBottom1, -width / 2.0);
    }
    
    glEnd();
}




//
// makeTetrahedron
//
// Describes the facets of a tetrahedron whose vertices sit at 4 of
// the 8 corners of the of the cube volume [-1,1] x [-1,1] x [-1,1].
//
// The name of the object is "Tetrahedron".
//
function makeTetrahedron() {

    // Draw all the triangular facets.
    glBegin(GL_TRIANGLES,"Tetrahedron",true);

    // The three vertices are +-+ ++- -++ ---

    // all but ---
    glColor3f(1.0,1.0,0.0);
    glVertex3f( 1.0,-1.0, 1.0);
    glVertex3f( 1.0, 1.0,-1.0);
    glVertex3f(-1.0, 1.0, 1.0);
    // all but ++-
    glColor3f(0.0,1.0,1.0);
    glVertex3f( 1.0,-1.0, 1.0);
    glVertex3f(-1.0, 1.0, 1.0);
    glVertex3f(-1.0,-1.0,-1.0);
    // all but -++
    glColor3f(1.0,0.0,1.0);
    glVertex3f(-1.0,-1.0,-1.0);
    glVertex3f( 1.0, 1.0,-1.0);
    glVertex3f( 1.0,-1.0, 1.0);
    // all but +-+
    glColor3f(1.0,0.8,1.0);
    glVertex3f( 1.0, 1.0,-1.0);
    glVertex3f(-1.0,-1.0,-1.0);
    glVertex3f(-1.0, 1.0, 1.0);

    glEnd();
}


// I know this is the easiest platonic solid and I wish I had time to do a cooler one :(
function makeD8() {

    // Draw all the triangular facets.
    glBegin(GL_TRIANGLES,"D8",true);

    glColor3f(1.0,0.0,0.0);
    glVertex3f(0.0,0.0,1.0);
    glVertex3f(-1.0,0.0,0.0);
    glVertex3f(0.0,1.0,0.0);

    glColor3f(0.5,0.0,0.0);
    glVertex3f(0.0,0.0,-1.0);
    glVertex3f(-1.0,0.0,0.0);
    glVertex3f(0.0,1.0,0.0);

    glColor3f(0.0,1.0,0.0);
    glVertex3f(0.0,0.0,1.0);
    glVertex3f(1.0,0.0,0.0);
    glVertex3f(0.0,1.0,0.0);

    glColor3f(0.0,0.5,0.0);
    glVertex3f(0.0,0.0,-1.0);
    glVertex3f(1.0,0.0,0.0);
    glVertex3f(0.0,1.0,0.0);

    glColor3f(0.0,0.0,1.0);
    glVertex3f(0.0,0.0,1.0);
    glVertex3f(1.0,0.0,0.0);
    glVertex3f(0.0,-1.0,0.0);

    glColor3f(0.0,0.0,0.5);
    glVertex3f(0.0,0.0,-1.0);
    glVertex3f(1.0,0.0,0.0);
    glVertex3f(0.0,-1.0,0.0);

    glColor3f(1.0,1.0,0.0);
    glVertex3f(0.0,0.0,1.0);
    glVertex3f(-1.0,0.0,0.0);
    glVertex3f(0.0,-1.0,0.0);

    glColor3f(0.5,0.5,0.0);
    glVertex3f(0.0,0.0,-1.0);
    glVertex3f(-1.0,0.0,0.0);
    glVertex3f(0.0,-1.0,0.0);

    glEnd();
}


function makePoint(xcoord, ycoord) {
    return {x: Math.abs(xcoord), y: ycoord};

}

//Simple implementation of quad drawing
function drawBox(x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4) {
    //Chooses a random color for the resultant box
    glColor3f(Math.random(), Math.random(), Math.random())

    glVertex3f(x1, y1, z1);
    glVertex3f(x2, y2, z2);
    glVertex3f(x3, y3, z3);

    glVertex3f(x2, y2, z2);
    glVertex3f(x3, y3, z3);
    glVertex3f(x4, y4, z4);
}

//rotates point array around y axis to form a solid
//Connects points in the order of the points list
function makeRevolution(name, points) {
    const dAngle = 2.0 * Math.PI / smoothness;
    glBegin(GL_TRIANGLES, name, true);

    for (let i = 0; i < smoothness; i += 1) {
        const a = 2.0 * Math.PI * i / smoothness;
        for (let j = 0; j < points.length - 1; j += 1) {
            const curr_point = points[j];
            const next_point = points[j+1];

            const x1 = curr_point.x * Math.cos(a);
            const y1 = curr_point.y;
            const z1 = curr_point.x * Math.sin(a);

            const x2 = curr_point.x * Math.cos(a + dAngle);
            const y2 = curr_point.y;
            const z2 = curr_point.x * Math.sin(a + dAngle);

            const x3 = next_point.x * Math.cos(a);
            const y3 = next_point.y;
            const z3 = next_point.x * Math.sin(a);

            const x4 = next_point.x * Math.cos(a + dAngle);
            const y4 = next_point.y;
            const z4 = next_point.x * Math.sin(a + dAngle);

            drawBox(x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4);
        }
    }
    glEnd();
}

//Draws a circle and then uses makeRevolution to turn it into a sphere
function makeSphere() {
    let points = [makePoint(0, 1)];
    const dAngle = 2.0 * Math.PI / smoothness;
    for (let i = 0; i < smoothness; i += 1) {
        const aMid = dAngle * i + 90;
        points.push(makePoint(Math.cos(aMid), Math.sin(aMid)));
        if (i == Math.floor(smoothness / 2)) {
            points.push(makePoint(0, -1)); //caps hole on bottom
        }
    }
    makeRevolution("Sphere", points);
    //console.log(points);
}

//Basic function to make a spinning top shape using makeRevolution
function makeTop(){
    let points = [];
    points.push(makePoint(0, -1));
    points.push(makePoint(1, 0));
    points.push(makePoint(0.4, 0.5));
    points.push(makePoint(0.4, 1.3));
    points.push(makePoint(0.5, 1.3));
    points.push(makePoint(0.5, 1.5));
    points.push(makePoint(0.0, 1.5));
    makeRevolution("Top", points);
}


//Draws a circle offset from the origin and uses makeRevolution to turn it into a torus
function makeTorus() {
    let points = [];
    const dAngle = 2.0 * Math.PI / smoothness;
    for (let i = 0; i < smoothness; i += 1) {
        const aMid = dAngle * i;
        points.push(makePoint(0.5 * (Math.cos(aMid) - 2), 0.5 * (Math.sin(aMid) - 2)));
    }
    points.push(points[0]); //Connects first and last points to avoid a hole
    makeRevolution("Torus", points);
}

//Makes a randomized revolved shape using makeRevolution
function makeRandom() {
    let points = [];
    for (let i = 0; i < smoothness; i += 1) {
        points.push(makePoint(Math.random(), Math.random()));

    }
    makeRevolution("Random", points);

}

//Basic function to recreate the futurist Mussolini bust by Renato Bertelli that was linked in the project file
function makeMussolini() {
    // Coordiantes recorded from image, sorry that they're messy'
    let points = [];
    points.push(makePoint(0.0, -4 * (.043-.2)));
    points.push(makePoint(4 * (.391-.31), -4 * (.065-.2)));
    points.push(makePoint(4 * (.403-.31), -4 * (.079-.2)));
    points.push(makePoint(4 * (.447-.31), -4 * (.105-.2)));
    points.push(makePoint(4 * (.472-.31), -4 * (.138-.2)));
    points.push(makePoint(4 * (.499-.31), -4 * (.207-.2)));
    points.push(makePoint(4 * (.485-.31), -4 * (.230-.2)));
    points.push(makePoint(4 * (.527-.31), -4 * (.283-.2)));
    points.push(makePoint(4 * (.521-.31), -4 * (.301-.2)));
    points.push(makePoint(4 * (.497-.31), -4 * (.306-.2)));
    points.push(makePoint(4 * (.508-.31), -4 * (.325-.2)));
    points.push(makePoint(4 * (.505-.31), -4 * (.340-.2)));
    points.push(makePoint(4 * (.511-.31), -4 * (.347-.2)));
    points.push(makePoint(4 * (.513-.31), -4 * (.405-.2)));
    points.push(makePoint(4 * (.499-.31), -4 * (.422-.2)));
    points.push(makePoint(4 * (.463-.31), -4 * (.431-.2)));
    points.push(makePoint(4 * (.433-.31), -4 * (.435-.2)));
    points.push(makePoint(4 * (.431-.31), -4 * (.460-.2)));
    points.push(makePoint(4 * (.437-.31), -4 * (.469-.2)));
    points.push(makePoint(4 * (.453-.31), -4 * (.479-.2)));
    points.push(makePoint(4 * (.455-.31), -4 * (.542-.2)));
    points.push(makePoint(4 * (.423-.32), -4 * (.554-.2)));
    points.push(makePoint(0.0, -4 * (.560-.2)));

    makeRevolution("Mussolini", points);
}


// ***** RENDERING *****
//
// Functions for displaying the selected object of the showcase.
//

//
// drawObject
//
// Renders the 3-D object designated by the global `gShowWhich`.
//
function drawObject() {

    /*
     * Draw the object selected by the user.
     */
    
    if (gShowWhich == 1) {
        glBeginEnd("Tetrahedron");
    }
    if (gShowWhich == 2) {
        glBeginEnd("Cube");
    }
    if (gShowWhich == 3) {
        glBeginEnd("Cylinder");
    }
    if (gShowWhich == 4) {
        glBeginEnd("D8");
    }
    if (gShowWhich == 5) {
        glBeginEnd("Sphere");
    }
    if (gShowWhich == 6) {
        glBeginEnd("Top");
    }
    if (gShowWhich == 7) {
        glBeginEnd("Torus");
    }
    if (gShowWhich == 8) {
        glBeginEnd("Mussolini");
    }
    if (gShowWhich == 9) {
        glBeginEnd("Random");
    }
    //
    // Add other objects for the assignment here.
    //
    
}

function drawScene() {
    /*
     * Issue GL calls to draw the scene.
     */

    // Clear the rendering information.
    glClearColor(0.2,0.2,0.3);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glEnable(GL_DEPTH_TEST);

    // Clear the transformation stack.
    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();

    // Transform the object by a rotation.
    gOrientation.glRotatef();

    // Draw the object.
    glPushMatrix();
    glScalef(0.5,0.5,0.5);
    drawObject();
    glPopMatrix();
    
    // Render the scene.
    glFlush();

}

//Makes all objects. To be called whenever an update is necessary
function makeThings() {
    makeTetrahedron();
    makeCube();
    makeCylinder();
    makeD8();
    makeSphere();
    makeTop();
    makeTorus();
    makeMussolini();
    makeRandom();

}



// ***** INTERACTION *****
//
// Functions for supporting keypress and mouse input.

//
// handleKey
//
// Handles a keypress.
//

function handleKey(key, x, y) {

    if (key == '&') {
        smoothness = smoothness + 1;
        makeThings();

    }
    else if (key == '(') {
        if (smoothness > 2) {
        smoothness = smoothness - 1;
        makeThings();
        }
    }
    else if (parseInt(Number(key)) < 10) {
        gShowWhich = key;
    }
    
    glutPostRedisplay();
}

//
// worldCoords
//
// Converts mouse click location coordinates to the OpenGL world's
// scene coordinates. Takes the mouse coordinates as `mousex` and `mousey`.
//
function worldCoords(mousex, mousey) {

    const pj = mat4.create();
    glGetFloatv(GL_PROJECTION_MATRIX,pj);
    const pj_inv = mat4.create();
    mat4.invert(pj_inv,pj);
    const vp = [0,0,0,0];
    glGetIntegerv(GL_VIEWPORT,vp);
    const mousecoords = vec4.fromValues(2.0*mousex/vp[2]-1.0,
                                        1.0-2.0*mousey/vp[3],
                                        0.0, 1.0);
    vec4.transformMat4(location,mousecoords,pj_inv);
    return {x:location[0], y:location[1]};
}    

// handleMouseClick
//
// Records the location of a mouse click in the OpenGL world's
// scene coordinates. Also notes whether the click was the
// start of the mouse being dragged.
//
// Sets the globals `gMouseStart` and `gMouseDrag` accordingly.
//
function handleMouseClick(button, state, x, y) {
    
    // Start tracking the mouse for trackball motion.
    gMouseStart  = worldCoords(x,y);
    if (state == GLUT_DOWN) {
        gMouseDrag = true;
    } else {
        gMouseDrag = false;
    }
    glutPostRedisplay()
}

// handleMouseMotion
//
// Reorients the object based on the movement of a mouse drag.
// This movement gets accumulated into `gOrientation`.
//
function handleMouseMotion(x, y) {
    
    /*
     * Uses the last and current location of mouse to compute a
     * trackball rotation. This gets stored in the quaternion
     * gOrientation.
     *
     */
    
    // Capture mouse's position.
    mouseNow = worldCoords(x,y)

    // Update object/light orientation based on movement.
    dx = mouseNow.x - gMouseStart.x;
    dy = mouseNow.y - gMouseStart.y;
    axis = (new Vector3d(-dy,dx,0.0)).unit()
    angle = Math.asin(Math.min(Math.sqrt(dx*dx+dy*dy),1.0))
    gOrientation = quatClass.for_rotation(angle,axis).times(gOrientation);

    // Ready state for next mouse move.
    gMouseStart = mouseNow;

    // Update window.
    glutPostRedisplay()
}

// ***** DRIVER *****

//
// Application driver and auxilliary functions.
//


function resizeWindow(w, h) {
    /*
     * Register a window resize by changing the viewport. 
     */
    glViewport(0, 0, w, h);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    if (w > h) {
        glOrtho(-w/h, w/h, -1.0, 1.0, -1.0, 1.0);
    } else {
        glOrtho(-1.0, 1.0, -h/w * 1.0, h/w * 1.0, -1.0, 1.0);
    }
    glutPostRedisplay();
}

function main() {
    /*
     * The main procedure, sets up GL and GLUT.
     */

    // set up GL and GLUT, its canvas, and other components.
    glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB | GLUT_DEPTH);
    glutInitWindowPosition(0, 20);
    glutInitWindowSize(360, 360);
    glutCreateWindow('object showcase' )
    resizeWindow(360, 360);
    
    // Build the renderable objects.
    makeThings();

    // Register interaction callbacks.
    glutKeyboardFunc(handleKey);
    glutReshapeFunc(resizeWindow);
    glutDisplayFunc(drawScene);
    glutMouseFunc(handleMouseClick)
    glutMotionFunc(handleMouseMotion)

    // Go!
    glutMainLoop();

    return 0;
}

glRun(main,true);
