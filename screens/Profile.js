import React from 'react';
import {View, Text, StatusBar, StyleSheet, Switch} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Material from 'react-native-vector-icons/MaterialIcons';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

const Profile = ({navigation}) => {
  const [isDonateSwitch, setDonateSwitch] = React.useState(true);
  const [isNotificationSwitch, setNotificationSwitch] = React.useState(false);
  const [donation, setDonation] = React.useState([]);
  const [STATE, setSTATE] = React.useState({});

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const res = await AsyncStorage.getItem('ACCEPTED_REQUEST');
        const data = JSON.parse(res);
        data === null ? null : setDonation(data);

        const userRes = await AsyncStorage.getItem('USER_DATA');
        const userData = JSON.parse(userRes);
        setSTATE(userData);
      })();
    }, []),
  );

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([
        'ACCEPTED_REQUEST',
        'USER_DATA',
        'YOUR_REQUEST',
      ]);
      navigation.replace('login');
    } catch (error) {
      alert(error);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.findHeader}>
        <View style={styles.findHeaderUnderBlock}>
          <Text style={styles.findHeaderHeadText}>Profile</Text>
          <Text style={styles.findHeaderHeadTitle}>
            From here, you can edit your profile and make it your own
          </Text>
        </View>
      </View>
      <View style={styles.profileBody}>
        <View style={styles.donorList}>
          <View style={styles.donorListHead}>
            <Text style={styles.donorListHeadName}>{STATE.name}</Text>
            <Text style={styles.donorListHeadGroup}>{STATE.bloodGroup}</Text>
          </View>
          <View style={styles.donorListProgress}>
            <View>
              <Text style={styles.donorListProgressTitle}>Total Donation</Text>
              <Text style={styles.donorListProgressText}>
                {donation.length}
              </Text>
            </View>
            <View>
              <Text style={styles.donorListProgressTitle}>Last Donation</Text>
              <Text style={styles.donorListProgressText}>-- -- --</Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={styles.donorListProgressTitle}>location</Text>
              <Text style={styles.donorListProgressText}>{STATE.city}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.buttonBox}>
        <View style={styles.buttons}>
          <View style={{flexDirection: 'row'}}>
            <IonIcon name="heart-outline" size={25} color="#e01515" />
            <Text style={styles.buttonsText}>I Want to Donate</Text>
          </View>
          <Switch
            value={isDonateSwitch}
            onValueChange={(e) => setDonateSwitch(e)}
            trackColor={{true: '#f1bdbd', false: '#d8cfcf'}}
            thumbColor={isDonateSwitch ? '#e01515' : '#fff'}
          />
        </View>
        <View style={styles.buttons}>
          <View style={{flexDirection: 'row'}}>
            <FontAwesome name="bell-o" size={25} color="#dcc91d" />
            <Text style={styles.buttonsText}>Notification</Text>
          </View>
          <Switch
            value={isNotificationSwitch}
            onValueChange={(e) => setNotificationSwitch(e)}
            trackColor={{true: '#f1bdbd', false: '#d8cfcf'}}
            thumbColor={isNotificationSwitch ? '#e01515' : '#fff'}
          />
        </View>
        <View style={styles.buttons}>
          <View style={{flexDirection: 'row'}}>
            <IonIcon
              name="information-circle-outline"
              size={25}
              color="#bd66cc"
            />
            <Text style={styles.buttonsText}>About</Text>
          </View>
        </View>
        <View style={styles.buttons}>
          <View style={{flexDirection: 'row'}}>
            <Material name="security" size={25} color="#e01515" />
            <Text style={styles.buttonsText}>Privacy Policy</Text>
          </View>
        </View>
        <View style={styles.buttons}>
          <View style={{flexDirection: 'row'}}>
            <IonIcon name="settings-outline" size={25} color="#b9b6b9" />
            <Text style={styles.buttonsText}>Setting</Text>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={logout}>
          <View style={styles.buttons}>
            <View style={{flexDirection: 'row'}}>
              <Material
                name="logout"
                size={25}
                color="#5f5c5c"
                style={{marginLeft: 3}}
              />
              <Text style={styles.buttonsText}>Logout</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};
export default Profile;

const styles = StyleSheet.create({
  root: {backgroundColor: '#fff', flex: 1},
  findHeader: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingTop: 5,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingBottom: 10,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
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
  profileBody: {
    paddingVertical: 15,
    backgroundColor: '#e01515',
  },
  donorList: {
    width: '80%',
    alignSelf: 'center',
  },
  donorListHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  donorListHeadName: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    color: '#fff',
  },
  donorListHeadGroup: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#fff',
    color: '#e01515',
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  donorListProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  donorListProgressText: {
    fontSize: 15,
    textTransform: 'capitalize',
    color: '#fff',
    fontWeight: 'bold',
  },
  donorListProgressTitle: {
    fontSize: 12,
    color: '#fff',
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
  borderBox: {borderColor: 'lightgray', padding: 5, borderWidth: 1},
  buttonBox: {
    paddingHorizontal: 5,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    borderBottomColor: 'lightgray',
    borderTopColor: 'lightgray',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  buttonsText: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginLeft: 10,
  },
});
