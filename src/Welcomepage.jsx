import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';


const style = {
  height: 100,
  width: 100,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block',
};

class Welcomepage extends React.Component{
  render() {
    return (
    <div>
      <MuiThemeProvider muiTheme={getMuiTheme()}>
         <Paper style={style} zDepth={5} circle={true} />
         <text></text>
       </MuiThemeProvider>
    </div>
    );
  }
  };

export default Welcomepage;
