import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import {GoogleSignin} from '@react-native-community/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {useDispatch} from 'react-redux';

const Login = ({navigation}) => {
  const [STATE, setSTATE] = useState({email: '', password: ''});
  const [cnd, setCnd] = useState(false);
  const Dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      // user
      const userRes = await AsyncStorage.getItem('USER_DATA');
      const userData = await JSON.parse(userRes);
      // condition
      if (userData == null) {
        setCnd(true);
      } else {
        const fb_userData = await firestore()
          .collection('Users')
          .doc(userData.email)
          .get();
        if (userData.token === fb_userData.data().token) {
          navigation.replace('home');
        } else {
          setCnd(true);
        }
      }
    })();
    GoogleSignin.configure({
      webClientId:
        '128621639945-5ru35l7opgd4osovcr84gdefsh0uo8uj.apps.googleusercontent.com',
    });
  }, []);

  const loginCheker = () => {
    auth()
      .signInWithEmailAndPassword(STATE.email, STATE.password)
      .then(() => {
        (async () => {
          const db = firestore().collection('Users');
          const res = await db.doc(STATE.email).get();
          Dispatch({type: 'USER_DATA', payload: res.data()});
          await AsyncStorage.setItem('USER_DATA', JSON.stringify(res.data()));
        })();
        setSTATE({email: '', password: ''});
        navigation.replace('home');
      })
      .catch((error) => {
        alert('your login details is incorrect please enter correct details');
      });
  };

  const facebookLogin = async () => {
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);
    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      throw 'Something went wrong obtaining access token';
    }
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );
    auth()
      .signInWithCredential(facebookCredential)
      .then((res) => {
        const TJ = Math.round(Math.random() * 416310352413542132532121);
        const token = `checkertoken856966${TJ}`;
        const data = {
          name: res.user.displayName,
          email: res.user.email,
          photo: res.user.photoURL,
          phone: '',
          age: '',
          city: '',
          country: '',
          token: token,
        };
        Dispatch({type: 'USER_DATA', payload: data});
        navigation.replace('extradetail');
      })
      .catch((err) => console.log(err));
  };

  if (!cnd) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}>
        <StatusBar barStyle="light-content" backgroundColor="#fff" />
        <ActivityIndicator size="large" color="#d22325" />
      </View>
    );
  }
  return (
    <>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.root}>
        <View style={styles.box1}>
          <Text style={styles.box1Text}>wellcome</Text>
          <Text style={styles.box1Text2}>mobile blood bank</Text>
        </View>
        <View style={styles.box2}>
          <Text style={styles.text1}>Login</Text>
          <View style={{width: '100%', marginBottom: 15}}>
            <View style={styles.textInputField}>
              <Text style={{fontSize: 12, color: '#fff'}}>
                Enter Email Adress
              </Text>
              <View style={styles.textField}>
                <MaterialIcon name="email" color="#fff" size={25} />
                <TextInput
                  textContentType="emailAddress"
                  keyboardType="email-address"
                  selectionColor="#fff"
                  onChangeText={(e) => setSTATE({...STATE, email: e})}
                  value={STATE.email}
                  autoCapitalize="none"
                  style={{
                    width: '80%',
                    color: '#fff',
                    fontSize: 18,
                    padding: 3,
                  }}
                />
                <Ionicon name="checkmark-circle" size={25} color="#fff" />
              </View>
            </View>
            <View style={styles.textInputField}>
              <Text style={{fontSize: 12, color: '#fff'}}>Enter Password</Text>
              <View style={styles.textField}>
                <Ionicon name="lock-closed" color="#fff" size={23} />
                <TextInput
                  secureTextEntry={true}
                  textContentType="password"
                  style={styles.textInputField}
                  selectionColor="#fff"
                  onChangeText={(e) => setSTATE({...STATE, password: e})}
                  autoCapitalize="none"
                  value={STATE.password}
                  style={{
                    width: '80%',
                    color: '#fff',
                    fontSize: 18,
                    padding: 3,
                  }}
                />
                <Ionicon name="checkmark-circle" size={25} color="#fff" />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    textTransform: 'capitalize',
                    color: '#fff',
                    textDecorationLine: 'underline',
                    fontWeight: 'bold',
                  }}>
                  forgot password!
                </Text>
                <Text
                  style={{
                    textTransform: 'capitalize',
                    color: '#fff',
                    textDecorationLine: 'underline',
                    fontWeight: 'bold',
                  }}
                  onPress={() => navigation.navigate('create-account')}>
                  create account
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.ButtonCap} onPress={loginCheker}>
            <Text style={styles.ButtonText}>Login</Text>
          </TouchableOpacity>
          <Text style={{color: '#fff', fontWeight: 'bold'}}>
            -----OR------- Login With Other.
          </Text>
          <View
            style={{
              marginTop: 15,
              alignItems: 'center',
              width: '100%',
            }}>
            <TouchableOpacity
              style={{
                paddingVertical: 10,
                width: '100%',
                borderRadius: 10,
                backgroundColor: '#fff',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={facebookLogin}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: '#4267B2',
                  marginLeft: 5,
                }}>
                Facebook
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};
export default Login;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  box1: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  box1Text: {
    fontSize: 50,
    color: '#d22325',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  box1Text2: {
    color: '#d22325',
    fontSize: 30,
    textTransform: 'capitalize',
    fontWeight: 'bold',
  },
  box2: {
    alignItems: 'center',
    backgroundColor: '#d22325',
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    paddingHorizontal: 15,
    paddingVertical: 15,
    flex: 1,
  },
  text1: {
    fontSize: 40,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#fff',
    marginBottom: 20,
  },
  textInputField: {
    marginBottom: 15,
  },
  textField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#fff',
    borderBottomWidth: 2,
    padding: 0,
  },
  ButtonCap: {
    width: '100%',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
  },
  ButtonText: {
    color: '#d22325',
    textTransform: 'capitalize',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
