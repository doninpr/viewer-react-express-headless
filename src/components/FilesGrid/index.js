import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  FormControl,
  MenuItem,
  Select,
  Paper,
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  IconButton,
  Checkbox,
} from '@material-ui/core';
import { Launch } from '@material-ui/icons';
import moment from 'moment';
import 'moment/locale/ru';
import {useDispatch, useSelector} from "react-redux";
import { setSelectedFile as setSelected } from "../../actions/projectsActions";

moment.locale('ru');

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 64,
  },
}));

function FilesGrid({ files }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selected = useSelector(state => state.projects.selectedFiles);

  if(files.length === 0){
    return null;
  }

  const handleClick = (file) => {
    dispatch(setSelected(file));
  };

  const isSelected = (id) => !!selected[id];

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox"></TableCell>
            <TableCell>Имя</TableCell>
            <TableCell align="right">Обновлен</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map((file, index) => {
            const isItemSelected = isSelected(file.id);
            const labelId = `enhanced-table-checkbox-${index}`;

            return (
            <TableRow
              hover
              onClick={() => handleClick(file)}
              role="checkbox"
              aria-checked={isItemSelected}
              tabIndex={-1}
              selected={isItemSelected}
              key={file.id}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  checked={isItemSelected}
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </TableCell>
              <TableCell>{file.attributes.displayName}</TableCell>
              <TableCell align="right">
                {moment(file.attributes.lastModifiedTime).format('MMMM Do YYYY, h:mm:ss a')}
              </TableCell>
              <TableCell>
                <IconButton size="small" href={file.links.webView.href} target="_blank">
                  <Launch />
                </IconButton>
              </TableCell>
            </TableRow>
          );})}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default FilesGrid;
