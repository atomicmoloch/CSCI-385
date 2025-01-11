
function divisorsTo(n) {
    let divs = [];
    let d = 1;
    while (d <= n) {
        if (n % d == 0) {
            divs.push(d);
        }
        d++;
    }
    return divs;
}

function divisors(n) {
    let dlist = divisorsTo(n);
    let andstr = "" //Would throw errors at having a string defined in an if statement

    if (dlist.length > 2) {
        andstr = ",and ";
    }
    else { //messy, but idk how to resolve the comma issue without an if statement somewhere. I assume there's a way and would like to know how.'
        andstr = " and ";
    }

    dlist.pop();
    rstr = "The divisors of " + n + " are " + (dlist.toString()) + andstr + n + ".";
    rstr = rstr.replaceAll(",", ", ");

    alert(rstr);
}
