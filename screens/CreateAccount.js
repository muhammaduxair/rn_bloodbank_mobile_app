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
import auth from '@react-native-firebase/auth';
import validator from 'validator';

const CreateAccount = ({navigation}) => {
  const [STATE, setSTATE] = useState({
    name: '',
    email: '',
    password: '',
    re_password: '',
    age: undefined,
    bloodGroup: '',
    phone: undefined,
    city: '',
    country: '',
    token: Math.round(Math.random() * 416310352413542132532121),
  });

  const dataGettingHandler = () => {
    if (
      STATE.password === STATE.re_password &&
      STATE.name !== '' &&
      STATE.age !== undefined &&
      STATE.bloodGroup !== '' &&
      STATE.phone !== undefined &&
      STATE.city !== '' &&
      STATE.country !== ''
    ) {
      if (validator.isEmail(STATE.email)) {
        auth()
          .createUserWithEmailAndPassword(STATE.email, STATE.password)
          .then(() => {
            const usersCollection = firestore().collection('Users');
            usersCollection.doc(STATE.email).set(STATE);
            setSTATE({
              name: '',
              email: '',
              password: '',
              re_password: '',
              age: undefined,
              mobile_phone_no: undefined,
              cityname: '',
              countryname: '',
            });
            alert('Your Account Have Been Successfully Created. Please Login');
            navigation.navigate('login');
          })
          .catch((error) => {
            var errorMessage = error.message;
            alert(errorMessage);
          });
      } else {
        alert('Your Email Adress is Badly Formatted');
      }
    } else {
      STATE.password !== STATE.re_password
        ? alert('Your Password is Not Matched')
        : alert('Please Fill Complete Form');
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
            <Text style={styles.text1}>Create Account</Text>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.box2}>
          <View style={[styles.textInputField, {marginTop: 30}]}>
            <Text style={{fontSize: 12, color: '#fff'}}>Enter Full Name</Text>
            <View style={styles.textField}>
              <FontAwesome name="user" color="#fff" size={25} />
              <TextInput
                textContentType="name"
                selectionColor="#fff"
                onChangeText={(e) => setSTATE({...STATE, name: e})}
                value={STATE.name}
                style={styles.inputText}
                returnKeyType="next"
              />
            </View>
          </View>
          <View style={styles.textInputField}>
            <Text style={{fontSize: 12, color: '#fff'}}>
              Enter Email Adress
            </Text>
            <View style={styles.textField}>
              <MaterialIcon name="email" color="#fff" size={25} />
              <TextInput
                textContentType="emailAddress"
                secureTextEntry={true}
                keyboardType="email-address"
                selectionColor="#fff"
                onChangeText={(e) => setSTATE({...STATE, email: e})}
                style={styles.inputText}
                autoCapitalize="none"
                value={STATE.email}
                returnKeyType="next"
              />
            </View>
          </View>
          <View style={styles.textInputField}>
            <Text style={{fontSize: 12, color: '#fff'}}>Enter Password</Text>
            <View style={styles.textField}>
              <Ionicon name="lock-closed" color="#fff" size={23} />
              <TextInput
                textContentType="password"
                secureTextEntry={true}
                style={styles.inputText}
                selectionColor="#fff"
                autoCapitalize="none"
                autoCapitalize="none"
                onChangeText={(e) => setSTATE({...STATE, password: e})}
                value={STATE.password}
                returnKeyType="next"
              />
            </View>
          </View>
          <View style={styles.textInputField}>
            <Text style={{fontSize: 12, color: '#fff'}}>Re-Enter Password</Text>
            <View style={styles.textField}>
              <Ionicon name="lock-closed" color="#fff" size={23} />
              <TextInput
                textContentType="password"
                secureTextEntry={true}
                style={styles.inputText}
                selectionColor="#fff"
                onChangeText={(e) => setSTATE({...STATE, re_password: e})}
                value={STATE.re_password}
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
            <Text style={{fontSize: 12, color: '#fff'}}>
              Enter Mobile Phone No.
            </Text>
            <View style={styles.textField}>
              <FontAwesome name="phone" color="#fff" size={25} />
              <TextInput
                style={styles.inputText}
                selectionColor="#fff"
                keyboardType="phone-pad"
                textContentType="telephoneNumber"
                onChangeText={(e) => setSTATE({...STATE, phone: e})}
                value={STATE.phone}
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
            <Text style={styles.ButtonText}>Create Account</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </>
  );
};
export default CreateAccount;

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
    fontSize: 40,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    color: '#d22325',
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
