import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import * as React from 'react';


export default function CustomButton({title, onPress, icon, color}){

    return(
      <View style={styles.wrapper}>
        
        <TouchableOpacity style={styles.button} onPress={onPress}>
        
        <Icon name={icon} size={30} color="white" />
        <Text style={styles.text}>{title}</Text>
        
      </TouchableOpacity>

      </View>
 
    )

}


const styles = StyleSheet.create({

  
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 25,
    
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    
  },
  wrapper: {
    margin: 2, 
    flex: 1,
    flexDirection: 'row',
    
  }
  });