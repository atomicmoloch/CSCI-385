Kavi Wilson
Csci 385 F24
Jim Fix
2024/11/07

3.1 and 3.2:

The Combo method of my shot class relies on position.combo, and a new method I created in the Vector3d class, combo2d.
The 2d nature of combo2d is implemented by simply ignoring the z vector.
Combo2D calculates the difference between the two vectors it's passed, and conducts a lerp betwixt this difference value and the original angle of the vector based on the weight value passed to the function.
Finally, combo2d returns the x axis unit vector rotated by the rotational angle calculated by the lerp function. This is by means of another Vector3d class function I implemented, rotate2d.

3.3:
I wrote the standalone function smoothPath, which implementes Chaikin subdivision on a list of shots. I did not build it into the WalkThru class so that its results could be passed to itself recursively to build smooth lines.
In both the drawCameraPath and toPDF, smoothPath is passed to itself once. I may in the future add an explicit smoothness option to the interface.

DrawCameraPath outputs the curved path made by smoothPath, with small shot objects placed at the locations of and in the directions of the intermediary shots.

ToPDF now outputs its flipped book based on a double Chaikin subdivision of the user-added shots.

Kavi

2024/11/12 update:
Forgot to include the sample pdf/path screenshot. Uploaded that.
