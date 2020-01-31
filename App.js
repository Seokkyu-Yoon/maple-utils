/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Picker,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Sound from 'react-native-sound';

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'orange',
  },
  seperator: {
    height: 2,
    backgroundColor: 'limegreen',
  },
  pickerSong: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: 'cornsilk',
  },
  alarmsHolderGuide: {
    flex: 1,
    paddingVertical: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: 'cornsilk',
  },
  alarmsHolder: {
    paddingHorizontal: 5,
  },
  alarmHolder: {
    borderRadius: 5,
    marginVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeHolder: {
    flex: 1,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonHolder: {
    flexDirection: 'row',
  },
  button: {
    height: 40,
    width: 60,
    marginRight: 5,
    paddingVertical: 2,
    paddingHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  buttonStart: {
    backgroundColor: 'green',
  },
  buttonRemove: {
    backgroundColor: 'red',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bgAlarmItem: {
    justifyContent: 'space-between',
    backgroundColor: 'deepskyblue',
  },
  alarmTime: {
    textAlign: 'right',
  },
  bgAlarmAdd: {
    justifyContent: 'center',
    backgroundColor: 'limegreen',
  },
  addAlarmText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 30,
  },
});

const DEFAULT_ALARM = {
  timer: null,
  hour: 0,
  min: 15,
  sec: 0,
};

const songs = [];
const addSong = (file, label) => songs.push({file, label});
addSong('currbgm.mp3', '메이플 배경음악(구)');
addSong('pastbgm.mp3', '메이플 배경음악(현)');

const playSound = ({song}) => {
  const sound = new Sound(song, Sound.MAIN_BUNDLE, err => {
    if (err) {
      console.warn(`${song} is undefined`);
      return null;
    }
    sound.play(success => {
      if (!success) {
        console.warn(`${song} isn't music file`);
        return null;
      }
    });
  });
  return sound;
};

const oneSecLater = time => {
  let {hour, min, sec} = time;

  sec -= 1;
  if (sec === -1) {
    sec = 59;
    min -= 1;
  }
  if (min === -1) {
    min = 59;
    hour -= 1;
  }
  if (hour === -1) {
    hour = 0;
    min = 0;
    sec = 0;
  }
  return {hour, min, sec};
};

class SongPicker extends React.Component {
  render() {
    return (
      <View style={styles.pickerSong}>
        <Picker
          selectedValue={this.props.song}
          onValueChange={this.props.onValueChange}>
          {songs.map((song, index) => (
            <Picker.Item key={`${index}`} label={song.label} value={index} />
          ))}
        </Picker>
      </View>
    );
  }
}
class AddAlarm extends React.Component {
  render() {
    return (
      <TouchableOpacity
        style={[styles.alarmHolder, styles.bgAlarmAdd]}
        activeOpacity={0.8}
        onPress={this.props.onPress}>
        <Text style={styles.addAlarmText}>+</Text>
      </TouchableOpacity>
    );
  }
}
class Alarm extends React.Component {
  render() {
    const MAX_MIN = 60;
    const MAX_SEC = 60;
    const {data, index, update, remove} = this.props;

    return (
      <View style={[styles.alarmHolder, styles.bgAlarmItem]}>
        <View style={styles.timeHolder}>
          <TextInput
            style={styles.alarmTime}
            keyboardType="numeric"
            maxLength={2}
            onChangeText={text => {
              const hour = text.replace(/[^0-9]/g, '');
              update(index, {hour});
            }}
            onBlur={() => {
              const hour = Number(data.hour);
              update(index, {hour});
            }}>
            {data.hour}
          </TextInput>
          <Text>시간</Text>
          <TextInput
            style={styles.alarmTime}
            keyboardType="numeric"
            maxLength={2}
            onChangeText={text => {
              const min = text.replace(/[^0-9]/g, '');
              update(index, {min});
            }}
            onBlur={() => {
              const num = Number(data.min);
              const min = num < MAX_MIN ? num : MAX_MIN - 1;
              update(index, {min});
            }}>
            {data.min}
          </TextInput>
          <Text>분</Text>
          <TextInput
            style={styles.alarmTime}
            keyboardType="numeric"
            maxLength={2}
            onChangeText={text => {
              const sec = text.replace(/[^0-9]/g, '');
              update(index, {sec});
            }}
            onBlur={() => {
              const num = Number(data.min);
              const min = num < MAX_SEC ? num : MAX_SEC - 1;
              update(index, {min});
            }}>
            {data.sec}
          </TextInput>
          <Text>초</Text>
        </View>
        <View style={styles.buttonHolder}>
          <TouchableOpacity
            style={[styles.button, styles.buttonStart]}
            onPress={() => console.log(data)}
            activeOpacity={0.8}>
            <Text style={styles.buttonText}>시작</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonRemove]}
            onPress={() => remove(index)}
            activeOpacity={0.8}>
            <Text style={styles.buttonText}>삭제</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
class Alarms extends React.Component {
  render() {
    const {alarms, update, remove} = this.props;
    if (!alarms.length) {
      return <View />;
    }
    return alarms.map((data, index) => {
      return (
        <Alarm
          key={`${index}`}
          index={index}
          data={data}
          update={update}
          remove={remove}
        />
      );
    });
  }
}

export default class App extends React.Component {
  state = {
    song: 0,
    sound: null,
    alarming: 0,
    alarms: [],
  };

  setSong = song => {
    this.setState({song});
  };
  addAlarm = () => {
    const {
      state: {alarms},
    } = this;

    this.setState({
      alarms: [...alarms, DEFAULT_ALARM],
    });
  };
  updateAlarm = (index, data) => {
    const {
      state: {alarms},
    } = this;

    const alarm = alarms[index];
    const fixedAlarm = Object.assign({}, alarm, data);

    this.setState({
      alarms: [
        ...alarms.slice(0, index),
        fixedAlarm,
        ...alarms.slice(index + 1),
      ],
    });
  };
  removeAlarm = index => {
    const {
      state: {alarms},
    } = this;

    const currAlarm = alarms[index];
    if (currAlarm.timer) {
      clearInterval(currAlarm.timer);
    }

    this.setState({
      alarms: [...alarms.slice(0, index), ...alarms.slice(index + 1)],
    });
  };
  render() {
    const {
      updateAlarm,
      removeAlarm,
      state: {song, alarms},
    } = this;

    return (
      <View style={styles.body}>
        <SongPicker song={song} onValueChange={this.setSong} />
        <View style={styles.seperator} />
        <View style={styles.alarmsHolderGuide}>
          <ScrollView style={styles.alarmsHolder}>
            <Alarms alarms={alarms} update={updateAlarm} remove={removeAlarm} />
            <AddAlarm onPress={this.addAlarm} />
          </ScrollView>
        </View>
      </View>
    );
  }
}
