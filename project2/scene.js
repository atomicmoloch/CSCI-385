//
// Project 2: make a scene
//
// scene.js
//
// CSCI 385: Computer Graphics, Reed College, Fall 2024
//
// This is a sample `opengl.js`-based program that displays a scene of
// a house, a recursively drawn Sierpinski carpet, an empty room, and
// an animation.
//
// The OpenGL drawing part of the code occurs in `draw` and that
// function relies on several helper functions to do its work.  There
// is a `drawHouse`, a `drawSquareSierpinski`, a `drawStillLife`, and
// a `drawWavingArm` function to draw each figure or scene.
//
// Your assignment is to change the four scenes to the following:
//
// - Scene: draw a 2D scene different than the house.
// - Recursive: draw a different fractal,
// - Still life: add a table to the room with objects that sit on it.
// - Animation: show movement of some other articulated figure.
//
// For each of these, you'll write functions that describe their
// components in 2-space and 3-space. These are `make...` functions
// like `makeCube` that rely on `glBegin` and `glEnd` to describe the
// geometry of a component. And then in their `draw...` functions
// you'll use `glTranslatef`, `glRotatef`, and `glScalef` calls to
// place, orient, and scale each component that's drawn.
//
// Your drawings will be hierarchical and rely on a transformation
// stack to layout a component and its subcomponents. You'll use
// calls to `glPushMatrix` and `glPopMatrix` to control the stack,
// saving and restoring where you are working in the scene or with
// the figure.
//
// This is all described in the web document
//
//   http://jimfix.github.io/csci385/assignments/project2/scene.html
//

// ***** GLOBALS *****
//
// Globals for mouse handling.
//
let gOrientation = quatClass.for_rotation(0.0, new Vector3d(1.0,0.0,0.0));
let gMouseStart  = {x: 0.0, y: 0.0};
let gMouseDrag   = false;
var smoothness = 24;

// Global indicating which of the four scenes is shown.
//
var gScene = "scene";

// Globals for the app size.
//
var gLastw = 800;
var gLasth = 640;

// Global for turning any animation on/off.
//
let gAnimate = true;

// Global for perspective vs. orthographic viewing of the still life.
//
let gPerspective = true;

//
// Globals for several scenes' controls.
//

// For the 2-D scene...
var gAngle1 = -1.25;
var gAngle2 = 1.25;
var gLocation = {x: -1.5, y: 1.0};

// For the recursive figure...
var gRecursiveLevels = 3;

// For the swinging light in the still life scene...
let gLightTime = 0.0;
let gLightRate = Math.PI/80.0;
let gLightDepth = -0.25;
let gLightRadius = 1.5;
let gLightHalfArc = Math.PI * 45.0 / 180.0;

// For the waving arm...
let rotation = 0.0;


// ***** HOUSE *****

//
// Functions for making and drawing the house scene.
//

// makeRTRI
//
// Describes an isoceles right triangle whose corner is at the origin
// and whose sides are along the +x and +y axes with unit length.
//
function makeRTRI() {
    glBegin(GL_TRIANGLES,"RTRI");
    glVertex3f(0.0,0.0,0.0);
    glVertex3f(1.0,0.0,0.0);
    glVertex3f(0.0,1.0,0.0);
    glEnd();
}

// makeDISK
//
// Describes a unit disk centered at the origin.
//
function makeDISK() {
    glBegin(GL_TRIANGLES,"DISK");
    const sides = 100;
    const dtheta = 2.0 * Math.PI / sides;
    for (let i = 0; i < 100; i++) {
        const theta = i * dtheta;
        // draw a pie slice on the disk
        glVertex3f(0.0,0.0,0.0);
        glVertex3f(Math.cos(theta),
                   Math.sin(theta),
                   0.0);
        glVertex3f(Math.cos(theta + dtheta),
                   Math.sin(theta + dtheta),
                   0.0);
    }
    glEnd();
}

// RTRI
//
// Draws an isoceles right triangle whose corner is at the origin
// and whose sides are along the +x and +y axes with unit length.
//
function RTRI() {
    glBeginEnd("RTRI");
}


// DISK
//
// Draws a unit disk centered at the origin.
//
function DISK() {
    glBeginEnd("DISK");
}

// BOX
//
// Draws a unit square with lower-left corner at the origin.
//
function BOX() {
    RTRI();
    glPushMatrix();
    glTranslatef(1.0,1.0,0.0);
    glRotatef(180.0,0.0,0.0,1.0)
    RTRI();
    glPopMatrix();
}


function ROOF() {

    glPushMatrix();
    glTranslatef(1.0,0.0,0.0);
    RTRI();
    glPopMatrix();

    glPushMatrix();
    glRotatef(90.0,0.0,0.0,1.0)
    RTRI();
    glPopMatrix();

    BOX();
}
//

//   
function SUN() {
    glPushMatrix();
    glTranslatef(gLocation.x, gLocation.y,-2.0);
    
    glPushMatrix();
    glScalef(0.15,0.15,0.15);
    glColor3f(1.0,0.8,0.3);
    DISK()
    glPopMatrix();
    
    glPopMatrix();
}

function CAR() {

    //Body
    glPushMatrix();
    glScalef(2.0,0.5,0.0);
    glTranslatef(-0.5,0.1,0.0);
    BOX();
    glPopMatrix();

    //Roof
    glPushMatrix();
    glScalef(0.4,0.4,0.0);
    glTranslatef(-0.6, 1.35, 0.0);
    ROOF();
    glPopMatrix();

    //Windows
    glColor3f(0.5,0.5,1.0);
    glPushMatrix();
    glScalef(0.3,0.3,0.0);
    glTranslatef(-0.6, 1.8, 0.0);
    ROOF();
    glPopMatrix();


    //Tyres
    glColor3f(0.0,0.0,0.0);

    glPushMatrix();
    glScalef(0.2,0.2,0.2);
    glTranslatef(3.0,0.0,0.0);
    DISK();
    glPopMatrix();

    glPushMatrix();
    glScalef(0.2,0.2,0.2);
    glTranslatef(-3.0,0.0,0.0);
    DISK();
    glPopMatrix();

    //Hubcaps
    glColor3f(0.9,0.9,0.9);

    glPushMatrix();
    glScalef(0.1,0.1,0.1);
    glTranslatef(6,0.0,0.0);
    DISK();
    glPopMatrix();

    glPushMatrix();
    glScalef(0.1,0.1,0.1);
    glTranslatef(-6,0.0,0.0);
    DISK();
    glPopMatrix();


}

//
// drawHouse
//
// Draws a scene depicting a house, a yard, a tree, the sun.
//
function drawRoad() {
    SUN();

    glPushMatrix();
    
    glTranslatef(0.0,-1.5,0.0);

    // Draw the yard.
    glColor3f(0.3,0.3,0.3);
    glPushMatrix();
    glTranslatef(5.0,0.0,0.0);
    glRotatef(180,0.0,0.0,1.0);
    glScalef(10.0,10.0,10.0);
    BOX();
    glPopMatrix();

    // Draw car 1
    glColor3f(0.9, 0.3, 0.3);
    glPushMatrix();
    glTranslatef(gAngle1,0.0,0.0);
    CAR();
    glPopMatrix();

    // Draw car 2
    glColor3f(0.3, 0.9, 0.3);
    glPushMatrix();
    glTranslatef(gAngle2,0.0,0.0);
    CAR();
    glPopMatrix();

    glPopMatrix();
}

// ***** STILL LIFE *****
//
// Functions for making and drawing the still life.
//

//
// makeLight
//
// Makes a coarsely-faceted spherical object 
// It is centered at the origin and has a radius of 1.0.
//
// Name of the object is "Light"
//
function makeLight() {

    const NUM_SIDES = 8;
    
    glBegin(GL_TRIANGLES, "Light", false, false);

    let angle = 2.0*Math.PI/NUM_SIDES;
    let radius = Math.sin(angle);

    // Make the bottom polar cap for its sphere.
    for (let i=0; i<NUM_SIDES; i++) {
        glNormal3f(radius*Math.cos(i*angle),
                   Math.cos(angle),
                   radius*Math.sin(i*angle));
        glVertex3f(radius*Math.cos(i*angle),
                   Math.cos(angle),
                   radius*Math.sin(i*angle));
        glNormal3f(radius*Math.cos((i+1)*angle),
                   Math.cos(angle),
                   radius*Math.sin((i+1)*angle));
        glVertex3f(radius*Math.cos((i+1)*angle),
                   Math.cos(angle),
                   radius*Math.sin((i+1)*angle));
        glNormal3f(0,0,-1.0);
        glVertex3f(0,0,-1.0);
    }

    // Make the rest of the sphere.
    for (let i=1; i<NUM_SIDES; i++) {
        radius0 = Math.sin(i*angle);
        radius1 = Math.sin((i+1)*angle);
        height0 = Math.cos(i*angle);
        height1 = Math.cos((i+1)*angle);

        // Wrap a band at a certain latitude. Each iteration
        // makes a hinge of two triangles, advancing the band
        // for one longitude.
        for (let j=0; j<NUM_SIDES; j++) {

            // One of the triangles.
            glNormal3f(radius0*Math.cos(j*angle),
                       height0,
                       radius0*Math.sin(j*angle));
            glVertex3f(radius0*Math.cos(j*angle),
                       height0,
                       radius0*Math.sin(j*angle));
            glNormal3f(radius0*Math.cos((j+1)*angle),
                       height0,
                       radius0*Math.sin((j+1)*angle));
            glVertex3f(radius0*Math.cos((j+1)*angle),
                       height0,
                       radius0*Math.sin((j+1)*angle));
            glNormal3f(radius1*Math.cos(j*angle),
                       height1,
                       radius1*Math.sin(j*angle));
            glVertex3f(radius1*Math.cos(j*angle),
                       height1,
                       radius1*Math.sin(j*angle));

            // The other triangle.
            glNormal3f(radius0*Math.cos((j+1)*angle),
                       height0,
                       radius0*Math.sin((j+1)*angle));
            glVertex3f(radius0*Math.cos((j+1)*angle),
                       height0,
                       radius0*Math.sin((j+1)*angle));
            glNormal3f(radius1*Math.cos((j+1)*angle),
                       height1,
                       radius1*Math.sin((j+1)*angle));
            glVertex3f(radius1*Math.cos((j+1)*angle),
                       height1,
                       radius1*Math.sin((j+1)*angle));
            glNormal3f(radius1*Math.cos(j*angle),
                       height1,
                       radius1*Math.sin(j*angle));
            glVertex3f(radius1*Math.cos(j*angle),
                       height1,
                       radius1*Math.sin(j*angle));
        }
    }
    glEnd();
}

// ***** RECURSIVE *****

//
// Functions for making and drawing the Sierpinski triangle
//

// makeSquare
//
// Makes a unit triangle centered at the origin.
//
function makeTriangle() {
    glBegin(GL_TRIANGLES, "Triangle");
    glVertex3f(0.0, 0.5, 0.0);
    glVertex3f(-0.5,-0.5, 0.0);
    glVertex3f( 0.5,-0.5, 0.0);
    glEnd();
}

// drawSquareSierpinski
//
// Draws the recursive figure of a Sierpinski triangle.  The integer
// parameter `levels` indicates how many recursive levels should be
// shown. 0 indicates that only a solid triangle gets drawn.
//
function drawTriangleSierpinski(levels) {
    if (levels == 0) {
        glBeginEnd("Triangle");
    } else {
        glPushMatrix();
        glScalef(1/2, 1/2, 1/2);

        glPushMatrix();
        glTranslatef(0, 0.5, 0);
        drawTriangleSierpinski(levels-1);
        glPopMatrix();

        glPushMatrix();
        glTranslatef(0.5, -0.5, 0);
        drawTriangleSierpinski(levels-1);
        glPopMatrix();

        glPushMatrix();
        glTranslatef(-0.5, -0.5, 0);
        drawTriangleSierpinski(levels-1);
        glPopMatrix();

        glPopMatrix();
        }
    }

//
// makeCube
//
// Makes a cube object centered at the origin and with width of 2.0.
// Name of the object is "Cube".
//
function makeCube() {
    /*
     * This describes the facets of a cube.
     *
     * The cube is centered at the origin and the coordinates
     * of all its corner points have value +/-1.0
     */
    
    glBegin(GL_TRIANGLES,"Cube", false, false);
    
    // front
    glNormal3f( 0.0, 0.0, 1.0);
    glVertex3f(-1.0,-1.0, 1.0);
    glVertex3f( 1.0,-1.0, 1.0);
    glVertex3f( 1.0, 1.0, 1.0);
    
    glVertex3f( 1.0, 1.0, 1.0);
    glVertex3f(-1.0, 1.0, 1.0);
    glVertex3f(-1.0,-1.0, 1.0);
    
    // back
    glNormal3f( 0.0, 0.0,-1.0);
    glVertex3f(-1.0,-1.0,-1.0);
    glVertex3f( 1.0,-1.0,-1.0);
    glVertex3f( 1.0, 1.0,-1.0);
    
    glVertex3f( 1.0, 1.0,-1.0);
    glVertex3f(-1.0, 1.0,-1.0);
    glVertex3f(-1.0,-1.0,-1.0);

    // left
    glNormal3f(-1.0, 0.0, 0.0);
    glVertex3f(-1.0,-1.0,-1.0);
    glVertex3f(-1.0, 1.0,-1.0);
    glVertex3f(-1.0, 1.0, 1.0);
    
    glVertex3f(-1.0, 1.0, 1.0);
    glVertex3f(-1.0,-1.0, 1.0);
    glVertex3f(-1.0,-1.0,-1.0);
    
    // right
    glNormal3f( 1.0, 0.0, 0.0);
    glVertex3f( 1.0,-1.0,-1.0);
    glVertex3f( 1.0, 1.0,-1.0);
    glVertex3f( 1.0, 1.0, 1.0);
    
    glVertex3f( 1.0, 1.0, 1.0);
    glVertex3f( 1.0,-1.0, 1.0);
    glVertex3f( 1.0,-1.0,-1.0);
    
    // top
    glNormal3f( 0.0, 1.0, 0.0);
    glVertex3f(-1.0, 1.0,-1.0);
    glVertex3f( 1.0, 1.0,-1.0);
    glVertex3f( 1.0, 1.0, 1.0);
    
    glVertex3f( 1.0, 1.0, 1.0);
    glVertex3f(-1.0, 1.0,-1.0);
    glVertex3f(-1.0, 1.0, 1.0);

    // bottom
    glNormal3f( 0.0,-1.0, 0.0);
    glVertex3f(-1.0,-1.0,-1.0);
    glVertex3f( 1.0,-1.0, 1.0);
    glVertex3f( 1.0,-1.0,-1.0);

    glVertex3f( 1.0,-1.0, 1.0);
    glVertex3f(-1.0,-1.0, 1.0);
    glVertex3f(-1.0,-1.0,-1.0);

    //
    glEnd();
}

//
// makeWall
//
// Makes a 2x2 square centered in x-y, and sitting back at z=-1.0.
//
// The name of the object (for glBeginEnd) is "Wall".
//
function makeWall() {
    
    glBegin(GL_TRIANGLES, "Wall", false, true);
    
    // glNormal3f(0.0,0.0,1.0);
    glVertex3f(-1.0, -1.0, -1.0);
    glVertex3f( 1.0, -1.0, -1.0);
    glVertex3f( 1.0,  1.0, -1.0);

    // glNormal3f(0.0,0.0,1.0);
    glVertex3f(-1.0, -1.0, -1.0);
    glVertex3f( 1.0,  1.0, -1.0);
    glVertex3f(-1.0,  1.0, -1.0);
    glEnd();
}

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


//
// drawTableLeg
//
// Draw a square-sectioned table leg, sitting on the x-z plane with
// the given `width`, and centered at and rising up the y-axis at the
// specified `height`.
//
function drawTableLeg(width,height) {
      
    glPushMatrix();
    glTranslatef(0.0,height/2,0.0);  
    glScalef(width/2.0,height/2.0,width/2.0);
    glBeginEnd("Cube");
    glPopMatrix();
}

//
// drawTable
//
// Lays out a square table with the given `width`/depth, at the given
// `height`, whose legs and surface are the given `thickness`. The
// table legs stand on the x-z plane.
//
function drawTable(width,height,thickness) {

    let cornerDistance = width/2.0 - thickness/2.0
    glPushMatrix();
    glTranslatef(-cornerDistance, 0.0,-cornerDistance);
    drawTableLeg(thickness,height-thickness);
    glPopMatrix();
    
    glPushMatrix();
    glTranslatef(-cornerDistance, 0.0,cornerDistance);
    drawTableLeg(thickness,height-thickness);
    glPopMatrix();
    
    glPushMatrix();
    glTranslatef(cornerDistance, 0.0,cornerDistance);
    drawTableLeg(thickness,height-thickness);
    glPopMatrix();
    
    glPushMatrix();
    glTranslatef(cornerDistance, 0.0,-cornerDistance);
    drawTableLeg(thickness,height-thickness);
    glPopMatrix();
    
    glPushMatrix();
    glTranslatef(0.0,height-thickness/2.0,0.0);
    glScalef(width/2.0,thickness/2.0,width/2.0);
    glBeginEnd("Cube");
    glPopMatrix();
}

//
// drawRoom
//
// Lays out the walls, ceiling, and floor of a 2x2x2 room centered
// at the origin. The left and right walls are red and blue. The other
// three surfaces are white.
//
function drawRoom() {
    glPushMatrix()
    glTranslatef(0.0,1.0,0.0);
    
    glPushMatrix();
    glColor3f(0.8,0.8,0.8);
    glTranslatef(0.0,0.0,0.0);
    glBeginEnd("Wall");
    glPopMatrix();
    
    glPushMatrix();
    glRotatef(90,0.0,1.0,0.0);
    glColor3f(0.8,0.6,0.6);
    glBeginEnd("Wall");
    glPopMatrix();

    glPushMatrix();
    glRotatef(-90,0.0,1.0,0.0);
    glColor3f(0.6,0.6,0.8);
    glBeginEnd("Wall");
    glPopMatrix();
    
    glPushMatrix();
    glRotatef(90,1.0,0.0,0.0);
    glColor3f(0.8,0.8,0.8);
    glBeginEnd("Wall");
    glPopMatrix();
    
    glPushMatrix();
    glRotatef(-90,1.0,0.0,0.0);
    glColor3f(0.8,0.8,0.8);
    glBeginEnd("Wall");
    glPopMatrix();

    glPopMatrix();
}

function drawD8() {

    glPushMatrix();
    glTranslatef(-0.5, 0.85, 0.5);
    glScalef(0.1, 0.1, 0.1);
    glRotatef(-90.0,1.0,0.0,0.0);
    glRotatef(105.0,0.0,0.0,1.0);
    glBeginEnd("D8");
    glPopMatrix();

}

function drawTop() {

    glPushMatrix();
    glTranslatef(0.5, 0.85, 0.5);
    glScalef(0.1, 0.1, 0.1);
    glRotatef(105.0,0.0,0.0,1.0);
    glBeginEnd("Top");
    glPopMatrix();

}

function drawSphere() {
    glPushMatrix();
    glTranslatef(0.0, 1.2, -0.5);
    glScalef(0.3, 0.3, 0.3);
    glBeginEnd("Sphere");
    glPopMatrix();
}

function drawTorus() {
    glPushMatrix();
    glTranslatef(0.0, 1.2, -0.5);
    glScalef(0.3, 0.3, 0.3);
    glBeginEnd("Torus");
    glPopMatrix();

}

function drawMussolini() {
    glPushMatrix();
    glTranslatef(0.0, 0.9, 0.5);
    glScalef(0.1, 0.1, 0.1);
    glBeginEnd("Mussolini");
    glPopMatrix();

}


// drawStillLife
//
// Function that can be used to draw the still life of a table sitting
// in a room with objects sitting on it.
//
function drawStillLife() {

    drawRoom();
    drawTable(1.5, 0.75, 0.1);
    drawD8();
    drawTop();
    drawTorus();
    drawSphere();
    drawMussolini();

}

// ***** ANIMATION *****

//
// Functions for making and drawing the waving arm animation.
//

//
// makeWireCube
//
// Makes a wireframe cube object whose sides are unit-lengthed
// that is centered at the origin.
//
function makeWireCube() {
    glBegin(GL_LINES, "WireCube");

    // front-back
    glVertex3f( 0.5, 0.5, 0.5);
    glVertex3f( 0.5, 0.5,-0.5);
    
    glVertex3f( 0.5,-0.5, 0.5);
    glVertex3f( 0.5,-0.5,-0.5);
    
    glVertex3f(-0.5,-0.5, 0.5);
    glVertex3f(-0.5,-0.5,-0.5);
    
    glVertex3f(-0.5, 0.5, 0.5);
    glVertex3f(-0.5, 0.5,-0.5);


    // side-side
    glVertex3f(-0.5, 0.5, 0.5);
    glVertex3f( 0.5, 0.5, 0.5);
    
    glVertex3f(-0.5, 0.5,-0.5);
    glVertex3f( 0.5, 0.5,-0.5);
    
    glVertex3f(-0.5,-0.5,-0.5);
    glVertex3f( 0.5,-0.5,-0.5);
    
    glVertex3f(-0.5,-0.5, 0.5);
    glVertex3f( 0.5,-0.5, 0.5);


    // down-up
    glVertex3f( 0.5,-0.5, 0.5);
    glVertex3f( 0.5, 0.5, 0.5);
    
    glVertex3f( 0.5,-0.5,-0.5);
    glVertex3f( 0.5, 0.5,-0.5);
    
    glVertex3f(-0.5,-0.5,-0.5);
    glVertex3f(-0.5, 0.5,-0.5);
    
    glVertex3f(-0.5,-0.5, 0.5);
    glVertex3f(-0.5, 0.5, 0.5);
    
    glEnd();
}

//
// drawWavingArm
//
// Draws an arm and hand that waves according to the values of the
// globals `gShoulder`, `gElbow`, and `gWrist`. These globals give the
// angle in radians for each of these joints. The three globals are
// updated by a certain change in angle when this function executes,
// though only if `gAnimate` is set to `true`.
//
function drawWavingArm() {
    if (gAnimate) {
        rotation += 5;
        if (rotation >= 360) {
          //  rotation -= 5
            rotation -= 360;
        }
    }
    
    glColor3f(0.75,0.85,0.5)

    glPushMatrix();
    glTranslatef(0.0, -1.0, 0.0);
    glScalef(1.5, 1.5, 0.5);
    glRotatef(rotation, 0.0, 0.0, 1.0);
    glBeginEnd("WireCube");
    glPopMatrix();

    glPushMatrix();
    glRotatef(Math.sin(rotation * (Math.PI / 180)) * 22.5, 0.0, 0.0, 1.0);
    glTranslatef(0.0, 0.5, 0.0); //Centers arm on flywheel
    glTranslatef(0.0, -Math.abs(rotation - 180)/360 * 1.5, 0.5);
    glScalef(0.3, 2.0, 0.5);
    glBeginEnd("WireCube");
    glPopMatrix();

    glPushMatrix();
    glTranslatef(0.0, -Math.abs(rotation - 180)/360  + 1.5, 0.5);
    glBeginEnd("WireCube");
    glPopMatrix();


}

// ***** DRAW *****

//
// Function that displays the user-chosen scene or figure.
//
    
function draw() {
    /*
     * Issue GL calls to draw the requested graphics.
     */

    // Clear the rendering information.
    if (gScene == "scene") {
        glClearColor(0.8, 0.9, 1.0, 1.0);        
    } else {
        glClearColor(0.2, 0.25, 0.3, 1.0);
    }
    glClearDepth(1.0);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

    // Set up the projection matrix.
    //
    // We have perspective projection for the still life and for
    // the 3-D animation (though it can be set to orthographic
    // by flipping the global `gPerspective`).
    //
    // We have orthographic perspective for the other two scenes,
    // which are 2-D.
    //
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    let w = gLastw;
    let h = gLasth;
    if (gScene == "still-life" && gPerspective || gScene == "animation") {
        if (w > h) {
            glFrustum(-w/h*2.0, w/h*2.0, -2.0, 2.0, 2.0, 6.0);
        } else {
            glFrustum(-2.0, 2.0, -h/w * 2.0, h/w * 2.0, 2.0, 6.0);
        }
    } else if (gScene == "still-life" && !gPerspective) {
        if (w > h) {
            glOrtho(-w/h*2.0, w/h*2.0, -2.0, 2.0, 2.0, 6.0);
        } else {
            glOrtho(-2.0, 2.0, -h/w * 2.0, h/w * 2.0, 2.0, 6.0);
        }
    } else {
        if (w > h) {
            glOrtho(-w/h*2.0, w/h*2.0, -2.0, 2.0, -2.0, 2.0);
        } else {
            glOrtho(-2.0, 2.0, -h/w * 2.0, h/w * 2.0, -2.0, 2.0);
        }
    }        

    //
    // Clear the transformation stack.
    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();


    //
    // Call the appropriate "draw..." function.
    //
    
    if (gScene == "scene") {

        // The coordinate frame for this 2D scene has a lower left corner
        // at (-2.5,-2) and an upper right corner at (2.5,2). The depth
        // values (i.e the z values) range between -2 and 2.
        //
        drawRoad();
        
    } else if (gScene == "recursive") {

        // The coordinate frame for this 2D scene has a lower left corner
        // at (-2.5,-2) and an upper right corner at (2.5,2). The depth
        // values (i.e the z values) range between -2 and 2.
        //
        glPushMatrix();
        glScalef(3.0,3.0,3.0);
        glColor3f(0.6, 0.4, 0.65);
        drawTriangleSierpinski(gRecursiveLevels);
        glPopMatrix();
        
    } else if (gScene == "still-life") {

        if (gAnimate) {
            gLightTime += gLightRate;
        }
        // Have the light rock between -2 and -6.
        let arcPosition = Math.sin(gLightTime)
        let arcX = gLightRadius * Math.sin(gLightHalfArc * arcPosition);
        let arcY = 2.0 - gLightRadius * Math.cos(gLightHalfArc * arcPosition);

        if (gAnimate) {

            //
            // If in animation mode, show the swinging light on the
            // end of a cord.
            //

            // Show a black cord swinging from the ceiling.
            glPushMatrix();
            glColor3f(0.0,0.0,0.0);
            glTranslatef(0.0,2.0,-2.0+gLightDepth);
            glRotatef(arcPosition*gLightHalfArc*180.0/Math.PI,0.0,0.0,1.0);
            glScalef(0.01,gLightRadius-0.07,0.01);
            glTranslatef(0.0,-0.5,0.0);
            glBeginEnd("WireCube");
            glPopMatrix();

            // Show where the cord meets the ceiling.
            glPushMatrix();
            glColor3f(0.0,0.0,0.0);
            glTranslatef(0.0,2.0,-2.0+gLightDepth);
            glScalef(0.07,0.002,0.07);
            glBeginEnd("Light");
            glPopMatrix();

            // Show a warm-colored light bulb at the end of the cord.
            glPushMatrix();
            glColor3f(0.9,0.9,0.7);
            glTranslatef(arcX,arcY,-2.0+gLightDepth);
            glScalef(0.07,0.07,0.07);
            glBeginEnd("Light");
            glPopMatrix();
        }

        //
        // Light up the scene with three lights using Phong shading.
        //
        glEnable(GL_LIGHTING);

        // Ambient light along with a diffuse light shining from above
        // the viewer.
        glEnable(GL_LIGHT0);
        glLightfv(GL_LIGHT0, GL_AMBIENT, [0.5,0.5,0.5]);
        glLightfv(GL_LIGHT0, GL_DIFFUSE, [0.5,0.5,0.5]);
        glLightfv(GL_LIGHT0, GL_SPECULAR, [0.0,0.0,0.0]);
        glLightfv(GL_LIGHT0, GL_POSITION, [0.0, 2.0, 1.0]);

        // A light that swings from the ceiling in front of the viewer,
        // with diffuse and specular components.
        //
        glEnable(GL_LIGHT1);
        glLightfv(GL_LIGHT1, GL_AMBIENT, [0.0,0.0,0.0]);
        glLightfv(GL_LIGHT1, GL_DIFFUSE, [0.1,0.1,0.1]);
        glLightfv(GL_LIGHT1, GL_SPECULAR, [0.3,0.3,0.2]);
        glLightfv(GL_LIGHT1, GL_POSITION, [arcX, arcY, -2.0+gLightDepth]);

        // Additional diffuse light that shines from below the viewer. 
        // 
        glEnable(GL_LIGHT2);
        glLightfv(GL_LIGHT2, GL_AMBIENT, [0.0,0.0,0.0]);
        glLightfv(GL_LIGHT2, GL_DIFFUSE, [0.2,0.2,0.2]);
        glLightfv(GL_LIGHT2, GL_SPECULAR, [0.0,0.0,0.0]);
        glLightfv(GL_LIGHT2, GL_POSITION, [0.0,-1.0,0.0]);

        /*
         * Sets the coordinate frame so that the room containing the
         * still life is specified as a 2 x 2 x 2 cube centered at (0,0,0)
         *
         */ 
        glPushMatrix();
        glTranslatef(0.0,-2.0,-4.0);
        glScalef(2.0,2.0,2.0);
        //
        drawStillLife();
        //
        glPopMatrix();

        //
        // We're done drawing so turn off the Phong shading. 
        //
        glDisable(GL_LIGHTING);
        glDisable(GL_LIGHT0);
        glDisable(GL_LIGHT1);
        
    } else if (gScene == "animation") {
        
        glPushMatrix();
        
        // Push the scene back so that the animation's coordinate frame
        // is a 4 x 4 x 4 cube centered at (0,0,0).
        glTranslatef(0.0,0.0,-4.0);
        
        // Reorient according to the "trackball" motion of a mouse drag.
        gOrientation.glRotatef();
        
        drawWavingArm();
        
        glPopMatrix();

    }
    // Render the scene.
    glFlush();
}


// ***** INTERACTION *****

//
// Functions for handling mouse movement and keypresses.
//

//
// Functions for responding to app controls.
//

function setLevel(level) {
    gRecursiveLevels = level;
    glutPostRedisplay();
}

function setAngle1(angle) {
    gAngle1 = angle;
    glutPostRedisplay();
}

function setAngle2(angle) {
    gAngle2 = angle;
    glutPostRedisplay();
}

function handleKey(key, x, y) {
    /* 
     * Handle a keypress.
     */

    // Handle the s key.
    if (key == 's') {
        gScene = "scene";
        // Redraw.
        glutPostRedisplay();
    }
    
    // Handle the r key.
    if (key == 'r') {
        gScene = "recursive";
        // Redraw.
        glutPostRedisplay();
    }
    
    // Handle the l key.
    if (key == 'l') {
        if (gScene == "still-life") {
            gAnimate = !gAnimate;
        } else {
            gScene = "still-life";
            gAnimate = false;
        }
        // Redraw.
        glutPostRedisplay();
    }

    // Handle the v key.
    if (key == 'v') {
        if (gScene == "still-life") {
            gPerspective = !gPerspective;
        }
        // Redraw.
        glutPostRedisplay();
    }
    
    // Handle the a key.
    if (key == 'a') {
        if (gScene == "animation") {
            gAnimate = !gAnimate;
        } else {
            gScene = "animation";
            gAnimate = true;
        }

        // Redraw.
        glutPostRedisplay();
    }
    
}

function worldCoords(mousex, mousey) {
    /*
     * Compute the world/scene coordinates associated with
     * where the mouse was clicked.
     */

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

function handleMouseClick(button, state, x, y) {
    /*
     * Records the location of a mouse click in 
     * world/scene coordinates.
     */

    // Start tracking the mouse for trackball motion.
    gMouseStart  = worldCoords(x,y);
    if (state == GLUT_DOWN) {
        gMouseDrag = true;
    } else {
        gMouseDrag = false;
    }

    if (gScene == "scene") {
        gLocation = gMouseStart;
    }
    
    glutPostRedisplay()
}

function handleMouseMotion(x, y) {
    /*
     * Reorients the object based on the movement of a mouse drag.
     *
     * Uses last and current location of mouse to compute a trackball
     * rotation. This gets stored in the quaternion orientation.
     *
     */
    
    // Capture mouse's position.
    mouseNow = worldCoords(x,y)

    // Update object/light orientation based on movement.
    dx = mouseNow.x - gMouseStart.x;
    dy = mouseNow.y - gMouseStart.y;

    // Ready state for next mouse move.
    gMouseStart = mouseNow;

    if (gScene == "animation") {
        axis = (new Vector3d(-dy,dx,0.0)).unit()
        angle = Math.asin(Math.min(Math.sqrt(dx*dx+dy*dy),1.0))
        gOrientation = quatClass.for_rotation(angle,axis).times(gOrientation);
    }
    if (gScene == "scene") {
        gLocation = gMouseStart;
    }
    
    // Update window.
    glutPostRedisplay()
}

// ***** DRIVER *****

//
// Application driver and auxilliary functions.
//

function ortho(w,h) {
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    gLastw = w;
    gLasth = h;
}

function resizeWindow(w, h) {
    /*
     * Register a window resize by changing the viewport.
     */
    glViewport(0, 0, w, h);
    ortho(w,h);
}

function main() {
    glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB | GLUT_DEPTH);
    glutInitWindowPosition(0, 20);
    glutInitWindowSize(800, 640);
    glutCreateWindow('A scene.');

    makeRTRI();
    makeDISK();
    makeTriangle();
    makeWireCube();
    makeCube();
    makeLight();
    makeWall();
    makeD8();
    makeSphere();
    makeTop();
    makeTorus();
    makeMussolini();

    ortho(800,640);

    // Register interaction callbacks.
    glutKeyboardFunc(handleKey)
    glutReshapeFunc(resizeWindow)
    glutMouseFunc(handleMouseClick)
    glutMotionFunc(handleMouseMotion)

    glutDisplayFunc(draw);
    glutMainLoop();
}

glRun(main, true);
