import { StyleSheet } from 'react-native';
import { THEME } from '../../themes';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
  },  
  containerSearch:{
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  list:{
    width: '100%',
    marginTop:15,
    paddingTop:20,
  },
  modal:{
    width:'80%',
    height: '80%',
    position: 'absolute',
    zIndex: 1000
  }
});