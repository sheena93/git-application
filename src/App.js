import React, { Component } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Paper from 'material-ui/Paper';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import axios from 'axios';
import RaisedButton from 'material-ui/RaisedButton';
import ActionAndroid from 'material-ui/svg-icons/action/android';
import FontIcon from 'material-ui/FontIcon';
import usersListInfo from './response';
import oauth from './oauth';
import {styles,paperstyle,cardstyle} from './constants';
import CircularProgress from 'material-ui/CircularProgress';


// TODO For loading animation
const CircularProgressSection = ({size,thickness}) => (
  <div>
    <CircularProgress size={size} thickness={thickness} />
  </div>
);


// Creating dynamic Tiles for github users
class Tile extends Component{

  constructor(props){
    super(props);
    this.state = {
      followers_count:-1,
      name: '',
    };
  }

  componentDidMount(){
    let username = this.props.login;
    let url = `https://api.github.com/users/${username}?access_token=${oauth}`;
    axios.get(url).
    then((res)=>{
      console.log(res);
      this.setState(
        {
          followers_count:res.data.followers,
          name: res.data.name,
        })
    }).
    catch((err)=>{
      console.log(err);
    });
  }

  render(){
    let followersCount = this.state.followers_count === -1 ? '...' :  this.state.followers_count ;
    let name= this.state.name;
    const props = this.props;
    return (
      <Card style={cardstyle}>
        <CardHeader
          title={name}
          subtitle={props.login}
          avatar={props.avatar_url}
        />
        <CardTitle title={followersCount} />
      </Card>
    );
  }
}

// Application UI rendering

 class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
        value: 'a',
        page:1,
        usersList:[],
      };
    }

  handleChange = (value) => {
    this.setState({
      value: value,
    });
  };

  updateUsersList=(usersList)=>{

    this.setState((prevState)=>{
      const newState = Object.assign({},prevState);
      newState.usersList = [...prevState.usersList,...usersList];
      return newState;
    },()=>{
      console.log("updated");
    });
  }

  getUsersList=()=>{
    let url = `https://api.github.com/search/users?q=+location:india+language:javascript&page=${this.state.page}&sort=followers&per_page=12`;
    return axios.get(url).
    then((res)=>{
      this.updateUsersList(res.data.items)
    }).
    catch((err)=>{console.log(err)});
  }

  // componentDidUpdate(){
  //   if(this.state.value=='b'){
  //     this.getUsersList();
  //   }
  // }

  loadMoreUser=()=>{
    this.setState((prevState)=>{
      return {page:prevState.page+1};
    },this.getUsersList)
  }

  render() {
    return (
      <div className="App">
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            >
           <Tab label="Home" value="a">
             <div>
               <h2 style={styles.headline}>Welcome to AmbitionBox</h2>
               <p>
                 <Paper style={paperstyle} zDepth={5} rounded={false} />
               </p>
             </div>
           </Tab>
           <Tab
             label="Git Users"
             value="b"
             onActive={this.getUsersList}
             >
             <div>
               {/* <h2 style={styles.headline}>LOADING..</h2> */}
               {
                 this.state.usersList ?
                 this.state.usersList.map((user)=>{
                 return (
                   <Tile
                     name={user.name}
                     avatar_url={user.avatar_url}
                     // user={user.url}
                     login={user.login}
                   />
                 );
               }):<CircularProgressSection size={100} thickness={5}/>
              }
              <Card>
                <CardActions>
                  <RaisedButton
                     target="_blank"
                     label="Load More"
                     secondary={true}
                     style={styles.button}
                     icon={<FontIcon className="muidocs-icon-custom-github" />}
                     onClick={this.loadMoreUser}
                   />
                </CardActions>
              </Card>
             </div>
           </Tab>
         </Tabs>
       </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
