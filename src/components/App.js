import React, {useEffect} from 'react';
import ProjectSelector from './ProjectSelector';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import 'font-awesome/css/font-awesome.css';
import Client from './Client';
import {useDispatch} from "react-redux";
import { getAuthToken } from "../actions/authActions";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import logoImg from "./logo.png";
import {Grid} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import FilePicker from "./FilePicker";
import MergedModel from "./MergedModel";
import router from "../routerPaths";

var getToken = { accessToken: Client.getaccesstoken()};

const useStyles = makeStyles((theme) => ({
  logoWrapper: {
    margin: theme.spacing(2),
    textAlign: 'center',
    '& img': {
      maxWidth: '100%',
    }
  },
}));

function App() {
  const classes = useStyles();
  const dispatch = useDispatch();
  useEffect(() => {
    getToken.accessToken.then(({ access_token }) => {
      dispatch(getAuthToken({ authToken: access_token }));
    });
  }, []);

  return (
    <div>
      <Switch>
        <Route exact path={router.mergedModel.path}>
          <MergedModel />
        </Route>
        <Route exact path={router.filePicker.path}>
          <FilePicker />
        </Route>
        <Route exact path={router.projectSelector.path}>
          <ProjectSelector />
        </Route>
      </Switch>
      <Grid xs={12} className={classes.logoWrapper}>
        <img src={logoImg} />
      </Grid>
    </div>
  );
}

export default App;
