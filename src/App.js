import React, { Component } from 'react';
import Navigation from './components/nav/Navigation';
import './App.css';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imageLink/ImageLinkForm';
import Rank from './components/rank/Rank';
import FaceRecognition from './components/faceRecognition/FaceRecog';
import SignIn from './components/signIn/SignIn';
import Register from './components/register/Register';
//import Particles from 'react-tsparticles';
import Clarifai from 'clarifai';



// const particlesOptions = {
//   "particles": {
//     "number": {
//       "value": 50
//     },
//     "size": {
//       "value": 3
//     }
//   },
//   "interactivity": {
//     "events": {
//       "onhover": {
//         "enable": true,
//         "mode": "repulse"
//       }
//     }
//   }
// }


const app = new Clarifai.App({
  apiKey: 'd5b45b04daf14b128cb8106f8688a1a3'
});



class App extends Component {

  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = JSON.parse(data, null, 2).outputs[0].data.regions[0]
      .region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height),
    };
  }

  displayFaceBox = (box) => {
    this.setState({ box: box })
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onSubmit = () => {
    console.log('click');
    this.setState({ imageUrl: this.state.input })
    // app.model.predict("a403429f2ddf4b49b307e318f00e528b", "htps://samples.clarifai.com/")
    const raw = JSON.stringify({
      user_app_id: {
        user_id: "u2rce7hm32b9",
        //app_id: "d5b45b04daf14b128cb8106f8688a1a3"
        app_id: "c602f82c3a1c459e8ac365e3cd050738"
      },
      inputs: [
        {
          data: {
            image: {
              url: this.state.input
            },
          },
        },
      ],
    });

    fetch(
      "https://api.clarifai.com/v2/models/a403429f2ddf4b49b307e318f00e528b/outputs",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: "a3a4e63f013044e4846600e400465d07",
        },
        body: raw,
      }
    )
      .then((response) => response.text())
      .then((response) => {
        if (response) {
          fetch('YOUR LOCAL HOST', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            });
        }
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch((error) => console.log('error', error));
  }

  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState({isSignedIn: false})
    } else if(route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }


  render() {
    return (
      <div className="App">
        {/* <Particles params={particlesOptions} /> */}
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        {this.state.route === 'home'
          ? <div>
              <Logo />
              <Rank />
              <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit} />
              <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
            </div>
          : ( this.state.route === 'signin'
            ? <SignIn onRouteChange={this.onRouteChange} />
            : <Register onRouteChange={this.onRouteChange} />
          )
        }
      </div>
    );
  }

}


export default App;
