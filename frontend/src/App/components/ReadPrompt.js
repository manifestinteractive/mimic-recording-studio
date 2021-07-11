import React, { Component } from 'react';
import PropTypes from 'prop-types';

const MRS_PROMPT_VOICE = process.env.REACT_APP_MRS_PROMPT_VOICE ? process.env.REACT_APP_MRS_PROMPT_VOICE : 'Google US English';
const MRS_PROMPT_SPEED = process.env.REACT_APP_MRS_PROMPT_SPEED ? process.env.REACT_APP_MRS_PROMPT_SPEED : 0.9;

class ReadPrompt extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reading: false,
      supported: false
    };
  }

  componentDidMount() {
    this.supported = ('speechSynthesis' in window);
    this.synth = this.supported ? speechSynthesis : null;
    this.utterance = null;

    const voices = this.synth.getVoices();
    const selectedVoice = MRS_PROMPT_VOICE;

    for (let i = 0; i < voices.length ; i++) {
      if (voices[i].name === selectedVoice) {
        this.voice = voices[i];
        return
      }
    }
  }
  componentDidUpdate () {
    this.utterance = new SpeechSynthesisUtterance(this.props.prompt);
    this.utterance.voice = this.voice;
    this.utterance.rate = MRS_PROMPT_SPEED;
	}

  render() {
    const readPromp = () => {
      console.log('readPromp');
      if (this.supported) {
        console.log('readPromp', 'Supported');
        if (!this.state.reading) {
          console.log('readPromp', 'Start Reading', this.props.prompt);
          this.setState({
            reading: true
          })

          this.utterance.onend = () => {
            this.setState({
              reading: false
            })
          }

          this.synth.speak(this.utterance);
        } else {
          this.synth.cancel()

          this.setState({
            reading: false
          })
        }
      }
    }

    return (
      <button className={`read-prompt ${this.state.reading ? 'reading' : ''} ${!this.supported ? 'unsupported' : ''}`} onClick={readPromp} data-title="Speak Prompt Text" aria-label="Speak Prompt Text">
        <i className={`fas fa-headphones`} />
      </button>
    );
  }
}

ReadPrompt.propTypes = {
  prompt: PropTypes.string,
  supported: PropTypes.bool,
  isRecording: PropTypes.bool
};

export default ReadPrompt;
