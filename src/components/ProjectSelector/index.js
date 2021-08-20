import React, {useEffect} from 'react';
import {
  CircularProgress,
  Grid,
  Paper,
  Button,
  Typography,
  Snackbar,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import {useDispatch, useSelector} from "react-redux";
import {getProjects, getFiles, setProject} from "../../actions/projectsActions";
import { makeStyles } from '@material-ui/core/styles';
import FileTree from '../FileTree';
import { Link } from "react-router-dom";
import router from "../../routerPaths";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    margin: theme.spacing(2),
  },
  project: {
    margin: theme.spacing(0.5),
  },
  header: {
    marginBottom: theme.spacing(2),
  },
  backButtonWrap: {
    textAlign: 'end'
  },
  logoWrapper: {
    margin: theme.spacing(2),
    textAlign: 'center',
    '& img': {
      maxWidth: '100%',
    }
  },
  createModelButton: {
    marginLeft: theme.spacing(2),
  },
  alert: {
    textAlign: "center",
  },
}));

function ProjectSelector() {
  const classes = useStyles();
  const authToken = useSelector(state => state.authReducer.authToken);
  const dispatch = useDispatch();
  const projects = useSelector(state => state.projects.projects);
  const selectedFiles = useSelector(state => state.projects.selectedFiles);
  const files = useSelector(state => state.projects.files);
  const selectedProject = useSelector(state => state.projects.selectedProject);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if(authToken !== null){
      const fetchOptions = {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + authToken
        },
        signal,
      };

      fetch('https://developer.api.autodesk.com/project/v1/hubs', fetchOptions)
        .then(response => response.json())
        .then(data => {
          fetch(data.data[0].relationships.projects.links.related.href, fetchOptions)
            .then(response => response.json())
            .then(data => {
              dispatch(getProjects(data));
            });
        });
    }

    return () => {
      controller.abort();
    }
  }, [authToken]);

  function fetchFolderByName(data, name) {
    const folder = data.find((folder) => folder.attributes.name === name);
    if(folder){
      return fetchFolder(folder);
    }
  }

  function fetchFolder(folder) {
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + authToken
      },
    };

    return fetch(folder.relationships.contents.links.related.href, fetchOptions)
      .then(response => response.json())
  }

  function fetchAllFolders(folders) {
    folders.map(folder => {
      if(folder.relationships.contents){
        fetchFolder(folder).then(({ data }) => {
          data.map((file) => {
            dispatch(getFiles({ parent: folder.id, file: file }));
          });
          fetchAllFolders(data);
        });
      }
    });
  }

  function selectProject(project) {
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + authToken
      },
    };

    dispatch(setProject(project));

    fetch(project.relationships.topFolders.links.related.href, fetchOptions)
      .then(response => response.json())
      .then(({ data }) => {
        fetchFolderByName(data,"Project Files")
          .then(({ data }) => {
            fetchFolderByName(data,"Стадия П")
              .then(({ data }) => {
                data.map(folder => {
                  dispatch(getFiles({ parent: 'root', file: folder }));
                });
                //fetchAllFolders(data);
              });
          });
      });
  }

  return (
    <Grid container justifyContent="center">
      {selectedProject === null &&
        <Grid item xs={12}>
          <Paper spacing={2} className={classes.paper}>
            <Typography variant={"h5"} className={classes.header}>Выберите проект</Typography>
            <Grid container justifyContent="center">
              {projects === null &&
              <CircularProgress />
              }
              {projects !== null &&
              projects.map((project, key) => (
                <Grid key={key} item xs={12} className={classes.project}>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    onClick={() => selectProject(project)}
                  >{project.attributes.name}</Button>
                </Grid>
              ))
              }
            </Grid>
          </Paper>
        </Grid>
      }
      {selectedProject !== null &&
        <Grid item xs={12}>
          <Paper spacing={2} className={classes.paper}>
            <Grid container>
              <Grid item xs={8}>
                <Typography variant={"subtitle1"} className={classes.header}>{selectedProject.attributes.name}</Typography>
              </Grid>
              <Grid item xs={4} className={classes.backButtonWrap}>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => dispatch(setProject(null))}
                >← Выбрать другой проект</Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      }
      {selectedProject !== null &&
        <Grid item xs={12}>
          <Paper spacing={2} className={classes.paper}>
            <Grid container>
              <FileTree
                files={files.root}
                filesTree={files}
                fetchFolder={(folder) => {
                  fetchFolder(folder).then(({ data }) => {
                    data.map((file) => {
                      dispatch(getFiles({ parent: folder.id, file: file }));
                    });
                  });
                }}
              />
            </Grid>
          </Paper>
        </Grid>
      }

      {selectedFiles && Object.keys(selectedFiles).length > 0 &&
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={true}
        >
          <Alert severity="info" className={classes.alert}>
            Выбрано файлов: {Object.keys(selectedFiles).length}
            <Link to={router.filePicker.path}>
              <Button
                color="primary"
                variant="contained"
                size="small"
                className={classes.createModelButton}
              >Создать сводную модель</Button>
            </Link>
          </Alert>
        </Snackbar>
      }
    </Grid>
  );
}

export default ProjectSelector;
