import React, { useState } from 'react';
import {
  Collapse,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  ListSubheader,
  InputLabel,
  FormControl,
} from "@material-ui/core";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import {makeStyles} from "@material-ui/core/styles";
import { getPropsTreeData } from "../functions";
import _ from "lodash";

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
  caption: {
    fontSize: '14px',
    marginLeft: theme.spacing(1),
  },
  list: {
    width: '100%',
    paddingTop: 0,
  },
  nestedBorder: {
    borderLeft: '2px solid #cdcdcd',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

function PropertiesTree({ properties, nested }) {
  const classes = useStyles();
  const [open, setOpen] = useState({});
  const [selectedGroups, setGroup] = useState({});

  const handleClick = (key) => {
    setOpen({
      ...open,
      [key]: !open[key],
    });
  };

  function groupBy(group, key) {
    const groupedObjects = _.groupBy(group.objects, (obj) => {
      const selectedGroup = JSON.parse(selectedGroups[key]);
      if(obj.properties[selectedGroup.key] && obj.properties[selectedGroup.key][selectedGroup.prop]){
        return obj.properties[selectedGroup.key][selectedGroup.prop];
      } else {
        return "Без группы";
      }
    });

    return _.map(groupedObjects, (obj, objKey) => ({
      group: objKey,
      objects: obj,
    }));
  }

  return (
    <>
      <List className={(nested ? [classes.nested, classes.list].join(' ') : classes.list)}>
        {Object.values(properties).map((group, key) => (
          <React.Fragment key={key}>
            {
              <>
                <ListItem button onClick={() => handleClick(key)}>
                  <ListItemText
                    primary={(
                      <div>{group.group} <span className={classes.caption}>{group.objects.length} шт.</span></div>
                    )}
                  />
                  {open[key] ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open[key]} timeout={1} unmountOnExit className={classes.nestedBorder}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="grouped-select">Группировка</InputLabel>
                    <Select
                      id="grouped-select"
                      value={selectedGroups[key] || ""}
                      onChange={({target}) => {
                        setGroup({
                          ...selectedGroups,
                          [key]: target.value
                        })
                      }}
                    >
                      <MenuItem value="">
                        <em>Без группировки</em>
                      </MenuItem>
                      {Object.keys(group.propNames).map((propKey) => {
                        let menuItems = [propKey, ...group.propNames[propKey]];
                        return (
                          menuItems.map((p, index) => {
                            if(index === 0){
                              return (
                                <ListSubheader key={`${propKey}`}>{propKey}</ListSubheader>
                              );
                            } else {
                              return (
                                <MenuItem key={`${propKey} ${index}`} value={JSON.stringify({ key: propKey, prop: p })}>{p}</MenuItem>
                              );
                            }
                          })
                        );
                      })}
                    </Select>
                  </FormControl>
                  {!selectedGroups[key] &&
                    group.objects.map(p => (
                      <ListItem>
                        <ListItemText primary={p.name} />
                      </ListItem>
                    ))
                  }
                  {selectedGroups[key] && (
                    <PropertiesTree
                      nested
                      properties={getPropsTreeData(groupBy(group, key))}
                    />
                  )}
                </Collapse>
              </>
            }
          </React.Fragment>
        ))}
      </List>
    </>
  );
}

export default PropertiesTree;
