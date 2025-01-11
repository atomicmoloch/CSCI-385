===============================================
Kavi Wilson
CSCI 385
Prof. Fix
2024/09/20
===============================================

    I'm really sorry I'm turning this in an hour or so late (1:08 AM as I'm writing this file). I know what you said about submitting works in progress, but I had just a couple of problems to work out (namely, the sphere code was generating overlapping polygons, and inconsistantly would generate holes at the ends) and I didn't want to submit something so close to done.

    For my platonic solid, I made an eight-sided die.

    For the sphere, I first tried to use overlapping cylinders as you suggested on the assignment. However, it didn't look very good or work very well (there were a lot of polygon collisions, and inexplicable small 'holes') so I redid it after a suggestion B posted in the CSCI studying discord to use makeRevolution to create the sphere and torus.

    The smoothness value can be changed with the arrow keys. The minimum value is 2. There is no maximum value

    The makeRevolution objects that I made are a simple model of a top and a copy of the futurist Mussolini bust that was linked in the assignment. For the Mussolini bust, I recorded the coordinates from the pixel coordinates in an image of the bust, which are still a bit messy.

    Finally, I made a random rotational solid generation function. It updates whenever the smoothness level is changed.

    I don't think I have any glaring problems in my code at the moment.

    - Kavi Wilson
