import React, { Component} from 'react';
import { Switch, Route, Redirect, Link, BrowserRouter as Router } from "react-router-dom";
import './App.css';
import Login from './components/Login';
import Home from './components/Home';
import Dashboard from './components/Dashboard'

import Context from "./Context";

import axios from 'axios';
import jwt_decode from 'jwt-decode';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      currentTime: null,
      redirect: null,
    };
    this.routerRef = React.createRef();
  }

  /*const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    fetch('/api/time').then(res => res.json()).then(data => {
      setCurrentTime(data.time);
    });
  }, []);*/

  componentDidMount() {
    let user = localStorage.getItem("user");
    let currentTime = fetch('/api/time').then(res => res.json());
    //let currentTime = localStorage.getItem("currentTime");
    user = user ? JSON.parse(user) : null;

    //currentTime = currentTime ? fetch('/api/time').then(res => res.json()) : null;
    this.setState({ user , currentTime});
    localStorage.setItem("currentTime", JSON.stringify(currentTime));
  }

  /*setCurrentTime = async () => {
    const { currentTime } = fetch('/api/time');
  }*/

  login = async (email, password) => {
    const res = await axios.post(
      '/api/login',
      { email, password },
    ).catch((res) => {
      return { status: 401, message: 'Unauthorized' }
    })

    if(res.status === 200) {
      let email = jwt_decode(res.data.access_token).identity;
      const user = {
        email,
        token: res.data.accessToken
      }

      this.setState({ user });
      localStorage.setItem("user", JSON.stringify(user));
      return true;
    } else {
      return false;
    }
  }

  logout = e => {
    this.setState({ redirect: "/" });
    e.preventDefault();
    this.setState({ user: null });
    localStorage.removeItem("user");
    return <Redirect to={this.state.redirect} />
  };

  render() {
    return (
      <Context.Provider
        value={{
          ...this.state,
          home: this.home,
          login: this.login,
          dashboard: this.dashboard
        }}
      >
        <Router ref={this.routerRef}>
        <div className="App">
          <nav
            className="navbar container"
            role="navigation"
            aria-label="main navigation"
          >
            <div className="navbar-brand">
              <b className="navbar-item is-size-4 ">React flask App {this.currentTime}</b>
              <label
                role="button"
                className="navbar-burger burger"
                aria-label="menu"
                aria-expanded="false"
                data-target="navbarBasicExample"
                onClick={e => {
                  e.preventDefault();
                  this.setState({ showMenu: !this.state.showMenu });
                }}
              >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
              </label>
            </div>
              <div className={`navbar-menu ${
                  this.state.showMenu ? "is-active" : ""
                }`}>
                <Link to="/" className="navbar-item">
                  Home
                </Link>
                {this.state.user && (
                  <Link to="/dashboard" className="navbar-item">
                    Dashboard
                  </Link>
                )}
                {!this.state.user ? (
                  <Link to="/login" className="navbar-item">
                    Login
                  </Link>
                ) : (
                  <Link to="/" onClick={this.logout} className="navbar-item">
                    Logout
                  </Link>
                )}
              </div>
            </nav>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/dashboard" component={Dashboard} />
            </Switch>
          </div>
        </Router>
      </Context.Provider>
    );
  }
}
