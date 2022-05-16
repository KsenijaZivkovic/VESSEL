import "./App.sass";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Web3Provider, ModalProvider } from "./contexts";
import { Home, Safe, LoadSafe, CreateSafe } from "./pages";
import { Logo, Navigation, Transactions } from "./components";

const Wrapper = ({ children }) => <div className="App">{children}</div>;

const Sidebar = ({ children }) => (
  <div className="sidebar screen-height is-flex is-flex-direction-column t-0 l-0 py-6">
    {children}
  </div>
);

const Body = () => (
  <div className="body has-background-white-rounded">
    <Transactions />
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/load-safe">
        <LoadSafe />
      </Route>
      <Route exact path="/create-safe">
        <CreateSafe />
      </Route>
      <Route path={["/safe/:address/:tab", "/safe/:address"]}>
        <Safe />
      </Route>
    </Switch>
  </div>
);

function App() {
  return (
    <Web3Provider network={process.env.REACT_APP_FLOW_ENV}>
      <ModalProvider>
        <Router>
          <Wrapper>
            <Sidebar>
              <Logo className="mb-6 px-4" />
              <Navigation />
            </Sidebar>
            <Body />
          </Wrapper>
        </Router>
      </ModalProvider>
    </Web3Provider>
  );
}

export default App;
