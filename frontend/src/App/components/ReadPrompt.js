import React, { Component } from 'react';
import PropTypes from 'prop-types';

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

    for (let i = 0; i < voices.length ; i++) {
      if (voices[i].name === 'Google US English') {
        this.voice = voices[i];
        return
      }
    }
  }
  componentDidUpdate () {
    this.utterance = new SpeechSynthesisUtterance(this.props.prompt);
    this.utterance.voice = this.voice
    this.utterance.rate = 0.9
	}

  render() {
    const readPromp = () => {
      if (this.supported) {
        if (!this.state.reading) {
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
