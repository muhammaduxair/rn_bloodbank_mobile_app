import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const History = () => {
  // ===============
  // state area
  // ===============
  const [reqList, setReqList] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const yourRes = await AsyncStorage.getItem('YOUR_REQUEST');
        const yourData = JSON.parse(yourRes);
        const acceptedRes = await AsyncStorage.getItem('ACCEPTED_REQUEST');
        const acceptedData = JSON.parse(acceptedRes);

        const filterYourData =
          yourData === null
            ? []
            : yourData.map((v) => {
                delete v.request;
                return {...v, donate: false};
              });
        const filterAccepted =
          acceptedData === null
            ? []
            : acceptedData.map((v) => {
                delete v.accept;
                return {...v, donate: true};
              });
        const concatData = filterYourData.concat(filterAccepted);
        setReqList(concatData);
      })();
    }, []),
  );

  return (
    <>
      <View style={styles.findHeader}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.findHeaderUnderBlock}>
          <Text style={styles.findHeaderHeadText}>Donation History</Text>
          <Text style={styles.findHeaderHeadTitle}>
            check your donation and blood request history
          </Text>
        </View>
      </View>
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
            No History
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
                  ]}>
                  <Text style={styles.donorListButtonText}>
                    {v.donate
                      ? 'you have accepted blood request'
                      : 'you sent blood request'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </>
  );
};
export default History;

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
