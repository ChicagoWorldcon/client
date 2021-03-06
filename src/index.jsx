import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { browserHistory, hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { createStore } from 'redux'

import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin();

import './lib/polyfills'

import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import middleware from './middleware'
import reducers from './reducers'
import AppRouter from './router'
import { theme } from './theme'

const history = ENV === 'production' ? browserHistory : hashHistory;
const store = createStore(reducers, middleware(history));

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-66635432-3', 'auto');
history.listen(({ pathname }) => {
  if (pathname.indexOf('/login') !== -1) pathname = '/login';
  ga('set', 'page', pathname);
  ga('send', 'pageview');
});

ReactDOM.render(
  <Provider store={store} >
    <MuiThemeProvider muiTheme={theme}>
      <AppRouter history={syncHistoryWithStore(history, store)} />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('react')
)
