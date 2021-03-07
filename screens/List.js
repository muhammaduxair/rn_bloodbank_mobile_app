import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useFocusEffect} from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RecievedReq = () => {
  // ===============
  // state area
  // ===============
  const [reqList, setReqList] = useState([]);

  useEffect(() => {
    (async () => {
      const userRes = await AsyncStorage.getItem('USER_DATA');
      const userData = JSON.parse(userRes);

      const db = firestore().collection('Donor_List');
      const res = await db.get();
      const data = res.docs.map((v) => v.data());

      const filterResult = data.filter((val) => {
        return (
          val.location === userData.city.toLowerCase() &&
          val.blood_group === userData.bloodGroup
        );
      });
      const result = filterResult.map((v) => ({...v, accept: false}));
      setReqList(result);
    })();
  }, []);

  useEffect(() => {
    const filterResult = reqList.filter((v) => {
      return v.accept === true;
    });
    (async () => {
      await AsyncStorage.setItem(
        'ACCEPTED_REQUEST',
        JSON.stringify(filterResult),
      );
    })();
  }, [reqList]);

  // ===================
  // function area
  // ===================
  const handleAccept = (i) => {
    setReqList((old) => {
      old[i].accept = true;
      return [...old];
    });
  };

  return (
    <ScrollView
      style={styles.donorListBox}
      showsVerticalScrollIndicator={false}>
      {reqList.length < 1 ? (
        <Text
          style={{
            marginTop: 10,
            fontWeight: 'bold',
            fontSize: 20,
            textAlign: 'center',
          }}>
          Please Wait Now
        </Text>
      ) : (
        reqList.map((v, i) => (
          <View key={i} style={styles.donorList}>
            <View style={styles.donorListHead}>
              <Text style={styles.donorListHeadName}>{v.name}</Text>
              <Text style={styles.donorListHeadGroup}>{v.blood_group}</Text>
            </View>
            <View style={styles.donorListProgress}>
              <View>
                <Text style={styles.donorListProgressTitle}>Date</Text>
                <Text style={styles.donorListProgressText}>12-01-2021</Text>
              </View>
              <View>
                <Text style={styles.donorListProgressTitle}>Time</Text>
                <Text style={styles.donorListProgressText}>08:20 PM</Text>
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
                  {backgroundColor: v.accept ? '#5f5c5c' : '#e01515'},
                ]}
                onPress={() => handleAccept(i)}>
                <FontAwesomeIcon name="check-circle" size={20} color="#fff" />
                <Text style={styles.donorListButtonText}>
                  {v.accept ? 'request accepted' : 'Accept request'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

// ===============
// my request page
// ===============
const MyRequest = () => {
  // ===============
  // state area
  // ===============
  const [reqList, setReqList] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const res = await AsyncStorage.getItem('YOUR_REQUEST');
        const data = JSON.parse(res);
        data === null ? null : setReqList(data);
      })();
    }, []),
  );

  // ===================
  // function area
  // ===================
  const handleAccept = (i) => {
    setReqList((old) => {
      old[i].accept = true;
      return [...old];
    });
  };

  return (
    <ScrollView
      style={styles.donorListBox}
      showsVerticalScrollIndicator={false}>
      {reqList.length < 1 ? (
        <Text
          style={{
            marginTop: 10,
            fontWeight: 'bold',
            fontSize: 20,
            textAlign: 'center',
          }}>
          No Request
        </Text>
      ) : (
        reqList.map((v, i) => (
          <View key={i} style={styles.donorList}>
            <View style={styles.donorListHead}>
              <Text style={styles.donorListHeadName}>{v.name}</Text>
              <Text style={styles.donorListHeadGroup}>{v.blood_group}</Text>
            </View>
            <View style={styles.donorListProgress}>
              <View>
                <Text style={styles.donorListProgressTitle}>Date</Text>
                <Text style={styles.donorListProgressText}>12-01-2021</Text>
              </View>
              <View>
                <Text style={styles.donorListProgressTitle}>Time</Text>
                <Text style={styles.donorListProgressText}>08:20 PM</Text>
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
                  {backgroundColor: '#5f5c5c'},
                ]}
                onPress={() => handleAccept(i)}>
                <MaterialIcon name="info" size={21} color="#fff" />
                <Text style={styles.donorListButtonText}>pending request</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

// =======================
// navigation
// =======================
const Tab = createMaterialTopTabNavigator();
const REQUEST_PAGE = () => {
  return (
    <>
      <View style={styles.findHeader}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.findHeaderUnderBlock}>
          <Text style={styles.findHeaderHeadText}>Request For Blood</Text>
          <Text style={styles.findHeaderHeadTitle}>
            see recieve and your blood request and also ckeck blood status
          </Text>
        </View>
      </View>
      <Tab.Navigator
        initialRouteName="recievedRequest"
        tabBarOptions={{
          activeTintColor: '#e01515',
          labelStyle: {fontWeight: 'bold', fontSize: 16},
          inactiveTintColor: '#c3c5c7',
          indicatorStyle: {backgroundColor: '#e01515'},
        }}>
        <Tab.Screen
          options={{tabBarLabel: 'Received Request'}}
          name="receivedRequest"
          component={RecievedReq}
        />
        <Tab.Screen
          options={{tabBarLabel: 'my request'}}
          name="myRequest"
          component={MyRequest}
        />
      </Tab.Navigator>
    </>
  );
};
export default REQUEST_PAGE;

// ===================
// stylesheet
// ==================
const styles = StyleSheet.create({
  findHeader: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingTop: 5,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingBottom: 5,
  },
  findHeaderUnderBlock: {
    marginLeft: 5,
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
    backgroundColor: '#fff',
  },
  donorList: {
    marginBottom: 20,
    width: '80%',
    marginTop: 10,
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
