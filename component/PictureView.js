import {View, StyleSheet, Text} from 'react-native';
import * as React from 'react';
import { Image } from 'expo-image';


export default function PictureView({imageUrl}){

    console.log("Passed Value : " + imageUrl);

    return (
        <View style={styles.container}>
            <Text> Displaying Taken Images</Text>
           <Image
                style={styles.image}
                source= {imageUrl}
                transition={1000}/>
        </View> 
    )

}

const styles = StyleSheet.create({

  
    container:{
         flex: 1,
         width: '100%',
         position: 'relative', 
    },

    image: {
        flex: 1,
        width: '100%',
        height: '90%',
        backgroundColor: 'black',
        resizeMode: 'cover',

      },

  });