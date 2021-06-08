import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Metrics extends Component {
    render() {
        return (
            <div className="metrics-container">
                <div className="total-hours">
                    <h2>PROGRESS</h2>
                    <div>
                      {this.phraseCalc()}
                    </div>
                    <div>
                        {this.timeRecorded()}
                    </div>
                </div>
                <div className="speech-rate">
                    <h2>SPEECH RATE</h2>
                    <div>{this.speechRate()}</div>
                </div>
            </div>
        );
    }

    phraseCalc = () => {
      if (this.props && typeof this.props.totalPrompt !== 'undefined') {
        return `Phrase: ${this.props.promptNum} / ${this.props.totalPrompt} ( ${Math.round((this.props.promptNum / this.props.totalPrompt) * 100)}% )`;
      }
    };

    timeRecorded = () => {
      if (this.props && typeof this.props.totalTime !== 'undefined') {
        return `Time Recorded: ${this.secondsToHms(Math.round(this.props.totalTime))}`;
      }
    };

    speechRate = () => {
      if (this.props && typeof this.props.totalTime !== 'undefined' && typeof this.props.totalCharLen !== 'undefined') {
        let charPerSec = (this.props.totalCharLen / this.props.totalTime).toFixed(1);
        charPerSec = isNaN(charPerSec) ? 0 : charPerSec;

        return `Average: ${charPerSec} characters per second`;
      }
    };

    secondsToHms = d => {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor((d % 3600) / 60);
        var s = Math.floor((d % 3600) % 60);

        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };
}

Metrics.propTypes = {
    promptNum: PropTypes.number,
    totalCharLen: PropTypes.number,
    totalTime: PropTypes.number,
    totalPrompt: PropTypes.number
}

export default Metrics;
