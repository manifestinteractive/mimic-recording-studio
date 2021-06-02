import React, { Component } from 'react';
import { ReactMic as Visualizer } from 'react-mic';
import hark from 'hark';

import Recorder from './components/Recorder';
import PhraseBox from './components/PhraseBox';
import Metrics from './components/Metrics';
import Wave from './components/Wave';

import { postAudio, getPrompt, getUser, createUser, getAudioLen } from './api';

class Record extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userCreated: false,
      shouldRecord: false,
      displayWav: false,
      blob: undefined,
      play: false,
      prompt: '',
      language: '',
      promptNum: 0,
      totalTime: 0,
      totalCharLen: 0,
      audioLen: 0,
      isRecording: false,
      needsConfirmation: false,
      replaceRecording: false,
      autoReview: true,
      supportedBrowser: false,
      hasError: false
    };

    this.name = 'Mimic My Voice';
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown, false);
    this.requestUserDetails();

    // Check for Supported Browser
    if (!navigator.getUserMedia || !window.MediaRecorder) {
      this.setState({
        hasError: true,
        prompt: 'Your browser doesn\'t support native microphone recording. For best results, we recommend using Google Chrome or Mozilla Firefox.',
        totalPrompt: 0
      })
    } else {
      this.setState({
        hasError: false,
        supportedBrowser: true
      })
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown, false);
  }

  render() {
    return (
      <div id="PageRecord" className={`wave-container ${
        !this.state.isRecording
          ? this.state.needsConfirmation
            ? this.state.replaceRecording
              ? 'has-recorded needs-confirmation' : 'has-recorded'
            : 'is-new'
          : 'is-recording'
        }`}>
        <div id="recorder">
          <h1 className="sr-only">Mimic Recording Studio</h1>
          <Metrics
            totalTime={this.state.totalTime}
            totalCharLen={this.state.totalCharLen}
            promptNum={this.state.promptNum}
            totalPrompt={this.state.totalPrompt}
          />
          <PhraseBox
            prompt={this.state.prompt}
            promptNum={this.state.promptNum}
            audioLen={this.state.audioLen}
            totalCharLen={this.state.totalCharLen}
            totalTime={this.state.totalTime}
            hasError={this.state.hasError}
          />
          <div className="wave-container" id="container">
            {this.state.displayWav ? this.renderWave() : this.renderVisualizer()}
            <Recorder
              command={this.state.shouldRecord ? 'start' : 'stop'}
              onStart={() => this.shouldDisplayWav(false)}
              onStop={this.processBlob}
              onMissingAPIs={this.checkSupport}
              gotStream={this.silenceDetection}
            />
          </div>
        </div>
        <div id="footer">
          <div className="indicator-container">
            {!this.state.isRecording
                ? this.state.needsConfirmation
                  ? this.state.replaceRecording
                    ? 'ARE YOU SURE YOU WANT TO REPLACE RECORDING ?'
                    : 'PRESS RE-RECORD TO REDO RECORDING'
                  : 'PRESS RECORD TO START'
                : '— — RECORDING IN PROGRESS — —'
            }
          </div>
          <div id="controls">
            <button id="btn_Record"
              disabled={!this.state.supportedBrowser || this.state.hasError}
              title={
                !this.state.isRecording
                  ? this.state.needsConfirmation
                    ? this.state.replaceRecording
                      ? 'Confirm Replace Recording' : 'Redo Recording'
                    : 'Start Recording'
                  : 'Stop Recording'
              }
              className={`btn btn-record ${
                !this.state.isRecording
                  ? this.state.needsConfirmation
                    ? this.state.replaceRecording
                      ? 'confirm' : 'redo'
                    : 'start'
                  : 'stop'
                }`} onClick={!this.state.isRecording ? this.startRecording : this.stopRecording}>
              <i className={`fas ibutton-record ${
                !this.state.isRecording
                  ? this.state.needsConfirmation
                    ? this.state.replaceRecording
                      ? 'fa-question-circle' : 'fa-redo-alt'
                    : 'fa-microphone'
                  : 'fa-stop-circle'
                }`} />
              {!this.state.isRecording
                ? this.state.needsConfirmation
                  ? this.state.replaceRecording
                    ? 'Confirm' : 'Re-Record'
                  : 'Record'
                : 'Stop'
              }
            </button>
            <button
              id="btn_Play"
              title="Listen to Recording"
              disabled={this.state.shouldRecord || this.state.blob === undefined || this.state.play || this.state.hasError}
              className={`btn btn-play ${
                this.state.shouldRecord
                  ? 'btn-disabled'
                  : this.state.blob === undefined
                  ? 'btn-disabled'
                  : this.state.play
                  ? 'btn-disabled'
                  : ''
              } `}
              onClick={this.state.shouldRecord ? () => null : this.state.play ? () => null : this.playWav}
            >
              <i className="fas fa-play ibutton" />
              Review
            </button>
            <button
              id="btn_Next"
              title="Save Recording and Continue"
              disabled={this.state.shouldRecord || this.state.blob === undefined || this.state.play || this.state.hasError}
              className={`btn btn-next ${
                this.state.shouldRecord
                  ? 'btn-disabled'
                  : this.state.blob === undefined
                  ? 'btn-disabled'
                  : this.state.play
                  ? 'btn-disabled'
                  : ''
              }`}
              onClick={this.state.shouldRecord ? () => null : this.state.play ? () => null : this.onNext}
            >
              <i className="fas fa-forward ibutton-next" />
              Next
            </button>
          </div>
          <div id="auto-review">
            <input
              type="checkbox"
              id="auto-review-input"
              title="Automatically Play Recordings when Complete?"
              disabled={!this.state.supportedBrowser || this.state.hasError}
              checked={this.state.autoReview}
              onChange={this.handleAutoReview}
            /> &nbsp;
            <label htmlFor="auto-review-input">
              Auto Review Recordings
            </label>
          </div>
        </div>
      </div>
    );
  }

  requestPrompts = () => {
    getPrompt()
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          this.setState({
            hasError: false,
            prompt: res.data.prompt,
            totalPrompt: res.data.total_prompt
          });
        }
      }).catch(err => this.showError(err));
  };

  showError = err => {
    console.error(err);
    this.setState({
      hasError: true,
      prompt: 'Failed to Connect.  Try Restarting Mimic Recording Studio.',
      totalPrompt: 0
    });
  }

  requestUserDetails = () => {
    getUser()
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          this.setState({
            hasError: false,
            userName: res.data.user_name,
            language: res.data.language,
            promptNum: res.data.prompt_num,
            totalTime: res.data.total_time_spoken,
            totalCharLen: res.data.len_char_spoken
          });
          this.requestPrompts();
        } else {
          createUser()
            .then(res => res.json())
            .then(res => {
              if (res.success) {
                this.setState({ hasError: false, userCreated: true });
                this.requestPrompts();
              } else {
                window.location = '/';
              }
            }).catch(err => this.showError(err));
        }
      }).catch(err => this.showError(err));
  };

  renderWave = () => (
    <Wave
      className="wavedisplay"
      waveColor="rgba(255, 255, 255, 0.15)"
      progressColor="#88dcfe"
      blob={this.state.blob}
      play={this.state.play}
      onFinish={this.stopWav}
    />
  );

  renderVisualizer = () => (
    <Visualizer
      className="wavedisplay"
      record={this.state.shouldRecord}
      backgroundColor={"#1b1e28"}
      strokeColor={"#88dcfe"}
    />
  );

  checkSupport = (media, recorder) => {
    console.log('media', media)
    console.log('recorder', recorder)

    if (!media && !recorder) {
      this.setState({
        prompt: 'Unsupported Browser',
        totalPrompt: 1
      })
    }
  };

  processBlob = blob => {
    getAudioLen(blob)
      .then(res => res.json())
      .then(res =>
        this.setState({
          audioLen: res.data.audio_len
        })
      ).catch(err => this.showError(err));
    this.setState({
      blob: blob
    });
    this.shouldDisplayWav(true);

    if (this.state.autoReview) {
      clearTimeout(window.autoPlay);

      window.autoPlay = setTimeout(this.playWav, 3000);
    }
  };

  shouldDisplayWav = bool => this.setState({ displayWav: bool });

  playWav = () => this.setState({ play: true });

  stopWav = () => this.setState({ play: false });

  startRecording = () => {
    // Check if we are already recording
    if (this.state.isRecording) {
      this.stopRecording();
      return;
    }

    // Check if we have not started a recording already
    if (!this.state.shouldRecord && !this.state.needsConfirmation && !this.state.replaceRecording) {
      this.recordHandler();
      return;
    }

    // If we have already started a recording, ask user to confirm replacing recording
    if (!this.state.shouldRecord && this.state.needsConfirmation && !this.state.replaceRecording) {
      this.setState({
        needsConfirmation: true,
        replaceRecording: true
      });
    }

    // Replace Recording
    if (!this.state.shouldRecord && this.state.needsConfirmation && this.state.replaceRecording) {
      this.recordHandler();
      return;
    }
  };

  stopRecording = () => {
    if (this.state.needsConfirmation) {
      this.setState({
        shouldRecord: false,
        play: false,
        isRecording: false,
        needsConfirmation: true,
        replaceRecording: false
      });
    } else {
      this.setState({
        shouldRecord: false,
        play: false,
        isRecording: false,
        needsConfirmation: false,
        replaceRecording: false
      });
    }
  };

  handleKeyDown = event => {
    // esc key code
    if (event.keyCode === 27) {
      event.preventDefault();
      this.stopRecording();
    }
  };

  recordHandler = () => {
    setTimeout(() => {
      this.setState((state, props) => {
        return {
          isRecording: true,
          shouldRecord: true,
          play: false,
          needsConfirmation: true,
          replaceRecording: false
        };
      });
    }, 500);
  };

  onNext = () => {
    if (this.state.blob !== undefined) {
      postAudio(this.state.blob, this.state.prompt)
        .then(res => res.json())
        .then(res => {
          if (res.success) {
            this.setState({ displayWav: false });
            this.requestPrompts();
            this.requestUserDetails();
            this.setState({
              blob: undefined,
              audioLen: 0
            });

            this.setState({
              shouldRecord: false,
              displayWav: false,
              blob: undefined,
              promptNum: 0,
              totalTime: 0,
              totalCharLen: 0,
              audioLen: 0,
              play: false,
              isRecording: false,
              needsConfirmation: false,
              replaceRecording: false
            });
          } else {
            alert('There was an error in saving that audio');
          }
        })
        .catch(err => console.log(err));
    }
  };

  silenceDetection = stream => {
    const options = {
      interval: '150',
      threshold: -80
    };
    const speechEvents = hark(stream, options);

    speechEvents.on('stopped_speaking', () => {
      this.stopRecording();
    });
  };

  handleAutoReview = (event) => {
    this.setState({
      autoReview: event.target.checked
    });
  }
}

export default Record;
