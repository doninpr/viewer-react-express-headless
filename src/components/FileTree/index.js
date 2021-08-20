import React from "react";
import {CircularProgress, Collapse, List, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import FolderIcon from "@material-ui/icons/Folder";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import {makeStyles} from "@material-ui/core/styles";
import FilesGrid from "../FilesGrid";

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
}));

function FileTree({ files, filesTree, nested, fetchFolder }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState({});

  const handleClick = (key) => {
    setOpen({
      ...open,
      [key]: !open[key],
    });
    fetchFolder(files[key]);
  };

  if(!files){
    return (
      <div className={(nested ? classes.nested : '')}>
        <CircularProgress size={14} />
        <span className={classes.caption}>Загрузка файлов...</span>
      </div>
    );
  }

  return (
    <>
      <List className={(nested ? [classes.nested, classes.list].join(' ') : classes.list)}>
        {Object.values(files).map((file, key) => (
          <React.Fragment key={key}>
            {file.type === "folders" &&
              <>
                <ListItem button onClick={() => handleClick(file.id)}>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText primary={file.attributes.displayName} />
                  {open[file.id] ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open[file.id]} timeout="auto" unmountOnExit className={classes.nestedBorder}>
                  <FileTree files={filesTree[file.id]} filesTree={filesTree} nested fetchFolder={fetchFolder} />
                </Collapse>
              </>
            }
          </React.Fragment>
        ))}
      </List>
      <FilesGrid files={Object.values(files).filter((f) => f.type === "items")} />
    </>
  );
}

export default FileTree;
