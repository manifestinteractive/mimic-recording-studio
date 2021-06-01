import React, { Component } from "react";
import PhraseBox from "./components/PhraseBox";
import { ReactMic as Visualizer } from "react-mic";

class Tutorial extends Component {
  render() {
    return (
      <div className="App">
        <h1>Tutorial</h1>
        <div className="tutorial">
            The Mimic Recording Studio was made to simplify the process of
            creating your own text to speech corpus. This tutorial will help you
            get started.
            <br />
            <br />
            <div>
            <h2>Recording Box</h2>
            <PhraseBox
                prompt="The human voice is the most perfect instrument of all."
                promptNum={0}
                audioLen={0}
                totalCharLen={0}
                totalTime={0}
            />
            <Visualizer
                className="wavedisplay"
                record={false}
                backgroundColor="#1b1e28"
                strokeColor="#88dcfe"
            />
            <p>&nbsp;</p>

            <h2>Controls</h2>
            <p>
              <strong>[ RECORD ]</strong>&nbsp; Starts Recording
            </p>
            <p>
              <strong>[ STOP ]</strong>&nbsp; Stops Recording ( Automatically Stops when silence detected )
            </p>
            <p>
              <strong>[ RE-RECORD ]</strong>&nbsp; Redo Recording
            </p>
            <p>
              <strong>[ CONFIRM ]</strong>&nbsp; Confirm Redo Recording ( Prevents wiping out good takes )
            </p>
            <p>
              <strong>[ REVIEW ]</strong>&nbsp; Listen to Recording
            </p>
            <p>
              <strong>[ NEXT ]</strong>&nbsp; Save Recording and Go to Next Phrase
            </p>

            <h2>Important</h2>
            <p>
                It is essential that the recorded words match the text in the script <strong>exactly</strong>.
                If you deviate from the script or wish to record a new take, press the RE-RECORD button.&nbsp;
                <strong>Once saved you will not be able to go back.</strong>
            </p>
          </div>
          <div>
              <h2>Feedback</h2>
              <p>
                The Feedback Indicator will only start appearing after <strong>100 Recorded Samples</strong>.
                When recording stops, the feedback indicator will appear below the Control Buttons.
                This indicator will tell you if you are speaking to fast, to slow, or at a good pace. The indicator is determined using your average speech rate.
              </p>
              <div className="grid-layout">
                <div className="feedback-ball-green-t">Good Pace</div>
                <div className="feedback-ball-red-t">Too Slow</div>
                <div className="feedback-ball-red-t">Too Fast</div>
              </div>
          </div>
          <div>
              <button className="btn" onClick={this.handleClick}>
                Let's Go
                <i className="fas ibutton-continue fa-arrow-right" />
              </button>
          </div>
        </div>
        <div className="clearfix"></div>
      </div>
    );
  }

  handleClick = () => {
      this.props.history.push("/record")
  }

}

export default Tutorial;
