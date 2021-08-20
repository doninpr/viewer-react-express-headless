import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import {setModelCollection, setModelStructure} from "../../actions/modelActions";
import {Button, FormControlLabel, Grid, Paper, Switch} from "@material-ui/core";
import {Link} from "react-router-dom";
import router from "../../routerPaths";
import PropertiesTree from "../PropertiesTree";
import { getPropsTreeData } from "../functions";

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

function MergedModel() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const files = useSelector(state => state.projects.selectedFiles);
  const models = useSelector(state => state.models.collections);
  const authToken = useSelector(state => state.authReducer.authToken);
  const [isGroupByFile, setGroupByFile] = React.useState(true);

  const handleChangeGroup = (event) => {
    setGroupByFile(event.target.checked);
  };

  function fetchProps({ file, signal }) {
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + authToken
      },
      signal,
    };

    const metadataUrl = `https://developer.api.autodesk.com/modelderivative/v2/designdata/` +
      `${file.versions[file.selectedVersion].relationships.derivatives.data.id}/metadata/` +
      `${file.phases[file.selectedPhase].guid}`;

    fetch(
      metadataUrl + `?forceget=true`,
      fetchOptions
    )
      .then(response => {
        if(response.status === 202){
          setTimeout(() => {
            fetchProps({ file, signal });
          }, 1500);

        }
        return response.json();
      })
      .then(({ data }) => {
        if(data && data.objects){
          dispatch(setModelStructure({ file, structure: data.objects }));
        }
      });

    fetch(
      metadataUrl + '/properties?forceget=true',
      fetchOptions
    )
      .then(response => {
        if(response.status === 202){
          setTimeout(() => {
            fetchProps({ file, signal });
          }, 1500);

        }
        return response.json();
      })
      .then(({ data }) => {
        if(data && data.collection){
          const collection = [];
          data.collection.forEach(obj => {
            if(obj.name.match(/.*\s\[\d*\]/) !== null){
              const newObj = {
                externalId: obj.externalId,
                objectId: obj.objectid,
                name: obj.name,
                properties: {
                  "Размеры": obj.properties["Размеры"],
                  "Идентификация": {
                    ...obj.properties["Идентификация"],
                    "Категория": obj.name.split(/\[\d*\]/)[0].trim(),
                  },
                  "Данные": obj.properties["Данные"],
                }
              };
              collection.push(newObj);
            }
          });
          dispatch(setModelCollection({ file, collection }));
        }
      });
  }

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    Object.values(files).map(file => {
      if(!!file.versions && !!file.phases){
        fetchProps({ file, signal });
      }
    });

    return () => {
      controller.abort();
    }
  }, []);

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12}>
        <Paper spacing={2} className={classes.paper}>
          <Grid xs={12} className={classes.buttonWrap}>
            <Link to={router.filePicker.path}>
              <Button
                size="small"
                variant="outlined"
                color="primary"
              >← К выбору файлов</Button>
            </Link>
          </Grid>
          <Grid xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={isGroupByFile}
                  onChange={handleChangeGroup}
                  name="isGroupByFile"
                  color="primary"
                />
              }
              label="Группировка по файлам"
            />
            {models &&
              <PropertiesTree
                properties={getPropsTreeData((isGroupByFile ? Object.values(models).map((m) => ({
                  group: files[m.fileId].attributes.displayName,
                  objects: m.collection,
                })) : [{
                  group: 'Все файлы',
                  objects: [].concat(...Object.values(models).map((m) => m.collection)),
                }]))}
              />
            }
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default MergedModel;
