import React from 'react';
import {
  BrowserRouter as Router, Link, Route, Switch
} from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import GamePage from './pages/GamePage/GamePage';
import LobbyPage from './pages/LobbyPage/LobbyPage';
import MainPage from './pages/MainPage/MainPage';
import Results from './pages/Results/Results';
import './sass/style.scss';

export default function App() {
  return (<div className="page-wrapper">
              <Header />
              {/* <nav style={{ margin: '0 auto', display: 'flex', 'justify-content': 'center' }}>
                <ul>
                  <li>
                    <Link to="/">Main</Link>
                  </li>
                  <li>
                    <Link to="/game">game</Link>
                  </li>
                  <li>
                    <Link to="/lobby">lobby</Link>
                  </li>
                </ul>
              </nav> */}

              {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
              <Router>
              <Switch>
              <Route path="/" exact>
                  <MainPage />
                </Route>
                <Route path="/game">
                  <GamePage />
                </Route>
                <Route path="/lobby">
                  <LobbyPage />
                </Route>
                <Route path="/results">
                  <Results />
                </Route>
              </Switch>
          </Router>
          <Footer />
            </div>
  );
}
