

const bboxFlip = (bbox) => ([[bbox[1], bbox[0]],
                             [bbox[3], bbox[2]]]);

const lngLatFlip = (center) => ([center[1], center[0]]);


export {
    bboxFlip,
    lngLatFlip,
}