import React, { Component } from 'react';
import Navigation from './components/nav/Navigation';
import './App.css';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imageLink/ImageLinkForm';
import Rank from './components/rank/Rank';
import FaceRecognition from './components/faceRecognition/FaceRecog';
import SignIn from './components/signIn/SignIn';
import Register from './components/register/Register';
import Particles from 'react-tsparticles';
import Clarifai from 'clarifai';



const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}



const app = new Clarifai.App({
  apiKey: 'd5b45b04daf14b128cb8106f8688a1a3'
});

const initialState = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user:{
            id: '',
            name: '',
            email: '',
            entries: 0,
            joined: ''
      }
}


class App extends Component {

  constructor() {
    super();
    this.state = initialState;
  }

  componentDidMount(){
    fetch('http://localhost:3000')
    .then(response => response.json())
    .then(console.log)
  }

  loadUser = (data) => {
    this.setState({user: {
            id: data.id,
            name: data.name,
            email: data.email,
            entries: data.entries,
            joined: data.jined
  }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
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
      // .then((response) => response.text())
      .then(response => {
        console.log('hi', response)
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            }).catch(console.log)
        }
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch((error) => console.log('error', error));
  }

  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState(initialState)
    } else if(route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }


  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
         <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home'
          ? <div>
              <Logo />
              <Rank
                name={this.state.user.name}
                entries={this.state.user.entries}
              />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onSubmit={this.onSubmit}
              />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
          : (
             route === 'signin'
             ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
             : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }

}


export default App;
