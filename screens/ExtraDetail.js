import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  StatusBar,
  ScrollView,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector, useDispatch} from 'react-redux';

const ExtraDetail = ({navigation}) => {
  const [STATE, setSTATE] = useState({
    age: '',
    phone: '',
    city: '',
    country: '',
    bloodGroup: '',
  });
  const mapState = useSelector((state) => state.USER_DATA);
  const Dispatch = useDispatch();

  useEffect(() => {
    setSTATE(mapState);
  }, []);

  const dataGettingHandler = () => {
    if (
      STATE.age !== '' &&
      STATE.phone !== '' &&
      STATE.city !== '' &&
      STATE.country !== '' &&
      STATE.bloodGroup !== ''
    ) {
      (async () => {
        await AsyncStorage.setItem('USER_DATA', JSON.stringify(STATE));
      })();
      firestore().collection('Users').doc(STATE.email).set(STATE);
      Dispatch({type: 'USER_DATA', payload: STATE});
      navigation.replace('home');
    }
  };

  return (
    <>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.root}>
        <View style={styles.box1}>
          <View>
            <Ionicon
              name="arrow-back-sharp"
              size={30}
              color="#d22325"
              onPress={() => navigation.navigate('login')}
            />
            <Text style={styles.text1}>Please Provide This Details</Text>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.box2}>
          <View style={[styles.textInputField, {marginTop: 30}]}>
            <Text style={{fontSize: 12, color: '#fff'}}>
              Enter Phone Number
            </Text>
            <View style={styles.textField}>
              <FontAwesome name="phone" color="#fff" size={25} />
              <TextInput
                keyboardType="phone-pad"
                selectionColor="#fff"
                onChangeText={(e) => setSTATE({...STATE, phone: e})}
                value={STATE.phone}
                style={styles.inputText}
                returnKeyType="next"
              />
            </View>
          </View>
          <View style={styles.textInputField}>
            <Text style={{fontSize: 12, color: '#fff'}}>Enter Your Age</Text>
            <View style={styles.textField}>
              <FontAwesome name="user" color="#fff" size={23} />
              <TextInput
                style={styles.inputText}
                selectionColor="#fff"
                keyboardType="numeric"
                onChangeText={(e) => setSTATE({...STATE, age: e})}
                value={STATE.age}
                returnKeyType="next"
              />
            </View>
          </View>
          <View style={styles.textInputField}>
            <Text style={{fontSize: 12, color: '#fff'}}>
              Enter Blood Group ( With add sign '+' or '-' )
            </Text>
            <View style={styles.textField}>
              <Ionicon name="water" color="#fff" size={23} />
              <TextInput
                style={styles.inputText}
                selectionColor="#fff"
                keyboardType="default"
                onChangeText={(e) => setSTATE({...STATE, bloodGroup: e})}
                value={STATE.bloodGroup}
                returnKeyType="next"
              />
            </View>
          </View>
          <View style={styles.textInputField}>
            <Text style={{fontSize: 12, color: '#fff'}}>Enter City Name</Text>
            <View style={styles.textField}>
              <MaterialIcon name="location-city" color="#fff" size={23} />
              <TextInput
                style={styles.inputText}
                selectionColor="#fff"
                textContentType="addressCity"
                onChangeText={(e) => setSTATE({...STATE, city: e})}
                value={STATE.city}
                returnKeyType="next"
              />
            </View>
          </View>
          <View style={styles.textInputField}>
            <Text style={{fontSize: 12, color: '#fff'}}>
              Enter Country Name
            </Text>
            <View style={styles.textField}>
              <MaterialIcon name="location-city" color="#fff" size={23} />
              <TextInput
                style={styles.inputText}
                selectionColor="#fff"
                textContentType="countryName"
                onChangeText={(e) => setSTATE({...STATE, country: e})}
                value={STATE.country}
                returnKeyType="done"
              />
            </View>
          </View>
          <TouchableOpacity
            style={styles.ButtonCap}
            onPress={dataGettingHandler}>
            <Text style={styles.ButtonText}>Sign up</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </>
  );
};
export default ExtraDetail;

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#fff',
    flex: 1,
  },
  box1: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 20,
  },
  box2: {
    backgroundColor: '#d22325',
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    paddingHorizontal: 12,
  },
  text1: {
    fontSize: 36,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    color: '#d22325',
    textAlign: 'center',
  },
  textInputField: {
    marginBottom: 15,
  },
  textField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#fff',
    borderBottomWidth: 2,
    padding: 0,
  },
  inputText: {
    width: '90%',
    color: '#fff',
    fontSize: 18,
    padding: 3,
    marginLeft: 10,
  },
  ButtonCap: {
    width: '100%',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
  },
  ButtonText: {
    color: '#d22325',
    textTransform: 'capitalize',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
