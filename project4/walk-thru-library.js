//
// walk-thru.js
//
// Author: Jim Fix
// CSCI 385: Computer Graphics, Reed College, Fall 2024
//
// This defines a library of geometric calculations used by
// `walk-thru.js` as part of the `WalkThru.toPDF` method.  These help
// us determine whether two edges of two scene objects intersect when
// projected to 2-D according to a perspective projection, and to
// determine whether a portion of an object edge is hidden by some
// other object.
//


function segmentsIntersect(P0,P1,Q0,Q1) {
    //
    // Determine whether two 2-D line segments intersect. The first
    // segment runs between points P0 and P1. The second segment runs
    // between Q0 and Q1. These are all Point2d objects.
    //
    // Returns `null` if they do not intersect. Returns a fraction
    // between 0.0 and 1.0 that locates the intersection point along
    // the first segment between P0 and P1.
    //
    // That is to say, if this code returns a scalar value s, and if
    // R is the intersection point of the two line segments, then R
    // should be at P0.combo(s,P1).

    // intersectFraction =
    // (P0 - Q0) x (qLength / (qLength x pLength)
    // Broken into two parts to avoid div/0 errors:
    const pLength = P1.minus(P0);
    const qLength = Q1.minus(Q0);

    const cross1 = ((P0.minus(Q0)).cross(qLength)); //(P0 - Q0) x qLength

    const cross2 = (qLength.cross(pLength)); //(qLength x pLength)

    //Possible todo: add handling for colinear lines
    if (cross2 == 0) {
        //returns null for parallel lines
        return null;
    }
    else {
        const intersectFraction = cross1 / cross2;
        if (!((intersectFraction >= 0) && (intersectFraction <= 1))) {
            //returns null for lines which would cross outside of their lengths
            return null;
        }
        else {
            return intersectFraction;
        }
    }

}

function rayFacetIntersect(Q1,Q2,Q3,R,Rp) {
    //
    // Determine whether a ray eminating from point R and passing
    // through point Rp intersects a triangular facet given by the
    // points Q1 Q2 Q3. These are all Point3d objects.
    //
    // Returns `null` if the ray doesn't hit the facet. If it does,
    // the code should return a primtive Javascript object with two
    // components:
    //
    //    point: the point on the facet struck by the ray
    //    distance: the distance from the ray source R to that point
    //
    const r = Rp.minus(R); //vector3D

    //Implementation of Jim's written part problem 4 solution
    const v1 = (Q3.minus(Q2)).unit(); //all Vector3Ds
    const v2 = (Q2.minus(Q1)).unit();
    const v3 = (Q3.minus(Q1)).unit();

    const nNormal = v2.cross(v3); //Vector3D

    const diff1 = (Q1.minus(R)).dot(nNormal); //float
    const diff2 = r.dot(nNormal); //float

    //finds if the line segment intersects with the plane the facet is on
    if (((diff1/diff2) <= 1) && ((diff1/diff2) >= 0)) {
        const S = R.plus(r.times(diff1/diff2)); //Point3D
        const w  = (S.minus(Q1)).unit(); //Vector3D
        const w3 = (S.minus(Q3)).unit();

        //finds if S is in the positive span of v1 and v2, and in the negative span of v3
        if (((v2.cross(w)).dot(w.cross(v3)) > 0)
            && ((v3.cross(w3)).dot(w3.cross(v1)) > 0)){
            return {point: S, distance:S.dist(R)};
        }
        else {
            return null;
        }

    }
    else {
        return null;
    }

}    

function isColinear(P1, P2, Q1, Q2) {
   // const v1 = P2.minus(P1);
    const v2 = Q2.minus(Q1);
   // const cross = v1.cross(v2);
   // console.log(cross);
   // return (Math.abs(cross.norm()) == 0);
    const b1 = !(rayFacetIntersect(P1, P1, P1, Q1, Q2) == null);
    const b2 = !(rayFacetIntersect(P2, P2, P2, Q1, Q2) == null);
    return (b1 && b2);
}

