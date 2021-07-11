import React, { Component } from 'react';
import PropTypes from 'prop-types';

class PhraseBox extends Component {
  render() {
    return (
      <div id="phraseBox">
        <div id="phrase" className={this.props.hasError ? 'error' : ''}>
          {this.props.prompt}
        </div>
        {this.renderFeedback()}
      </div>
    );
  }

  renderFeedback = () => {
    if (this.props.promptNum < 20 || this.props.audioLen === 0) {
      return '';
    } else {
      const speechRate = this.props.prompt.length / this.props.audioLen;
      const avgSpeechRate = (
        this.props.totalCharLen / this.props.totalTime
      ).toFixed(1);
      // Allow deviation of 25% of speechRate from average speech rate
      if (this.determinePace(avgSpeechRate, speechRate)) {
        return <div className="feedback-ball-green">Good Pace</div>;
      } else if (speechRate < avgSpeechRate) {
        return (
          <div className="feedback-ball-red">Too Slow</div>
        );
      } else {
        return (
          <div className="feedback-ball-red">Too Fast</div>
        );
      }
    }
  };

  determinePace = (avgSpeechRate, speechRate) => {
    if (this.props.prompt.length <= 25) {
      return (
        avgSpeechRate * 0.5 < speechRate && speechRate < avgSpeechRate * 1.5
      );
    } else if (this.props.prompt.length <= 125) {
      return (
        avgSpeechRate * 0.75 < speechRate && speechRate < avgSpeechRate * 1.25
      );
    } else {
      return (
        avgSpeechRate * 0.85 < speechRate && speechRate < avgSpeechRate * 1.15
      );
    }
  };
}

PhraseBox.propTypes = {
  prompt: PropTypes.string,
  promptNum: PropTypes.number,
  audioLen: PropTypes.number,
  totalCharLen: PropTypes.number,
  totalTime: PropTypes.number,
  hasError: PropTypes.bool
};

export default PhraseBox;
