import React, { Component } from 'react';
import PropTypes from 'prop-types';
import converter from 'number-to-words';
import parse from 'html-react-parser';

class SpokenWords extends Component {
  render() {
    return (
      <div className={`spoken-words ${!this.props.supported ? 'unsupported' : ''}`}>
        {this.renderSpokenWords()}
      </div>
    );
  }

  renderSpokenWords = () => {
    // If speech to text is not supported by browser, just return an empty string
    if (!this.props.supported) {
      return '';
    }

    // Setup Listener
    let diff = this.props.isRecording ? '<i class="fas fa-comment-dots"></i>' : '';

    // Count Incorrect Words
    let incorrectCount = 0;

    // Break up what was said into an array
    const spoken = (this.props.interimText !== '') ? this.tokenize(this.props.interimText) : this.tokenize(this.props.finalizedText);

    // Break of what was requested into an array
    const prompt = this.tokenize(this.props.prompt);

    // make sure we have some spoken words
    if (spoken && spoken.length > 0) {
      // Loop through words from prompt to check for numbers
      spoken.forEach((word, index) => {
        // Check if spoke word matched prompt
        if (prompt.length > index && typeof prompt[index] !== 'undefined' && word === prompt[index]) {
          diff = diff.concat(`<span class="correct">${index === 0 ? (word.charAt(0).toUpperCase() + word.slice(1)) : word}</span> `);
        } else {
          incorrectCount++;
          diff = diff.concat(`<span class="incorrect" title="Correct Word: '${prompt[index]}'">${index === 0 ? (word.charAt(0).toUpperCase() + word.slice(1)) : word}</span> `);
        }
      });
    }

    // Show Quality
    let quality = '';

    // Check that we have words, and that we are no longer recording
    if (spoken.length > 0 && !this.props.isRecording) {
      quality = (incorrectCount === 0)
        ? '<i class="fas fa-check-square quality good" title="Perfection"></i>'
        : '<i class="fas fa-exclamation-triangle quality bad" title="Double Check Your Recorded Words"></i>';
    }

    // Render Diff
    return parse(`<div class="diff">${quality}${diff}</div>`);
  };

  remapSpeechToPrompt = str => {
    if (typeof str !== 'string') {
      return;
    }

    // Resolve Known Issues with weird promp text
    str = str.replace('work-rooms', 'workrooms');
    str = str.replace('wool-washing', 'wool washing');
    str = str.replace('theater', 'theatre');
    str = str.replace('karl', 'carl');
    str = str.replace('eighteen sixty two', '1862');

    return str;
  }

  tokenize = str => {
    if (typeof str !== 'string') {
      return;
    }

    str = str.toLowerCase();
    str = str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');

    // Sometimes the Prompt has some weird text that our Speech to Text will get wrong, let's fix that
    str = this.remapSpeechToPrompt(str);

    const punctuation = '\\[\\!\\"\\#\\$\\%\\&\\\'\\(\\)\\*\\+\\,\\\\\\-\\.\\/\\:\\;\\<\\=\\>\\?\\@\\[\\]\\^\\_\\`\\{\\|\\}\\~\\]';
    const re = new RegExp('\\s*(\\.{3}|\\w+\\-\\w+|\\w+\'(?:\\w+)?|\\w+|[' + punctuation + '])');

    function grep(ary, filter) {
      var result = [];
      for (var i = 0, len = ary.length; i++ < len;) {
        var member = ary[i] || '';

        if (filter && (typeof filter === 'Function') ? filter(member) : member) {
          result.push(member);
        }
      }

      return result;
    }

    return grep(str.split(re));
  }
}

SpokenWords.propTypes = {
  interimText: PropTypes.string,
  finalizedText: PropTypes.string,
  prompt: PropTypes.string,
  supported: PropTypes.bool,
  isRecording: PropTypes.bool
};

export default SpokenWords;
