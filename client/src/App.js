import React, { Suspense } from 'react';
import './App.css';
import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';
import Auth from './hoc/auth';
import MovieDetail from './components/views/MovieDetail/MovieDetail';
import { Switch,Route} from "react-router-dom";

function App() {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
        <div style={{paddingTop: '69px', minHeight: 'calc(100vh-80px)'}}>
          <Switch>
            <Route exact path="/" component={Auth(LandingPage, false)} />
            <Route exact path="/login" component={Auth(LoginPage, false)} />
            <Route exact path="/register" component={Auth(RegisterPage, false)} />
            <Route exact path="/movie/:movieId" component={Auth(MovieDetail, null)} />
          </Switch>
        </div>
    </Suspense>
  )
}

export default App;
