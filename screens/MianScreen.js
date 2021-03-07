// import items
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector, useDispatch} from 'react-redux';
import {createStackNavigator} from '@react-navigation/stack';
import {useFocusEffect} from '@react-navigation/native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';

// ================
// HomeScreen
// ================
const Home = ({navigation}) => {
  const Dispatch = useDispatch();
  // ==============
  // state
  // =============
  const [bloodData, setBloodData] = useState([
    {type: 'A+', select: false},
    {type: 'A-', select: false},
    {type: 'B+', select: false},
    {type: 'B-', select: false},
    {type: 'AB+', select: false},
    {type: 'AB-', select: false},
    {type: 'O+', select: false},
    {type: 'O-', select: false},
  ]);
  const [cities, setCities] = useState([
    {name: 'karachi'},
    {name: 'hyderabad'},
    {name: 'sukkur'},
    {name: 'multan'},
    {name: 'faisalabad'},
    {name: 'lahore'},
    {name: 'rawalpindi'},
    {name: 'islamabad'},
    {name: 'peshawar'},
    {name: 'mardan'},
    {name: 'quetta'},
    {name: 'abbotabad'},
    {name: 'gwadar'},
    {name: 'kashmir'},
    {name: 'hunza'},
  ]);
  const [cityMap, setCityMap] = useState([]);
  const [cityTextInput, setCityTextInput] = useState();
  const [bloodFindDetails, setBloodFindDetails] = useState({
    bloodGroup: undefined,
    location: undefined,
  });

  useEffect(() => {
    (async () => {
      const res = await AsyncStorage.getItem('USER_DATA');
      const data = JSON.parse(res);
      Dispatch({type: 'USER_DATA', payload: data});
    })();
  }, []);

  // ================
  // function area
  // ===============
  const handleSelect = (i) => {
    setBloodData((old) => {
      old.map((v) => (v.select = false));
      return [...old];
    });
    setBloodData((old) => {
      old[i].select = old[i].select ? false : true;
      setBloodFindDetails({...bloodFindDetails, bloodGroup: old[i].type});
      return [...old];
    });
  };
  const searchCity = (e) => {
    setCityTextInput(e);
    const result = cities.filter((val) => {
      return val.name.includes(e);
    });
    setCityMap(result);
  };
  const selectCity = (i) => {
    const data = cityMap[i].name;
    setCityTextInput(data);
    setBloodFindDetails({...bloodFindDetails, location: data});
    setCityMap([]);
  };
  const searchDonors = () => {
    if (
      bloodFindDetails.bloodGroup !== undefined &&
      bloodFindDetails.location !== undefined
    ) {
      Dispatch({type: 'BLOODFIND_DETAILS', payload: bloodFindDetails});
      navigation.navigate('mainFind');
    } else {
      alert('Please Provide Complete Details');
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#d22325" />
      {/* header area */}
      <View style={styles.header}>
        <Text style={styles.headerText}>mobile blood Bank</Text>
      </View>

      {/* bottom area */}
      <ScrollView
        style={styles.BottomArea}
        showsVerticalScrollIndicator={false}>
        {/* heading */}
        <View style={styles.HeadingBar}>
          <Text style={styles.HeadingText}>Find Donors</Text>
          <Text style={styles.HeadingTitle}>
            search for blood donors around your city
          </Text>
        </View>

        {/* table area */}
        <View style={styles.bloodGroupTable}>
          <View style={styles.bloodGroupHeader}>
            <Text style={styles.bloodGroupHeaderText}>Select Blood Groups</Text>
          </View>
          <View style={styles.bloodGroupRow}>
            {bloodData.map((v, i) => (
              <Text
                key={i}
                style={[
                  styles.bloodGroupText,
                  {backgroundColor: v.select ? '#d22325' : '#bdb8b8'},
                ]}
                onPress={() => handleSelect(i)}>
                {v.type}
              </Text>
            ))}
          </View>
        </View>

        {/* location */}
        <View style={styles.location}>
          <Text style={styles.bloodGroupHeaderText}>Select Location</Text>
          <TextInput
            style={styles.searchLocation}
            placeholder="Enter City Name"
            placeholderTextColor="#696464"
            onChangeText={searchCity}
            value={cityTextInput}
            autoCapitalize="none"
            selectionColor="#696464"
          />
          {cityMap.map((v, i) => (
            <Text
              key={i}
              style={styles.citiesList}
              onPress={() => selectCity(i)}>
              {v.name}
            </Text>
          ))}
        </View>
        <TouchableOpacity style={styles.mainBttnCap} onPress={searchDonors}>
          <Text style={styles.mainBttnText}>Search Donors</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// ==============
// find screen
// ==============
const Find = ({navigation}) => {
  const REDUX_STATE = useSelector((state) => state);
  const findBlood = REDUX_STATE.findBlood;
  const Dispatch = useDispatch();
  // ===============
  // state area
  // ===============
  const [donorList, setDonorList] = useState([]);
  const [reqlist, setReqList] = useState([]);
  const [statusClr, setStatusClr] = useState('#fff');

  useFocusEffect(
    React.useCallback(() => {
      setStatusClr('#fff');
      (async () => {
        const res = await AsyncStorage.getItem('YOUR_REQUEST');
        const data = JSON.parse(res);
        data === null ? null : setReqList(data);
      })();
    }, []),
  );

  useEffect(() => {
    if (reqlist.length < 1) {
      null;
    } else {
      (async () => {
        await AsyncStorage.setItem('YOUR_REQUEST', JSON.stringify(reqlist));
      })();
    }
  }, [reqlist]);

  useEffect(() => {
    (async () => {
      try {
        const db = firestore().collection('Donor_List');
        const fireStoreData = await db.get();
        const res = fireStoreData.docs.map((v) => v.data());
        const data = res.filter((val) => {
          return (
            val.location === findBlood.location &&
            val.blood_group === findBlood.bloodGroup
          );
        });
        const dataWithReq = data.map((v) => {
          return {...v, request: false};
        });
        setDonorList(dataWithReq);
        Dispatch({type: 'DONOR_LIST', payload: data});
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  // ===================
  // function area
  // ===================
  const requestBlood = (i) => {
    setDonorList((old) => {
      old[i].request = true;
      return [...old];
    });
    // reqlist.push(donorList[i]);
    setReqList(
      donorList.length < 1 ? [donorList[i]] : [...reqlist, donorList[i]],
    );
  };
  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={statusClr} />
      <View style={styles.findHeader}>
        <IonIcon
          name="arrow-back"
          size={30}
          onPress={() => navigation.navigate('mainHome')}
        />
        <View style={styles.findHeaderUnderBlock}>
          <Text style={styles.findHeaderHeadText}>Donor List</Text>
          <Text style={styles.findHeaderHeadTitle}>
            found {donorList.length} donors with {findBlood.bloodGroup} blood
            group in your location
          </Text>
        </View>
      </View>
      <ScrollView
        style={styles.donorListBox}
        showsVerticalScrollIndicator={false}>
        {donorList.length < 1 ? (
          <Text style={{textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>
            There are currently no donors in this city. Please search in your
            nearest town
          </Text>
        ) : (
          donorList.map((v, i) => (
            <View key={i} style={styles.donorList}>
              <View style={styles.donorListHead}>
                <Text style={styles.donorListHeadName}>{v.name}</Text>
                <Text style={styles.donorListHeadGroup}>{v.blood_group}</Text>
              </View>
              <View style={styles.donorListProgress}>
                <View>
                  <Text style={styles.donorListProgressTitle}>
                    total donation
                  </Text>
                  <Text style={styles.donorListProgressText}>
                    {v.total_donation}
                  </Text>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                  <Text style={styles.donorListProgressTitle}>location</Text>
                  <Text style={styles.donorListProgressText}>{v.location}</Text>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  activeOpacity={1}
                  style={[
                    styles.donorListButtonCap,
                    {backgroundColor: v.request ? '#5f5c5c' : '#e01515'},
                  ]}
                  onPress={() => requestBlood(i)}>
                  <FontAwesomeIcon name="user" size={20} color="#fff" />
                  <Text style={styles.donorListButtonText}>
                    {v.request
                      ? 'your request has been sent'
                      : 'request for blood'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

// ================
// stylesheet
// ================
const styles = StyleSheet.create({
  root: {backgroundColor: '#fff', flex: 1},
  header: {
    backgroundColor: '#d22325',
    paddingTop: 15,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  BottomArea: {
    padding: 5,
  },
  HeadingBar: {
    paddingVertical: 15,
    paddingHorizontal: 5,
  },
  HeadingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#d22325',
  },
  HeadingTitle: {
    color: '#949090e3',
    textTransform: 'capitalize',
  },
  mainBttnCap: {
    backgroundColor: '#d22325',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 2,
    marginVertical: 10,
    marginHorizontal: 5,
  },
  mainBttnText: {
    color: '#fff',
    textTransform: 'capitalize',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  bloodGroupTable: {
    padding: 5,
  },
  bloodGroupHeader: {
    paddingTop: 12,
  },
  bloodGroupHeaderText: {
    fontSize: 18,
    color: '#312f2f',
    fontWeight: 'bold',
  },
  bloodGroupRow: {
    flexDirection: 'row',
    paddingTop: 5,
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  bloodGroupText: {
    width: '24%',
    borderRadius: 7,
    paddingVertical: 10,
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlignVertical: 'center',
    marginBottom: 5,
  },
  location: {
    marginVertical: 15,
    paddingHorizontal: 5,
  },
  searchLocation: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderColor: '#e8e4e4',
    backgroundColor: '#fff',
    borderWidth: 3,
    borderRadius: 5,
    fontSize: 16,
    marginTop: 5,
  },
  citiesList: {
    marginTop: 5,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#e8e4e4',
    textTransform: 'capitalize',
  },
  // ===============
  // find page arae
  // ===============
  findHeader: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingTop: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  findHeaderUnderBlock: {
    marginLeft: 10,
  },
  findHeaderHeadText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  findHeaderHeadTitle: {
    fontSize: 11,
    color: '#5f5c5c',
  },
  donorListBox: {
    paddingHorizontal: 15,
  },
  donorList: {
    marginBottom: 30,
    width: '80%',
  },
  donorListHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  donorListHeadName: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  donorListHeadGroup: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#f1bdbd',
    color: '#e01515',
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  donorListProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  donorListProgressText: {
    fontSize: 15,
    textTransform: 'capitalize',
  },
  donorListProgressTitle: {
    fontSize: 12,
    color: '#5f5c5c',
    textTransform: 'capitalize',
  },
  donorListButtonCap: {
    flexDirection: 'row',
    backgroundColor: '#e01515',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 3,
    justifyContent: 'center',
  },
  donorListButtonText: {
    textTransform: 'capitalize',
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 5,
  },
});

// ===============
// navigation
// ===============
const Stack = createStackNavigator();
const MainScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="mainHome">
      <Stack.Screen name="mainHome" component={Home} />
      <Stack.Screen name="mainFind" component={Find} />
    </Stack.Navigator>
  );
};
export default MainScreen;
