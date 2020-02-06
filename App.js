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
  Animated,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Sound from 'react-native-sound';
import KeepAwake from 'react-native-keep-awake';

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'darkorange',
  },
  seperator: {
    height: 2,
    backgroundColor: '#25CC32',
  },
  pickerSong: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#FFEAD1',
  },
  alarmsHolderGuide: {
    flex: 1,
    paddingVertical: 2,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: '#FFEAD1',
  },
  alarmsHolder: {
    paddingHorizontal: 5,
  },
  alarmHolder: {
    borderRadius: 5,
    marginVertical: 2,
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
  buttonRemove: {
    backgroundColor: '#C22D12',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bgAlarmItem: {
    justifyContent: 'space-between',
    backgroundColor: '#2280B3',
  },
  alarmTime: {
    fontSize: 18,
    textAlign: 'right',
    color: 'black',
  },
  bgAlarmAdd: {
    justifyContent: 'center',
    backgroundColor: '#25CC32',
  },
  addAlarmText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 30,
  },
});

const DEFAULT_ALARM = {
  state: 0,
  timer: null,
  hour: 0,
  min: 15,
  sec: 0,
};

const songs = [];
const addSong = (file, label) => songs.push({file, label});
addSong('pastbgm.mp3', '메이플 배경음악(구)');
addSong('currbgm.mp3', '메이플 배경음악(현)');

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
  constructor(props) {
    super(props);
    this.state = {
      fadeIn: new Animated.Value(0),
    };
  }
  componentDidMount() {
    Animated.timing(this.state.fadeIn, {
      toValue: 1,
      duration: 500,
    }).start();
  }

  timerAction = async () => {
    const {index, data, update, alarmController} = this.props;
    if (data.hour + data.min + data.sec === 0) {
      clearInterval(data.timer);
      alarmController.play();
      update(index, {state: 2, timer: null});
    }
    update(index, {...oneSecLater(data)});
  };
  getButtonState = (onStart, onStop) => {
    if (this.props.data.state) {
      return {text: '중지', color: '#C2AA1D', action: onStop};
    }
    return {text: '시작', color: '#25CC32', action: onStart};
  };

  render() {
    const MAX_MIN = 60;
    const MAX_SEC = 60;
    const {data, index, update, remove, alarmController} = this.props;
    const onStart = () => {
      if (data.state) {
        return;
      }
      const timer = setInterval(this.timerAction, 1000);
      update(index, {state: 1, timer});
    };
    const onStop = () => {
      if (data.state === 1) {
        clearInterval(data.timer);
        update(index, {state: 0, timer: null});
      } else {
        alarmController.stop();
        update(index, DEFAULT_ALARM);
      }
    };
    const onRemove = () => {
      this.setState({visible: false});
      if (data.state === 1) {
        clearInterval(data.timer);
      }
      if (data.state === 2) {
        alarmController.stop();
      }
      remove(index);
    };
    const editable = !data.state;

    const button = this.getButtonState(onStart, onStop);
    return (
      <Animated.View
        style={[
          styles.alarmHolder,
          styles.bgAlarmItem,
          {
            opacity: this.state.fadeIn,
            transform: [
              {
                translateY: this.state.fadeIn.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-10, 0],
                }),
              },
            ],
          },
        ]}>
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
            }}
            editable={editable}>
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
            }}
            editable={editable}>
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
              const num = Number(data.sec);
              const sec = num < MAX_SEC ? num : MAX_SEC - 1;
              update(index, {sec});
            }}
            editable={editable}>
            {data.sec}
          </TextInput>
          <Text>초</Text>
        </View>
        <View style={styles.buttonHolder}>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: button.color}]}
            onPress={button.action}
            activeOpacity={0.8}>
            <Text style={styles.buttonText}>{button.text}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonRemove]}
            onPress={onRemove}
            activeOpacity={0.8}>
            <Text style={styles.buttonText}>삭제</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }
}
class Alarms extends React.Component {
  render() {
    const {alarms, update, remove, alarmController} = this.props;
    if (alarms.every(value => value === undefined)) {
      return <Text style={styles.buttonText}>등록된 알람이 없습니다</Text>;
    }
    return alarms.map((data, index) => {
      if (!data) {
        return;
      }
      return (
        <Alarm
          key={`${index}`}
          index={index}
          data={data}
          update={update}
          remove={remove}
          alarmController={alarmController}
        />
      );
    });
  }
}

export default class App extends React.Component {
  state = {
    song: 0,
    sound: null,
    alarms: [],
    alarming: 0,
  };

  setSong = song => {
    this.setState({song});
  };
  addAlarm = () => {
    const {alarms} = this.state;

    this.setState({
      alarms: [...alarms, DEFAULT_ALARM],
    });
  };
  updateAlarm = (index, data) => {
    const {alarms} = this.state;

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
    const {alarms} = this.state;

    const currAlarm = alarms[index];
    if (currAlarm.timer) {
      clearInterval(currAlarm.timer);
    }
    this.setState({
      alarms: [
        ...alarms.slice(0, index),
        undefined,
        ...alarms.slice(index + 1),
      ],
    });
  };
  playSong = () => {
    const {alarming, song} = this.state;
    if (alarming > 0) {
      this.setState({alarming: alarming + 1});
      return;
    }
    const songFile = songs[song].file;
    const sound = playSound({song: songFile});
    this.setState({alarming: alarming + 1, sound});
  };
  stopSong = () => {
    const {alarming, sound} = this.state;
    if (alarming > 1) {
      this.setState({alarming: alarming - 1});
      return;
    }
    sound.stop();
    this.setState({alarming: 0, sound: null});
  };
  alarmController = {play: this.playSong, stop: this.stopSong};
  render() {
    const {song, alarms} = this.state;
    return (
      <View style={styles.body}>
        <KeepAwake />
        <SongPicker song={song} onValueChange={this.setSong} />
        <View style={styles.seperator} />
        <View style={styles.alarmsHolderGuide}>
          <ScrollView style={styles.alarmsHolder}>
            <Alarms
              alarms={alarms}
              update={this.updateAlarm}
              remove={this.removeAlarm}
              alarmController={this.alarmController}
            />
            <AddAlarm onPress={this.addAlarm} />
          </ScrollView>
        </View>
      </View>
    );
  }
}
