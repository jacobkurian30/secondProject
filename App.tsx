/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View, ActivityIndicator
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {  Platform, TouchableOpacity, Button,Alert } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import CustomButton from './component/CustomButton'; 

import PictureView from './component/PictureView';
import { Image } from 'expo-image';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import { Camera, useCameraPermission, useCameraDevice, useCameraDevices, CameraDevice,getCameraDevice, } from 'react-native-vision-camera';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import ImageCropPicker from 'react-native-image-crop-picker';



import { request, PERMISSIONS, RESULTS , check, requestMultiple, openSettings} from 'react-native-permissions';


function App(): React.JSX.Element {

  const { hasPermission, requestPermission } = useCameraPermission();



  const[hasCameraPermission, setHasCameraPermission] = useState(null);
  const[image, setImage] = useState<string>();
  const[message, setMessage] = useState('Test 234');
  const[count, setCount] = useState(0);
  const[isCameraVisible, setIsCameraVisible]= useState(true);
  const[isImageTaken, setIsImageTaken]= useState(false);
  const[content, setContent] = useState();
  const camera = useRef<Camera>(null)
  const [isLoading, setIsLoading] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const device = useCameraDevice('back', {
    physicalDevices: [
      'ultra-wide-angle-camera',
      'wide-angle-camera',
      'telephoto-camera'
    ]
  });




  const requestMediaLibraryPermission = async () => {
      
    try {
      const permissions =
      Platform.OS === 'android'
      ? [
          PERMISSIONS.ANDROID.CAMERA,
        ]
      : [
          PERMISSIONS.IOS.PHOTO_LIBRARY,
          PERMISSIONS.IOS.CAMERA,
        ];

      console.log(permissions);

      const statuses = await requestMultiple(permissions);

      for (const [permission, status] of Object.entries(statuses)) {
        
        switch (status) {
          case RESULTS.UNAVAILABLE:
            console.log(`${permission} is not available on this device.`);
            break;
          case RESULTS.DENIED:
            console.log(`${permission} was denied.`);
            break;
    
          case RESULTS.GRANTED:
            console.log(`${permission} is granted.`);
            setPermissionGranted(true);
            break;
         
          default:
            console.log(`Unhandled status for ${permission}: ${status}`);
        }
      }
    } catch (error) {
      console.error("Error requesting permission:", error);
    }
  };

  useEffect(() => {


    // Call the async function
    setTimeout(() => requestMediaLibraryPermission(), 1000);

    
    
    if(device){
      setIsLoading(false);
    }

    console.log("~~~~~~~  Count:");
    console.log("useEffect camera status");
  }, [camera, device, isLoading, permissionGranted, image]);

  

  async function readContentFromPicture(image: string){

    try {
    console.log("Reading content from image.." + image );

    const data = await TextRecognition.recognize(image);

    console.log("Text " + data.text);
    console.log("Text: " + JSON.stringify(data, null, 2));

    setContent(data);

    } catch(e) {

      console.log(e);
      
    }
  }


  if (isLoading) {
    return <View style={styles.loadingScreen}>
    <ActivityIndicator size="large" color="#ffffff" style={styles.spinner} />
    <Text style={styles.loadingScreenContent}>Loading camera...</Text>
  </View>;
  }
  if (!permissionGranted) {
    return <Text>Waiting for camera permissions...</Text>;
  }


  async function takePicture(){
     var imageUrl: string;

    try {
      const photo =  await camera.current?.takePhoto({flash: "off", enableShutterSound: true});
      setImage(photo.uri);
      console.log(photo.path);

      const savedUri = await CameraRoll.save(`file://${photo.path}`, {
      type: 'photo',
    })

      console.log("saved URL : "+ savedUri);
      setImage(savedUri);
      readContentFromPicture(savedUri);

    //console.log(photo);
    } catch(e){
      console.error(e);
    }


  }

  function test(){}

  const cropImage = async (imagePath: string) => {
    console.log("Image Path " + imagePath);
    try {
      const croppedImage = await ImageCropPicker.openCropper(
      {
        path: imagePath,
        width: 300,  // Desired width
        height: 300, // Desired height
        cropping: true,
      }
    );
      console.log('Cropped Image:', croppedImage);
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };


  const cameraProps = {
    device: device,
    isActive: true,
    preview: true,
    enableZoomGesture: true
  };


  return (
    <View style={styles.container}>
    <Camera style={styles.camera}
      ref={camera}
      {...cameraProps} 
      photo={true}> </Camera>

        <View style={styles.buttonContainer}>
          <CustomButton title={'camera'} onPress={takePicture} icon={"camera"} color={'white'}/>
          <CustomButton title={'flip'} onPress={() => cropImage(image)} icon={"camera-flip"} color={'white'}/>
        </View>
       
        </View>
  );
}



const styles = StyleSheet.create({

  loadingScreen:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#195677',
    width: '100%'

  },
  spinner: {
    marginBottom: 20, // Add some space between the spinner and text
  },
  loadingScreenContent:{
    fontSize: 18,
    color: '#ffffff', // White text for better visibility
    textAlign: 'center',
    fontWeight: 'bold'

  },
//100 percentage of layout.
  container:{

    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent:'center'

  },

  pictureContainer: {
    flex: 1,
    width: '100%',
  
    height: '100%',
    position: 'relative'

  },

  overlayButton: {
    backgroundColor: 'black',
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 25,
  },

  overlayContainer: {
    position: 'absolute',
    bottom: 0, // Anchor to the bottom of the screen
    width: '100%', // Full width of the screen
    flexDirection: 'row', // Buttons aligned in a row
    justifyContent: 'center', // Center the buttons horizontally
    alignItems: 'center', // Center items within the container
    padding: 20, // Add padding for better spacing
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: Add semi-transparent background for visibility

  },



pictureButtonText: {
  fontSize: 15,
  fontWeight: 'bold',
  color: 'white',

},


  camera: {
    flex: 1,
    width: '100%'
  },

  buttonContainer: {
    position: 'absolute', // Allows precise positioning
    bottom: 20,          // Distance from the bottom of the screen
    left: 0,             // Align to the left edge of the screen
    right: 0,            // Align to the right edge of the screen
    flexDirection: 'row', // Arrange buttons in a row
    justifyContent: 'space-evenly', // Even spacing between buttons
    alignItems: 'center', // Center buttons vertically
    paddingHorizontal: 20, // Optional padding on the sides

  },

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
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    
  },
 
  image: {
    flex: 1,
    width: '50%',
    backgroundColor: '#0553',
  },
});


export default App;
