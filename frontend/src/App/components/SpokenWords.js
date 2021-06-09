import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
          diff = diff.concat(`<span class="incorrect" data-title="Correct Word: '${prompt[index]}'">${index === 0 ? (word.charAt(0).toUpperCase() + word.slice(1)) : word}</span> `);
        }
      });
    }

    // Show Quality
    let quality = '';

    // Check that we have words, and that we are no longer recording
    if (spoken.length > 0 && !this.props.isRecording) {
      quality = (incorrectCount === 0)
        ? '<i class="fas fa-check-square quality good" data-title="Perfection"></i>'
        : '<i class="fas fa-exclamation-triangle quality bad" data-title="Double Check Your Recorded Words. They might be correct, and we just heard it wrong."></i>';
    }

    // Render Diff
    return parse(`<div class="diff">${quality}${diff}</div>`);
  };

  remapSpeechToPrompt = str => {
    if (typeof str !== 'string') {
      return;
    }

    // Resolve as many of the Known Issues with weird promp text as we can
    if (this.props.promptNum === 9) {
      str = str.replace('organisation', 'organization');
    }
    else if (this.props.promptNum === 12) {
      str = str.replace('four point six billion years ago', '4 6 billion years ago');
    }
    else if (this.props.promptNum === 13) {
      str = str.replace('philip\'s', 'phillips');
    }
    else if (this.props.promptNum === 15) {
      str = str.replace('t n t', 'tnt');
    }
    else if (this.props.promptNum === 19) {
      str = str.replace('nineteen forty six', '1946');
      str = str.replace('two ninety three', '293');
      str = str.replace('v a', 'va');
    }
    else if (this.props.promptNum === 22) {
      str = str.replace('cart', 'kart');
    }
    else if (this.props.promptNum === 24) {
      str = str.replace('eighteen', '18');
    }
    else if (this.props.promptNum === 26) {
      str = str.replace('metal worker', 'metalworker');
    }
    else if (this.props.promptNum === 30) {
      str = str.replace('grayed', 'grade');
    }
    else if (this.props.promptNum === 34) {
      str = str.replace('krapps', 'craps');
    }
    else if (this.props.promptNum === 43) {
      str = str.replace('s e c', 'sec');
    }
    else if (this.props.promptNum === 51) {
      str = str.replace('there', 'they\'re');
      str = str.replace('ten', '10');
      str = str.replace('inches', 'in');
    }
    else if (this.props.promptNum === 56) {
      str = str.replace('eighteen twenty eight', '1828');
    }
    else if (this.props.promptNum === 67) {
      str = str.replace('hand held', 'handheld');
    }
    else if (this.props.promptNum === 69) {
      str = str.replace('seventeen ninety', '1790');
    }
    else if (this.props.promptNum === 70) {
      str = str.replace('midlevels', 'mid levels');
      str = str.replace('twenty', '20');
    }
    else if (this.props.promptNum === 71) {
      str = str.replace('six hundred', '600');
      str = str.replace('ft', 'feet');
    }
    else if (this.props.promptNum === 73) {
      str = str.replace('g i', 'gi');
      str = str.replace('eighteen sixty two', '1862');
    }
    else if (this.props.promptNum === 74) {
      str = str.replace('world war two', 'world war ii');
      str = str.replace('postwar', 'post war');
    }
    else if (this.props.promptNum === 77) {
      str = str.replace('twenty thousand', '20000');
    }
    else if (this.props.promptNum === 83) {
      str = str.replace('u s', 'us');
    }
    else if (this.props.promptNum === 84) {
      str = str.replace('u s', 'us');
    }
    else if (this.props.promptNum === 85) {
      str = str.replace('travelling', 'traveling');
    }
    else if (this.props.promptNum === 89) {
      str = str.replace('eighteen', '18');
    }
    else if (this.props.promptNum === 90) {
      str = str.replace('fifteen thousand five hundred', '15500');
    }
    else if (this.props.promptNum === 91) {
      str = str.replace('newgate', 'new gate');
    }
    else if (this.props.promptNum === 92) {
      str = str.replace('u s', 'us');
      str = str.replace('p o w s', 'pows');
    }
    else if (this.props.promptNum === 94) {
      str = str.replace('u s', 'us');
    }
    else if (this.props.promptNum === 97) {
      str = str.replace('one thousand two hundred', '1200');
    }
    else if (this.props.promptNum === 99) {
      str = str.replace('seventeen', '17');
    }
    else if (this.props.promptNum === 106) {
      str = str.replace('nine point two four', '9 24');
    }
    else if (this.props.promptNum === 108) {
      str = str.replace('twenty-ninth', '29th');
      str = str.replace('eighteen oh nine', '1809');
    }
    else if (this.props.promptNum === 113) {
      str = str.replace('forty nine', '49');
    }
    else if (this.props.promptNum === 116) {
      str = str.replace('three', '3');
    }
    else if (this.props.promptNum === 117) {
      str = str.replace('nineteen seventy five', '1975');
    }
    else if (this.props.promptNum === 119) {
      str = str.replace('five', '5');
    }
    else if (this.props.promptNum === 127) {
      str = str.replace('on to', 'onto');
      str = str.replace('shoot', 'chute');
    }
    else if (this.props.promptNum === 129) {
      str = str.replace('phillips', 'philips');
    }
    else if (this.props.promptNum === 130) {
      str = str.replace('nineteen thirty eight', '1938');
      str = str.replace('one hundred eight thousand two hundred forty', '100 8240');
      str = str.replace('thirty nine thousand ninety six', '39096');
    }
    else if (this.props.promptNum === 133) {
      str = str.replace('debra', 'deborah');
    }
    else if (this.props.promptNum === 137) {
      str = str.replace('cyclocopter', 'cyclo copter');
    }
    else if (this.props.promptNum === 140) {
      str = str.replace('cheque', 'check');
      str = str.replace('eight hundred', '800');
    }
    else if (this.props.promptNum === 141) {
      str = str.replace('its', 'it\'s');
    }
    else if (this.props.promptNum === 143) {
      str = str.replace('eighteen twenty-eight', '1828');
    }
    else if (this.props.promptNum === 146) {
      str = str.replace(/twenty fourteen/g, '2014');
    }
    else if (this.props.promptNum === 160) {
      str = str.replace('work rooms', 'workrooms');
    }
    else if (this.props.promptNum === 162) {
      str = str.replace('t b m s', 'tbms');
    }
    else if (this.props.promptNum === 169) {
      str = str.replace('theatre', 'theater');
    }
    else if (this.props.promptNum === 173) {
      str = str.replace('karl', 'carl');
    }
    else if (this.props.promptNum === 176) {
      str = str.replace('eighteen sixty two', '1862');
    }
    else if (this.props.promptNum === 180) {
      str = str.replace('four forty', '4 40');
    }
    else if (this.props.promptNum === 190) {
      str = str.replace('tenth', '10th');
      str = str.replace('benavides', 'benavidez');
    }
    else if (this.props.promptNum === 191) {
      str = str.replace('three', '3');
      str = str.replace('four', '4');
    }
    else if (this.props.promptNum === 197) {
      str = str.replace('housebreakers', 'house breakers');
    }
    else if (this.props.promptNum === 199) {
      str = str.replace('u s', 'us');
      str = str.replace('f b i', 'fbi');
    }
    else if (this.props.promptNum === 201) {
      str = str.replace('macintosh\'s', 'mcintosh\'s');
      str = str.replace('lords', 'lord\'s');
    }
    else if (this.props.promptNum === 203) {
      str = str.replace('twenty fifteen', '2015');
    }
    else if (this.props.promptNum === 204) {
      str = str.replace(/u s/g, 'us');
    }
    else if (this.props.promptNum === 218) {
      str = str.replace('u s', 'us');
    }
    else if (this.props.promptNum === 219) {
      str = str.replace('thirty', '30');
      str = str.replace('nineteen sixty-two', '1962');
    }
    else if (this.props.promptNum === 222) {
      str = str.replace('principals', 'principles');
      str = str.replace('insure', 'ensure');
    }
    else if (this.props.promptNum === 223) {
      str = str.replace('seventy two thousand five hundred', '72500');
    }
    else if (this.props.promptNum === 224) {
      str = str.replace('state side', 'stateside');
    }
    else if (this.props.promptNum === 227) {
      str = str.replace('eleven', '11');
      str = str.replace('five eighty six', '586');
    }
    else if (this.props.promptNum === 230) {
      str = str.replace('f m', 'fm');
    }
    else if (this.props.promptNum === 239) {
      str = str.replace('sheriffs', 'sheriff\'s');
    }
    else if (this.props.promptNum === 244) {
      str = str.replace('one hundred and fifty centimeters', '150 cm');
    }
    else if (this.props.promptNum === 245) {
      str = str.replace('twenty seventh', '27th');
      str = str.replace('eighteen sixty nine', '1869');
    }
    else if (this.props.promptNum === 246) {
      str = str.replace('eight', '8');
      str = str.replace('v t', 'vt');
    }
    else if (this.props.promptNum === 249) {
      str = str.replace('six pence', 'sixpence');
    }

    /*
    else if (this.props.promptNum === XX) {
      str = str.replace('', '');
    }
    */

    return str;
  }

  tokenize = str => {
    if (typeof str !== 'string') {
      return;
    }

    str = str.toLowerCase();
    str = str.replace(/[.,\/#!$%\^&\*;:"{}=\-_`~()]/g, ' ');
    str = str.replace(/\s+/g, ' ');

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
  promptNum: PropTypes.number,
  supported: PropTypes.bool,
  isRecording: PropTypes.bool
};

export default SpokenWords;
