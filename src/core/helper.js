export const Bitmask = {
    Add(base, ...flags) {
        for(let flag of flags) {
            base |= flag;
        }

        return base;
    },
    Remove(base, ...flags) {
        for(let flag of flags) {
            base &= ~flag;
        }

        return base;
    },
    // Add(base, flag) {
    //     return base |= flag;
    // },
    // Remove(base, flag) {
    //     return base &= ~flag;
    // },
    Has(base, flag) {
        return (base & flag) === flag;
    }
};

export function ArrayToObject(array, key) {
    return array.reduce((obj, item) => {
        return {
            ...obj,
            [ item[ key ] ]: item
        };
    }, {});
};

export function StringifyCyclic(input, spaces = null) {
    let log = console.warn || console.info || console.log;
    log(`[Development Only]: This function performs a shallow object check by storing objects it has seen.  It will therefore NOT display occurences of that object after the 1st time.  This will very likely cause an object to appear to be missing information.  Use with caution.`);

    const getCircularReplacer = () => {
        const seen = new WeakSet();

        return (key, value) => {
            if (typeof value === "object" && value !== null) {
                if (seen.has(value)) {
                    return;
                }
                seen.add(value);
            }
    
            return value;
        };
    };
    
    return JSON.stringify(input, getCircularReplacer(), spaces);
};

export function GenerateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        // eslint-disable-next-line
        let r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8);
        
        return v.toString(16);
    });
}

// export function LoadImages(
//     uri,
//     canvas = null,
//     {
//         type = "row",
//         x = 0,
//         y = 0,
//         padX = 0,
//         padY = 0, 
//         baseURI = `./assets/images/`,
//         oneach = null
//     } = {}
// ) {
//     if(Array.isArray(uri)) {
//         let promises = uri.map(u => LoadImage(u, baseURI)),
//             resolutions = Promise.all(promises);

//         if(canvas) {
//             let ctx = canvas.getContext("2d"),
//                 wmax = 0,
//                 hmax = 0,
//                 x0 = x,
//                 y0 = y;

//             resolutions
//                 .then(images => {                    
//                     images.forEach(i => {
//                         if(i.width > wmax) {
//                             wmax = i.width;
//                         }
//                         if(i.height > hmax) {
//                             hmax = i.height;
//                         }
//                     })
                    
//                     for(let i in images) {
//                         let img = images[ i ];

//                         if(typeof oneach === "function") {
//                             oneach(img, [ x, y, wmax, hmax, uri, canvas ]);
//                         }

//                         ctx.drawImage(img, x, y);

//                         if(type === "row") {
//                             x += wmax + padX;
//                         } else if(type === "col") {
//                             y += hmax + padY;
//                         } else if(type === "wrap") {
//                             if(x + (wmax * 2) + padX > canvas.width) {
//                                 y += hmax + padY;
//                                 x = x0;
//                             } else {
//                                 x += wmax + padX;
//                             }
//                         }
//                     }

//                     if(canvas.setAttribute) {
//                         canvas.setAttribute("tile-w", wmax);
//                         canvas.setAttribute("tile-h", hmax);
//                     }
//                 });
//         }

//         return resolutions;
//     }

//     return LoadImage(uri);
// }
// export function LoadImage(uri, baseURI = `./assets/images/`) {
//     return new Promise((resolve, reject) => {
//         let img = new Image();
//         img.onload = () => resolve(img);
//         img.onerror = reject;
//         img.src = `${ baseURI }${ uri }`;
//     });
// }

export function Clamp(value, min = null, max = null) {
    if(min !== null && value < min) {
        return min;
    }
    if(max !== null && value > max) {
        return max;
    }

    return value;
}

export default {
    GenerateUUID,
    ArrayToObject,
    StringifyCyclic,
    // LoadImage,
    // LoadImages,
    Clamp,
    Bitmask
};