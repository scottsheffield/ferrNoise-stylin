var ferr = ferr || {};

ferr.noise = {
    gradients : [
        [1,1,0], [-1,1,0], [1,-1,0], [-1,-1,0],
        [1,0,1], [-1,0,1], [1,0,-1], [-1,0,-1],
        [0,1,1], [0,-1,1], [0,1,-1], [0,-1,-1]
    ],
    p : [151,160,137,91,90,15, // wtf numbers numbers numbers numbers numbers
        131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
        190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
        88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,
        77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
        102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,
        135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,
        5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
        223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,
        129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,
        251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,
        49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,
        138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
    ],
    perm : [],
    permMod12 : [],
    F : 1.0 / 3.0,
    G : 1.0 / 6.0,

    dot : function (aGradient, aX, aY, aZ) {
        return aGradient[0] * aX + aGradient[1] * aY + aGradient[2] * aZ;
    },

    simplex : function (aX, aY, aZ) {
        var n0, n1, n2, n3,
            s = (aX + aY + aZ) * ferr.noise.F,
            i = Math.floor(aX + s),
            j = Math.floor(aY + s),
            k = Math.floor(aZ + s),
            t = (i + j + k) * ferr.noise.G,
            X0 = i - t,
            Y0 = j - t,
            Z0 = k - t,
            x0 = aX - X0,
            y0 = aY - Y0,
            z0 = aZ - Z0,
            i1, j1, k1,
            i2, j2, k2;

        if (x0 >= y0) {
            if (y0 >= z0) {
                i1 = i2 = j2 = 1;
                j1 = k1 = k2 = 0;
            } else if (x0 >= z0) {
                i1 = i2 = k2 = 1;
                j1 = k1 = j2 = 0;
            } else {
                i1 = j1 = j2 = 0;
                k1 = i2 = k2 = 1;
            }
        }
        else { // x0 < y0
            if (y0 < z0) {
                i1 = j1 = i2 = 0;
                k1 = j2 = k2 = 1;
            }
            else if (x0 < z0) {
                i1 = k1 = i2 = 0;
                j1 = j2 = k2 = 0;
            } else {
                i1 = k1 = k2 = 0;
                j1 = i2 = j2 = 1;
            }
        }
        var x1 = x0 - i1 + ferr.noise.G,
            y1 = y0 - j1 + ferr.noise.G,
            z1 = z0 - k1 + ferr.noise.G,
            x2 = x0 - i2 + 2.0 * ferr.noise.G,
            y2 = y0 - j2 + 2.0 * ferr.noise.G,
            z2 = z0 - k2 + 2.0 * ferr.noise.G,
            x3 = x0 - 1.0 + 3.0 * ferr.noise.G,
            y3 = y0 - 1.0 + 3.0 * ferr.noise.G,
            z3 = z0 - 1.0 + 3.0 * ferr.noise.G,
            ii = i & 255,
            jj = j & 255,
            kk = k & 255,
            gi0 = ferr.noise.permMod12[ii + ferr.noise.perm[jj + ferr.noise.perm[kk]]],
            gi1 = ferr.noise.permMod12[ii + i1 + ferr.noise.perm[jj + j1 + ferr.noise.perm[kk + k1]]],
            gi2 = ferr.noise.permMod12[ii + i2 + ferr.noise.perm[jj + j2 + ferr.noise.perm[kk + k2]]],
            gi3 = ferr.noise.permMod12[ii + 1 + ferr.noise.perm[jj + 1 + ferr.noise.perm[kk + 1]]],
            t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
            t1, t2, t3;

        if (t0 < 0) {
            n0 = 0.0;
        } else {
            t0 *= t0;
            n0 = t0 * t0 * ferr.noise.dot(ferr.noise.gradients[gi0], x0, y0, z0);
        }

        t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
        if (t1 < 0) {
            n1 = 0.0;
        } else {
            t1 *= t1;
            n1 = t1 * t1 * ferr.noise.dot(ferr.noise.gradients[gi1], x1, y1, z1);
        }
        
        t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
        if (t2<0) {
            n2 = 0.0;
        } else {
            t2 *= t2;
            n2 = t2 * t2 * ferr.noise.dot(ferr.noise.gradients[gi2], x2, y2, z2);
        }
        
        t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
        if (t3 < 0) {
            n3 = 0.0;
        } else {
            t3 *= t3;
            n3 = t3 * t3 * ferr.noise.dot(ferr.noise.gradients[gi3], x3, y3, z3);
        }
        
        return 32.0 * (n0 + n1 + n2 + n3);
    }
}

for (var i=0; i<512; i+=1) {
    ferr.noise.perm[i] = ferr.noise.p[i & 255];
    ferr.noise.permMod12[i] = ferr.noise.perm[i] % 12;
}