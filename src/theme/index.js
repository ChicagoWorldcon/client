import getMuiTheme from 'material-ui/styles/getMuiTheme'

import './theme.css'
import '../img/bg-chicago-1.jpg'
import '../img/logo.png'

export const orange = '#6abd45';
export const lightBlue = '#3da9d4';
export const darkBlue = '#005383';
export const midGray = '#808080';

export const theme = getMuiTheme({
  fontFamily: '"Open Sans", sans-serif',
  card: {
    titleColor: orange,
    subtitleColor: midGray
  },
  palette: {
    primary1Color: lightBlue,
    primary2Color: darkBlue,
    accent1Color: orange,
    disabledColor: midGray
  },
  textField: {
    errorColor: orange
  }
});
