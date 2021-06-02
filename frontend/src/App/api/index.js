const apiRoot = 'http://localhost:5000';

export const postAudio = (audio, prompt) => {
  return fetch(`${apiRoot}/api/audio/?uuid=default_user&prompt=${prompt}`, {
    method: 'POST',
    body: audio,
    headers: {
      'Content-Type': 'audio/wav'
    }
  })
};

export const getPrompt = () => {
  return fetch(`${apiRoot}/api/prompt/?uuid=default_user`, {
    method: 'GET'
  });
};

export const getUser = () => {
  return fetch(`${apiRoot}/api/user/?uuid=default_user`, {
    method: 'GET'
  })
}

export const getAudioLen = (audio) => {
  return fetch(`${apiRoot}/api/audio/?uuid=default_user&get_len=True`, {
    method: 'POST',
    body: audio,
    headers: {
      'Content-Type': 'audio/wav'
    }
  })
}

export const createUser = () => {
  const data = {
    uuid: 'default_user',
    user_name: 'Default User'
  }

  return fetch(`${apiRoot}/api/user/`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
}
