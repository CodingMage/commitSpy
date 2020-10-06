import React from 'react';
import './Styles/style.css';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Login from './Components/Login';
import CreateUser from './Components/CreateUser';
import Home from './Components/Home';
import Wellcome from './Components/Wellcome'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import ForgetPass from './Components/ForgetPass';
import VerifyPass from './Components/VerifyPass';
import Usertest from './Components/Usertest';


function App() {
  return (
    <div className="app">
      <Router>
        <Switch>

          <Route exact path="/" component={Wellcome} />


          <Route path='/login'>
            <CreateUser />

          </Route>

          <Route path='/signin'>
            <Login />

          </Route>

          <Route path='/forgetpass' component={ForgetPass} />
          <Route path='/verifypass' component={VerifyPass} />
          <Route path='/user' component={Usertest} />

          <Route path="/home" component={Home} />


        </Switch>
      </Router>

      {/* <CreateUser /> */}


    </div>
  );
}

export default App;
