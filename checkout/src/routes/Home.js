import React, { Component } from 'react'
import logo from './logo.png'
import './Home.css'
import { connect } from 'react-redux'
import cognitoUtils from '../lib/cognitoUtils'
import Login from './Login/Login'

const mapStateToProps = state => {
  return { session: state.session }
}

class Home extends Component {
  onSignOut = (e) => {
    e.preventDefault()
    cognitoUtils.signOutCognitoSession()
  }

  render () {
    return (
      <div className="Home">
        {this.props.session.isLoggedIn ? <Login session = {this.props.session} /> : <header className="Home-header">
          <h3>San Luis Obispo Juvenile Hall Checkout App</h3>
          <img style = {{height: '25%', width: '25%'}} src={logo} alt="logo" />
          { this.props.session.isLoggedIn ? (
            <div>
              <p>You are logged in as user {this.props.session.user.userName} ({this.props.session.user.email}).</p>
              <p></p>
              <div>
                <div>API status: {this.state.apiStatus}</div>
                <div className="Home-api-response">{this.state.apiResponse}</div>
              </div>
              <p></p>
              <a className="Home-link" href="#" onClick={this.onSignOut}>Sign out</a>
            </div>
          ) : (
            <div>
              <p>You are not logged in.</p>
              <a className="Home-link" href={cognitoUtils.getCognitoSignInUri()}>Sign in </a>
            </div>
          )}
        </header>
        }
      </div>
    )
  }
}

export default connect(mapStateToProps)(Home)
