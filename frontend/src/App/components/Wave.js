import React, { Component } from 'react';
import WaveSurfer from 'wavesurfer.js';
import PropTypes from 'prop-types';

class Wave extends Component {
    componentDidMount() {
        const { progressColor, waveColor, blob } = this.props;
        this.waveSurfer = WaveSurfer.create({
            container: '#waveform',
            cursorColor: '#88dcfe',
            cursorWidth: 1,
            interact: false,
            waveColor: waveColor ? waveColor : 'rgba(255, 255, 255, 0.15)',
            progressColor: progressColor ? progressColor : '#88dcfe'
        });

        if (blob) {
          this.loadWaveForm(blob);
        }

        this.waveSurfer.on('finish', () => {
            this.waveSurfer.pause();
            this.props.onFinish();
        });
    }

    componentDidUpdate() {
        if (this.props.play) {
            this.waveSurfer.seekTo(0);
            this.waveSurfer.play();
        } else {
            this.waveSurfer.pause();
        }
    }

    render() {
        const cssClass = this.props.className ? this.props.className : '';
        return (<div id="waveform" className={cssClass} />);
    }

    loadWaveForm = blob => {
        this.waveSurfer.loadBlob(blob);
    };
}

Wave.propTypes = {
    className: PropTypes.string,
    waveColor: PropTypes.string,
    progressColor: PropTypes.string,
    blob: PropTypes.object,
    play: PropTypes.bool,
    onFinish: PropTypes.func
}

export default Wave;
