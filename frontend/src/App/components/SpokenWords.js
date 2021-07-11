import React, { Component } from 'react';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';
import wordsToNumbers from 'words-to-numbers';

class SpokenWords extends Component {
  componentDidMount() {
    this.hasWrittenWords = false;
    this.cleanPrompt = '';
  }
  componentDidUpdate(prevProps) {
    if (this.props.prompt && this.props.prompt.length > 0) {
      // Fix issues with numbers being written as words
      var currentPrompt = this.props.prompt;
      var numberPromptFix = wordsToNumbers(currentPrompt, {
        impliedHundreds: true
      });

      if (numberPromptFix && numberPromptFix.indexOf('NaN') === -1) {
        currentPrompt = numberPromptFix;
      }

      this.cleanPrompt = currentPrompt;
    }
  }

  render() {
    return (
      <div className = {`spoken-words ${!this.props.supported ? 'unsupported' : ''}`}>
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
    const spoken = (this.props.interimText !== '')
      ? this.tokenize(this.props.interimText)
      : this.tokenize(this.props.finalizedText);

    // Break of what was requested into an array
    const prompt = this.tokenize(this.cleanPrompt);

    // make sure we have some spoken words
    if (spoken && spoken.length > 0) {
      // Loop through words from prompt to check for numbers
      spoken.forEach((word, index) => {
        // Check if spoke word matched prompt
        if (prompt.length > index && typeof prompt[index] !== 'undefined' && word === prompt[index]) {
          diff = diff.concat(`<span class="correct">${index === 0 ? (word.charAt(0).toUpperCase() + word.slice(1)) : word}</span> `);
        } else {
          incorrectCount++;
          diff = diff.concat(`<span class="incorrect" data-title="Correct Word: '${prompt[index]}'">${index === 0 ? (word.charAt(0).toUpperCase() + word.slice(1)) : word}</span> `);
        }
      });
    }

    // Show Quality
    let quality = '';

    // Check that we have words, and that we are no longer recording
    if (spoken && spoken.length > 0 && !this.props.isRecording) {
      quality = (incorrectCount === 0)
        ? '<i class="fas fa-check-square quality good" data-title="Perfection"></i>'
        : '<i class="fas fa-exclamation-triangle quality bad" data-title="Double Check Your Recorded Words. They might be correct, and we just heard it wrong."></i>';
    }

    // Render Diff
    return parse(`<div class="diff">${quality}${diff}</div>`);
  };

  tokenize = str => {
    if (typeof str !== 'string' || str === '') {
      return;
    }

    // Fix Acronyms that have periods
    str = str.replace(/(?<!\w)([A-Z])\./g, '$1');

    // Convert to Lower Case for future String Compare
    str = str.toLowerCase();

    // Fix Remaining Weird Issues
    str = str.replace(/[.,\/#!$%\^&\*;:"{}=\-_`~()\?]/g, ' '); // eslint-disable-line no-useless-escape
    str = str.replace(/\s+/g, ' ');

    const punctuation = '\\[\\!\\"\\#\\$\\%\\&\\\'\\(\\)\\*\\+\\,\\\\\\-\\.\\/\\:\\;\\<\\=\\>\\?\\@\\[\\]\\^\\_\\`\\{\\|\\}\\~\\]';
    const re = new RegExp('\\s*(\\.{3}|\\w+\\-\\w+|\\w+\'(?:\\w+)?|\\w+|[' + punctuation + '])');

    function grep(ary, filter) {
      var result = [];
      for (var i = 0, len = ary.length; i++ < len;) {
        var member = ary[i] || '';

        if (filter && (typeof filter === 'function') ? filter(member) : member) {
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
  promptNum: PropTypes.number,
  supported: PropTypes.bool,
  isRecording: PropTypes.bool
};

export default SpokenWords;
