import React, { Component } from "react";
import WaveSurfer from "wavesurfer.js";
import PropTypes from 'prop-types';

class Wave extends Component {
    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyDown, false);

        const { progressColor, waveColor, blob } = this.props;
        this.wavesurfer = WaveSurfer.create({
            container: "#waveform",
            waveColor: '#90a1a9',// waveColor ? waveColor : "#88dcfe",
            progressColor: '#88dcfe'//progressColor ? progressColor : "#5DE4c7"
        });

        if (blob) {
          this.loadWaveForm(blob);
        }

        this.wavesurfer.on("finish", () => {
            this.wavesurfer.pause();
            this.props.onFinish();
        });
    }

    componentDidUpdate() {
        if (this.props.play) {
            this.wavesurfer.play();
        } else {
            this.wavesurfer.pause();
        }
    }

    handleKeyDown = (event) => {
        if (event.keyCode === 27) {
            this.wavesurfer.pause()
        }
    }

    render() {
        const cssClass = this.props.className ? this.props.className : "";
        return (
            <div
                id="waveform"
                className={cssClass}
            />
        );
    }

    loadWaveForm = blob => {
        this.wavesurfer.loadBlob(blob);
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
