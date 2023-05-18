import MapView, { Callout, Marker } from "react-native-maps"
import { StyleSheet, View, Text, Button, Alert, Share } from 'react-native';
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default function App() {

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [pin, setPin] = useState(null);

  //Share location
  const handleShareLocation = async (location) => {
    try {
      const result = await Share.share({
        message:
          `https://maps.google.com/?q=${location.latitude},${location.longitude}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  //Get current location
  useEffect(() => {
    (async () => {

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      setPin(location.coords);
    })();
  }, []);

  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    console.log(location);
  }

  return (
    <View style={styles.container}>
      {(location && pin) && (
        <>
          <View style={styles.searchContainer}>
            <GooglePlacesAutocomplete
              styles={{ textInput: styles.input }}
              placeholder='Search'
              fetchDetails={true}
              GooglePlacesSearchQuery={{
                rankby: "distance"
              }}
              onPress={(data, details = null) => {
                // 'details' is provided when fetchDetails = true
                console.log(data, details);

                setLocation({
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng
                })

              }}
              query={{
                key: 'AIzaSyBoY7DUpiaflstQ-ano-_9l4ZZa3FP5dXU',
                language: 'en',
                types: "establishment",
                components: "country:us",
                radius: 30000,
                location: `${location.longitude}, ${location.longitude}`
              }}
            />
          </View>

          <MapView
            style={styles.map}
            provider='google'
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            >
              <Callout onPress={() => handleShareLocation(location)}>
                <Button
                  title="Compartir ubicación"
                />
              </Callout>
              
            </Marker>

            <Marker
              coordinate={{
                latitude: pin.latitude,
                longitude: pin.longitude
              }}
              pinColor="black"
              draggable={true}
              onDragStart={(e) => {
                console.log("Drag start", e.nativeEvent.coordinate);
              }}
              onDragEnd={(e) => {
                setPin({
                  latitude: e.nativeEvent.coordinate.latitude,
                  longitude: e.nativeEvent.coordinate.longitude
                });
              }}
            >
              <Callout onPress={() => handleShareLocation(pin)}>
                <Button
                  title="Compartir ubicación"
                />
              </Callout>

            </Marker>

          </MapView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: '100%',
    height: '100%',
  },
  searchContainer: {
    position: "absolute",
    width: "90%",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    padding: 8,
    zIndex: 1,
    borderRadius: 8,
    top: 45,
  },
  input: {
    borderColor: "#888",
    borderWidth: 1,
  },
});