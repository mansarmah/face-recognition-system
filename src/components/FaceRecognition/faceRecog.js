import React from "react";

const FaceRecognition = ( {imageUrl} ) => {
    return(
        <div className="center">
            <img src={imageUrl}  style={{height:400, padding:50}}/>
        </div>
    )
}

export default FaceRecognition;