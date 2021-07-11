import React, { Component } from 'react';
import { ReactMic as Visualizer } from 'react-mic';
import hark from 'hark';
import env from 'react-dotenv';

import Recorder from './components/Recorder';
import PhraseBox from './components/PhraseBox';
import SpokenWords from './components/SpokenWords';
import ReadPrompt from './components/ReadPrompt';
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
      hasError: false,
      finalizedText: '',
      interimText: ''
    };

    // Check to see if this browser supports speech recognition
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();

       // Set interim results to be returned if a callback for it has been passed in
      this.recognition.interimResults = this.onRecognition;
      this.recognition.lang = env.MRS_SPEECH_LANGUAGE ? env.MRS_SPEECH_LANGUAGE : 'en-US';

      let finalTranscript = '';

      // Process both interim and finalized results
      this.recognition.onresult = event => {
        let interimTranscript = '';

        // Concatenate all the transcribed pieces together (SpeechRecognitionResult)
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const transcriptionPiece = event.results[i][0].transcript;

          // Check for a finalized transcription in the cloud
          if (event.results[i].isFinal) {
            finalTranscript += transcriptionPiece;
            this.onRecognitionFinal(finalTranscript);
            finalTranscript = '';
          } else if (this.recognition.interimResults) {
            interimTranscript += transcriptionPiece;
            this.onRecognition(interimTranscript);
          }
        }
      };

      this.recognition.onend = () => {
        this.onRecognitionEnd();
      };
    }
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

          <div className="phrase-wrapper">
            <ReadPrompt
              prompt={this.state.prompt}
              isRecording={this.state.isRecording}
            />
            <PhraseBox
              prompt={this.state.prompt}
              promptNum={this.state.promptNum}
              audioLen={this.state.audioLen}
              totalCharLen={this.state.totalCharLen}
              totalTime={this.state.totalTime}
              hasError={this.state.hasError}
            />
          </div>

          <div className="wave-container" id="container">
            {this.state.displayWav ? this.renderWave() : this.renderVisualizer()}
            <Recorder
              command={this.state.shouldRecord ? 'start' : 'stop'}
              onStart={() => this.shouldDisplayWav(false)}
              onStop={this.processBlob}
              onMissingAPIs={this.checkSupport}
              gotStream={this.silenceDetection}
            />

            <SpokenWords
              interimText={this.state.interimText}
              finalizedText={this.state.finalizedText}
              prompt={this.state.prompt}
              promptNum={this.state.promptNum}
              supported={('webkitSpeechRecognition' in window)}
              isRecording={this.state.isRecording}
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
              data-title={
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
              data-title="Listen to Recording"
              disabled={this.state.shouldRecord || this.state.blob === undefined || this.state.hasError}
              className="btn btn-play"
              onClick={!this.state.play ? this.playWav : this.stopWav}
            >
              <i className={`fas ibutton ${!this.state.play ? 'fa-play' : 'fa-stop-circle'}`} />
              {!this.state.play ? 'Review' : 'Stop'}
            </button>
            <button
              id="btn_Next"
              data-title="Save Recording and Continue"
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
              data-title="Automatically Play Recordings when Complete?"
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

  // Custom Functions
  checkSupport = (media, recorder) => {
    if (!media && !recorder) {
      this.setState({
        prompt: 'Unsupported Browser',
        totalPrompt: 1
      })
    }
  };

  handleAutoReview = (event) => {
    this.setState({
      autoReview: event.target.checked
    });
  };

  handleKeyDown = event => {
    // esc key code
    if (event.keyCode === 27) {
      event.preventDefault();
      this.stopRecording();
    }
  };

  onNext = () => {
    if (this.state.blob !== undefined) {
      postAudio(this.state.blob, this.state.prompt)
        .then(res => res.json())
        .then(res => {
          if (res.success) {
            this.requestPrompts();
            this.requestUserDetails();

            this.setState({
              shouldRecord: false,
              displayWav: false,
              blob: undefined,
              totalCharLen: 0,
              audioLen: 0,
              play: false,
              isRecording: false,
              needsConfirmation: false,
              replaceRecording: false,
              interimText: '',
              finalizedText: ''
            });
          } else {
            this.showError(null, 'We were unable to save that audio file. Refresh the Page to Try Again.');
          }
        }).catch(err => this.showError(err));
    }
  };

  onRecognition = text => {
    this.setState({ interimText: text });
  };

  onRecognitionEnd = () => {};

  onRecognitionFinal = text => {
    this.setState({
      finalizedText: [text, ...this.state.finalizedText].join(' '),
      interimText: ''
    });
  };

  playWav = () => {
    this.setState({ play: true });
  }

  processBlob = blob => {
    getAudioLen(blob)
      .then(res => res.json())
      .then(res => {
        if (res && typeof res.data !== 'undefined' && typeof res.data.audio_len !== 'undefined') {
          this.setState({
            audioLen: res.data.audio_len
          })
        } else {
          this.showError(null, 'Unable to Decode Audio. Refresh the Page to Try Again.');
        }
      }).catch(err => this.showError(err));

    this.setState({
      blob: blob
    });

    this.shouldDisplayWav(true);

    if (this.state.autoReview) {
      this.stopWav();
      this.playWav();
    }
  };

  recordHandler = () => {
    this.setState({
      isRecording: true,
      shouldRecord: true,
      play: false,
      needsConfirmation: true,
      replaceRecording: false,
      interimText: '',
      finalizedText: ''
    });

    // If browser supports speech recognition, start it
    if (this.recognition) {
      this.recognition.start();
    }
  };

  renderVisualizer = () => (
    <Visualizer
      className="wavedisplay"
      record={this.state.shouldRecord}
      backgroundColor={"#14161e"}
      strokeColor={"#88dcfe"}
    />
  );

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

  resetRecording = () => {
    this.setState({
      shouldRecord: false,
      displayWav: false,
      blob: undefined,
      audioLen: 0,
      play: false,
      isRecording: false,
      needsConfirmation: false,
      replaceRecording: false,
      interimText: '',
      finalizedText: ''
    });
  }

  shouldDisplayWav = bool => this.setState({ displayWav: bool });

  showError = (err, message) => {
    if (err) {
      console.error(err);
    }

    this.setState({
      hasError: true,
      prompt: message ? message : 'Failed to Connect. Try Refreshing the Page, or Restarting Mimic Recording Studio.',
      totalPrompt: 0
    });
  }

  silenceDetection = stream => {
    const options = {
      interval: '100',
      threshold: -80
    };
    const speechEvents = hark(stream, options);

    speechEvents.on('stopped_speaking', () => {
      this.stopRecording();
    });
  };

  startRecording = () => {
    // Stop Audio Playback if Running
    this.stopWav();

    // Check if we are already recording
    if (this.state.isRecording) {
      this.stopRecording();
    }

    // Check if we have not started a recording already
    if (!this.state.shouldRecord && !this.state.needsConfirmation && !this.state.replaceRecording) {
      this.recordHandler();
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
      this.resetRecording();
      this.recordHandler();
    }
  };

  stopRecording = () => {
    // If browser supports speech recognition, stop it
    if (this.recognition) {
      this.recognition.stop();
    }

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

  stopWav = () => this.setState({ play: false });
}

export default Record;
