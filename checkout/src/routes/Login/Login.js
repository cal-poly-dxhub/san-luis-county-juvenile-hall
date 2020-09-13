 /* eslint-disable */
import React, { useState, useEffect } from 'react'
import Rewards from '../Rewards/Rewards'
import './Login.css';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Home from '../Home';
import cognitoUtils from '../../lib/cognitoUtils'
import AccountCircle from '@material-ui/icons/AccountCircle';

import {
  Link
} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}))

export default function Login (props) {
  const classes = useStyles();
  const [user, setInput] = useState({});
  const [points, setPoints] = useState("");
  const [names, setNames] = useState([]);
  const [showRewards, setVisibility] = useState(false);
  const [errorState, setError] = useState(false);

  const fetchAndLog = async () => {
    var url = "https://65erq8gstf.execute-api.us-west-2.amazonaws.com/prod/fetch/juveniles?event_id=" +  user.event_id;
    var bearer = 'Bearer ' + props.session.credentials.idToken;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
          'Authorization': bearer,
          'Content-Type': 'application/json',
      }
    });
    
    if (response.status === 200) {
      const json = await response.json(); 
      setError(false);
      setPoints(json.points);
      setVisibility(true);
      return json;
    }
    console.log(names, response);
    throw new Error(response.status);
  }

  useEffect(() => {
    var url = "https://65erq8gstf.execute-api.us-west-2.amazonaws.com/prod/fetch/juveniles?active=1";
    var bearer = 'Bearer ' + props.session.credentials.idToken;
    fetch(url, {
      method: 'GET',
      headers: {
          'Authorization': bearer,
          'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(data => setNames(data))
  }, []);

  function handleError() {
    setError(true);
    console.log('Wrong ID');
  }

  function handleRewards(){
    setVisibility(false);
    setPoints(""); 
  }

  const handleSubmit = (e) => {
    if (!user.id) {
      handleError();
      return;
    }
    setVisibility(false);  
    fetchAndLog().catch(handleError);
    e.preventDefault();
  }

  function isSamePerson(id) {
    return function(person) {
      return person.id === id;
    }
  }

  function getUserName(id) {
    var person = names.find(isSamePerson(parseInt(id)));
    return person.first_name + " " + person.last_name;
  }

  function onSignOut(e) {
    e.preventDefault()
    cognitoUtils.signOutCognitoSession()
  }


  return (
    <div>
    {showRewards ? <Rewards userID = {user.id} userTotal = {points} userName = {getUserName(user.id)}
    show = {handleRewards} session = {props.session}/> : 
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <AccountCircle />
        </Avatar>
        <Typography component="h1" variant="h5">
          Select Juvenile
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <Autocomplete
            id="combo-box-demo"
            options={names}
            onChange={(event, newValue) => {
              setInput(newValue);
            }}
            getOptionLabel={option => option.first_name + " " + option.last_name}
            renderInput={params =>  <TextField {...params}
              error = {errorState}
              helperText={errorState ? "Incorrect entry." : ""}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="id"
              label="Youth Name"
              name="id"
              autoFocus
            />}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Select
          </Button>
        </form>
        <Button disableElevation variant="contained" onClick={onSignOut}>Log out</Button>
      </div>
    </Container> }
    </div>
  )
}

