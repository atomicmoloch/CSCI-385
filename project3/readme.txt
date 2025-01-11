Kavi Wilson
Csci 385 F24
Jim Fix
2024/10/17

Currently the program is severely underoptimized. I would not reccomend attempting to render many high polygon objects in its current state. In my defense, this is because I only got it working about ten minutes ago. Before then, most edges were wrongly not displayed due to an error in the way my rayFacetIntersect code worked.

My rayFacetIntersect solution was supposed to check that points were simultaneously in the positive span of v1 and v2, and in the negative span of v3, and thus in the triangular facet; however, my original solution instead checked that points were in the positive span of v2, and in the negative span of v1 and v3, allowing erroneous points to be falsely reported as intersected or obscured.

I'm including the segment-intersect and facet-hit test files in my Gradescope submission in case you want to use them. Both are working unaltered with my implementations of their respective functions.

I don't have much else to say here. I didn't implement any features not in the main assignment. My code is straightforward, and specific implementation details are noted in inline comments.

Have a good break,
Kavi
