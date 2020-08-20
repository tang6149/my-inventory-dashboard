import React from 'react';
import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

class SimpleTable extends React.Component {
// export default function SimpleTable() {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  componentDidMount() {
    fetch("http://localhost:8983/solr/inventory/select?fl=*%20%5Bchild%20childFilter%3Dips%2Fip%3A*%5D&q=%7B!parent%20which%3D%22hostname%3A*%22%7Dip%3A*")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            // items: result.items
            items: result.response.docs
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {

    const classes = makeStyles({
      table: {
        minWidth: 650,
      },
    });
    
    const { error, isLoaded, items } = this.state;
    
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Project</TableCell>
                <TableCell align="right">Owner</TableCell>
                <TableCell align="right">Location</TableCell>
                <TableCell align="right">Room</TableCell>
                <TableCell align="right">Hostname</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell component="th" scope="row">
                    {item.project}
                  </TableCell>
                  <TableCell align="right">{item.owner}</TableCell>
                  <TableCell align="right">{item.location}</TableCell>
                  <TableCell align="right">{item.room}</TableCell>
                  <TableCell align="right">{item.hostname}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }

  }
}

ReactDOM.render(
  <SimpleTable />,
  document.getElementById('root')
);
