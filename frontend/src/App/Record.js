import React, { Component } from "react";
import { ReactMic as Visualizer } from "react-mic";
import Recorder from "./components/Recorder";
import PhraseBox from "./components/PhraseBox";
import Metrics from "./components/Metrics";
import hark from "hark";
import Wave from "./components/Wave";

import { postAudio, getPrompt, getUser, createUser, getAudioLen } from "./api";
import { getUUID, getName } from "./api/localstorage";

class Record extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userCreated: false,
      shouldRecord: false,
      displayWav: false,
      blob: undefined,
      play: false,
      prompt: "*error loading prompt... is the backend running?*",
      language: "",
      promptNum: 0,
      totalTime: 0,
      totalCharLen: 0,
      audioLen: 0,
      showPopup: false,
      isRecording: false,
      needsConfirmation: false,
      replaceRecording: false,
      autoReview: true
    };

    this.uuid = getUUID();
    this.name = getName();
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown, false);
    this.requestUserDetails(this.uuid);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown, false);
  }

  render() {
    return (
      <div id="PageRecord">
        <div id="recorder">
          <h1 className="sr-only">Mimic Recording Studio</h1>
          <TopContainer
            userName={this.name}
            route={this.props.history.push}
            show={this.state.showPopup}
            dismiss={this.dismissPopup}
          />
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
          />
          <div className="wave-container" id="container">
            {this.state.displayWav ? this.renderWave() : this.renderVisualizer()}
            <Recorder
              command={this.state.shouldRecord ? "start" : "stop"}
              onStart={() => this.shoulddisplayWav(false)}
              onStop={this.processBlob}
              gotStream={this.silenceDetection}
            />
          </div>
        </div>
        <div id="footer">
          <div className="indicator-container">
            {this.state.shouldRecord ? '⇨ RECORDING IN PROGRESS ⇦' : '— PRESS RECORD TO START —'}
          </div>
          <div id="controls">
            <button id="btn_Record" className={`btn btn-record ${
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
              disabled={this.state.shouldRecord || this.state.blob === undefined || this.state.play}
              className={`btn btn-play ${
                this.state.shouldRecord
                  ? "btn-disabled"
                  : this.state.blob === undefined
                  ? "btn-disabled"
                  : this.state.play
                  ? "btn-disabled"
                  : ''
              } `}
              onClick={this.state.shouldRecord ? () => null : this.state.play ? () => null : this.playWav}
            >
              <i className="fas fa-play ibutton" />
              Review
            </button>
            <button
              id="btn_Next"
              disabled={this.state.shouldRecord || this.state.blob === undefined || this.state.play}
              className={`btn-next ${
                this.state.shouldRecord
                  ? "btn-disabled"
                  : this.state.blob === undefined
                  ? "btn-disabled"
                  : this.state.play
                  ? "btn-disabled"
                  : ''
              }`}
              onClick={this.state.shouldRecord ? () => null : this.state.play ? () => null : this.onNext}
            >
              <i className="fas fa-forward ibutton-next" />
              Next
            </button>
          </div>
          <div id="auto-review">
            <input type="checkbox" checked={this.state.autoReview} id="auto-review-input" onChange={this.handleAutoReview} /> &nbsp;
            <label htmlFor="auto-review-input">
              Auto Review Recordings
            </label>
          </div>
        </div>
      </div>
    );
  }

  dismissPopup = () => {
    this.setState({
      showPopup: false
    });
  };

  requestPrompts = uuid => {
    getPrompt(uuid)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          this.setState({
            prompt: res.data.prompt,
            totalPrompt: res.data.total_prompt
          });
        }
      });
  };

  requestUserDetails = uuid => {
    getUser(uuid)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          this.setState({
            userName: res.data.user_name,
            language: res.data.language,
            promptNum: res.data.prompt_num,
            totalTime: res.data.total_time_spoken,
            totalCharLen: res.data.len_char_spoken
          });
          this.requestPrompts(this.uuid);
        } else {
          if (this.uuid) {
            createUser(this.uuid, this.name)
              .then(res => res.json())
              .then(res => {
                if (res.success) {
                  this.setState({ userCreated: true });
                  this.requestPrompts(this.uuid);
                } else {
                  alert("sorry there is in error creating user");
                }
              });
          } else {
            alert("sorry there is in error creating user");
          }
        }
      });
  };

  renderWave = () => (
    <Wave
      className="wavedisplay"
      waveColor="#88dcfe"
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

  processBlob = blob => {
    getAudioLen(this.uuid, blob)
      .then(res => res.json())
      .then(res =>
        this.setState({
          audioLen: res.data.audio_len
        })
      );
    this.setState({
      blob: blob
    });
    this.shoulddisplayWav(true);

    if (this.state.autoReview) {
      clearTimeout(window.autoPlay);

      window.autoPlay = setTimeout(this.playWav, 3000);
    }
  };

  shoulddisplayWav = bool => this.setState({ displayWav: bool });

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
      postAudio(this.state.blob, this.state.prompt, this.uuid)
        .then(res => res.json())
        .then(res => {
          if (res.success) {
            this.setState({ displayWav: false });
            this.requestPrompts(this.uuid);
            this.requestUserDetails(this.uuid);
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
            alert("There was an error in saving that audio");
          }
        })
        .catch(err => console.log(err));
    }
  };

  silenceDetection = stream => {
    const options = {
      interval: "150",
      threshold: -80
    };
    const speechEvents = hark(stream, options);

    speechEvents.on("stopped_speaking", () => {
      this.stopRecording();
    });
  };

  handleAutoReview = (event) => {
    this.setState({
      autoReview: event.target.checked
    });
  }
}

class TopContainer extends Component {
  render() {
    return this.props.show ? this.renderContainer() : null;
  }

  renderContainer = () => {
    return (
      <div className="top-container">
        <div className="top-container-info">
          <div className="session-info">
            <div className="top-info">
              <div>
                <h2>RECORDER</h2>
                &nbsp;
                <span id="sessionName">{this.props.userName}</span>
              </div>
              <div className="btn-restart" />
            </div>
            <hr />
            <p>
              It is very important that the recorded words{" "}
              <span className="highlight">
                match the text in the script exactly
              </span>
              . If you accidentally deviate from the script or are unsure,
              please record the prompt again.
            </p>
            <p>
              <button className="btn info-btn" onClick={this.handleClick}>
                Tutorial
              </button>
              <button className="btn info-btn" onClick={this.props.dismiss}>
                Continue
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  };

  handleClick = () => {
    this.props.route("/tutorial");
  };
}

export default Record;
