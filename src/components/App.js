import React from "react";
import CreateLink from "./CreateLink";
import Header from "./Header";
import LinkList from "./LinkList";
import { AUTH_TOKEN } from './constants';
import Login from "./Login";
import { Switch, Route, BrowserRouter } from "react-router-dom";

const App = () => {
  const [token,setToken] = React.useState('');

  React.useEffect(()=>{
    setToken(localStorage.getItem(AUTH_TOKEN));
  },[token])

  return (
    <BrowserRouter>
      <div className="center w85">
        <Header token={token}/>
        <div className="ph3 pv1 background-gray">
          <Switch>
            <Route exact path="/" component={LinkList} />
            <Route exact path="/create" component={CreateLink} />
            <Route exact path="/login" component={Login} />
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
