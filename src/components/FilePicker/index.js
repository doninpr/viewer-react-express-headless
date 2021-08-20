import React, {useEffect} from 'react';
import {
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {useDispatch, useSelector} from "react-redux";
import {
  setFileVersions,
  setSelectedFile as setSelected,
  selectFileVersion,
  setFilePhases,
  selectPhase,
} from "../../actions/projectsActions";
import moment from "moment";
import { Launch, Delete } from "@material-ui/icons";
import router from "../../routerPaths";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    margin: theme.spacing(2),
  },
  caption: {
    ...theme.typography.caption,
    color: theme.palette.grey[600],
    marginLeft: theme.spacing(0.5),
  },
  buttonWrap: {
    margin: `${theme.spacing(2)}px auto`
  },
}));

function FilePicker() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const files = useSelector(state => state.projects.selectedFiles);
  const authToken = useSelector(state => state.authReducer.authToken);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchOptions = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + authToken
      },
      signal,
    };

    Object.values(files).map(file => {
      if(!file.versions){
        fetch(file.relationships.versions.links.related.href, fetchOptions)
          .then(response => response.json())
          .then(({ data }) => {
            dispatch(setFileVersions({ fileId: file.id, data: data }));
            getPhases(file, data[0]);
          });
      }
    });

    return () => {
      controller.abort();
    }
  }, []);

  function getPhases(file, version) {
    fetch(
      `https://developer.api.autodesk.com/modelderivative/v2/designdata/${version.relationships.derivatives.data.id}/metadata`,
      {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + authToken
        }
      },
    )
      .then(response => response.json())
      .then(({data}) => {
        dispatch(setFilePhases({ fileId: file.id, data: data.metadata }));
      })
  }

  function selectVersion({ file, version }) {
    dispatch(selectFileVersion({ fileId: file.id, version: version }));
    getPhases(file, file.versions[version]);
  }

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12}>
        <Paper spacing={2} className={classes.paper}>
          <Grid xs={12} className={classes.buttonWrap}>
            <Link to={router.projectSelector.path}>
              <Button
                size="small"
                variant="outlined"
                color="primary"
              >← К выбору файлов</Button>
            </Link>
          </Grid>
          <TableContainer component={Paper}>
            <Table className={classes.table} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Имя</TableCell>
                  <TableCell>Версия</TableCell>
                  <TableCell>Стадия</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.values(files).map((file, index) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={file.id}
                    >
                      <TableCell>{file.attributes.displayName}</TableCell>
                      <TableCell>
                        <FormControl className={classes.formControl}>
                          {!file.versions &&
                          <CircularProgress size={14} />
                          }
                          {file.versions &&
                            <Select
                              value={String(file.selectedVersion)}
                              onChange={({target}) => selectVersion({ file, version: target.value })}
                            >
                              {file.versions.map((v, index) => (
                                <MenuItem key={index} value={index}>
                                  №{v.attributes.versionNumber}
                                  <span className={classes.caption}>{moment(v.attributes.lastModifiedTime).format('DD.MM.YY, h:mm')}</span>
                                  <span className={classes.caption}>({(v.attributes.storageSize / 1000000).toFixed(1)} МБ)</span>
                                </MenuItem>
                              ))}
                            </Select>
                          }
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <FormControl className={classes.formControl}>
                          {!file.phases &&
                            <CircularProgress size={14} />
                          }
                          {file.phases &&
                            <Select
                              value={String(file.selectedPhase)}
                              onChange={({target}) => {
                                dispatch(selectPhase({ fileId: file.id, phase: target.value }));
                              }}
                            >

                              {file.phases && file.phases.filter(p => p.role === '3d').map((phase, index) => (
                                <MenuItem key={index} value={index}>
                                  {phase.name}
                                  <span className={classes.caption}>
                                    {String(phase.role).toUpperCase()}
                                  </span>
                                </MenuItem>
                              ))}
                            </Select>
                          }
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" href={file.links.webView.href} target="_blank">
                          <Launch />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          target="_blank"
                          onClick={() => dispatch(setSelected(file))}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Grid xs={12} className={classes.buttonWrap}>
            <Link to={router.mergedModel.path}>
              <Button
                fullWidth
                size="large"
                variant="contained"
                color="primary"
                disabled={Object.keys(files).length === 0}
              >Создать сводную модель</Button>
            </Link>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default FilePicker;
