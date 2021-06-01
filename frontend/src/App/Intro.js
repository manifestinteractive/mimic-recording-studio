import React, { Component } from "react";
// import { history } from "react-router-dom";
import { getName, saveName } from "./api/localstorage";

class Intro extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: undefined
    };
  }

  componentDidMount() {
    const name = getName();
    if (name) {
      this.setState({ name });
    }
  }

  render() {
    return (
      <div className="page-intro">
        <div id="PageIntro">
          <h2 style={{ color: "#27e4bc" }}>Mimic Recording Studio</h2>
          <h1>Create a Custom Text to Speech Voice</h1>
          <p>
            <a href="https://mycroft.ai/" target="_blank" rel="noopener noreferrer">Mycroft's</a> open source Mimic technologies are Text-to-Speech engines,
            which take a piece of written text and convert it into spoken audio.
            The latest generation of this technology uses machine learning
            techniques to create a model, which can speak a specific language,
            sounding like the voice on which it was trained.
          </p>
          <p>
            The <a href="https://github.com/MycroftAI/mimic-recording-studio" target="_blank" rel="noopener noreferrer">Mimic Recording Studio</a> simplifies the collection of training data from
            individuals, each of which can be used to produce a distinct voice
            for Mimic.
          </p>

          <div className="instructions">
            <i className="fas fa-book-open" />
            <h2>guide</h2>
            <p>
            <a href="https://github.com/MycroftAI/mimic2" target="_blank" rel="noopener noreferrer">Mimic II</a> preserves the rhythm, tone and pronunciation from source
              recordings. As a result, it is important for all recordings to use
              a consistent voice for the personality of the final product.
            </p>

            <p>
              <strong>To help with this, adopt the assistant persona for all recordings:</strong>
            </p>

            <ul className="persona-desc">
              <li>
                <span className="li-title">
                  The assistant is knowledgeable and confident, yet humble.
                </span>
                <br /> The assistant has access to all the world's information,
                but is aware of his or her own limitations, and doesn't mind
                being corrected.
              </li>
              <li>
                <span className="li-title">
                  The assistant loves knowledge and enjoys sharing information
                  with others.
                </span>
                <br /> This enjoyment can be clearly heard in the energy and
                enthusiasm in his or her voice.
              </li>
              <li>
                <span className="li-title">
                  The assistant is persistent, optimistic and upbeat.
                </span>
                <br /> Even if there are errors or misunderstandings, the tone
                should be positive, without any sign of frustration.
              </li>
              <li>
                <span className="li-title">
                  The assistant is professional without being stiff or overly
                  formal.
                </span>
                <br /> The assistant speaks with an efficient, yet unrushed
                pace, similar to what you might hear from a news anchor.
              </li>
            </ul>
          </div>
          {getName() ? this.renderWelcomeBackMsg() : this.renderInput()}
          <div className="btn_PageIntro">
            <button
              id="btn_PageIntro"
              className="btn"
              onClick={this.handleTrainMimicBtn}
            >
              {getName() ? "Let's Go" : "Next"}
              <i className="fas ibutton-continue fa-arrow-right" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  renderInput = () => {
    return (
      <div>
        <p>To get started, enter your name and hit the Next button.</p>
        <input
          type="text"
          id="yourname"
          placeholder="Your Name"
          onChange={this.handleInput}
        />
      </div>
    );
  };

  renderWelcomeBackMsg = () => {
    return (
      <div>
        <p>Welcome back <strong>{this.state.name}</strong> !</p>
        <p>Ready to Continue Recording?</p>
      </div>
    );
  };

  handleInput = e => {
    this.setState({ name: e.target.value });
  };

  handleTrainMimicBtn = () => {
    if (this.state.name === undefined) {
      alert("Please input a name before proceeding!");
    } else {
	    saveName(this.state.name);
	    this.props.history.push('/record')
    }
  };
}

export default Intro;
