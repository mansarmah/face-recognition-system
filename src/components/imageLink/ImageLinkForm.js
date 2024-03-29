import React from "react";
import './ImageLinkForm.css';

const ImageLinkForm = ({onInputChange, onSubmit}) => {
    return (
        <div>
            <p className="f3">
                {'The Magic Eye will detect the faces in your picture'}
            </p>
            <div className="center">
                <div className="form center pa4 br3 shadow-5">
                    <input type='text' className='f4 pa3 w-70 center' onChange={onInputChange} />
                    <button className="w-30 grow f4 link ph3 pv2 dib white bg-light-purple" style={ {borderColor: 'white', color: 'yellow', fontSize: '3ex'}} onClick={onSubmit}>Search</button>
                </div>
            </div>
        </div>
    );
}

export default ImageLinkForm;