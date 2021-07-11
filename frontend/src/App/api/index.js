const MRS_PORT_BACKEND = process.env.REACT_APP_MRS_PORT_BACKEND ? process.env.REACT_APP_MRS_PORT_BACKEND : 5000;
const MRS_USERNAME = process.env.REACT_APP_MRS_USERNAME ? process.env.REACT_APP_MRS_USERNAME : 'default_user';

const apiRoot = `http://localhost:${MRS_PORT_BACKEND}`;

export const postAudio = (audio, prompt) => {
  return fetch(`${apiRoot}/api/audio/?uuid=${MRS_USERNAME}&prompt=${prompt}`, {
    method: 'POST',
    body: audio,
    headers: {
      'Content-Type': 'audio/wav'
    }
  })
};

export const getPrompt = () => {
  return fetch(`${apiRoot}/api/prompt/?uuid=${MRS_USERNAME}`, {
    method: 'GET'
  });
};

export const getUser = () => {
  return fetch(`${apiRoot}/api/user/?uuid=${MRS_USERNAME}`, {
    method: 'GET'
  })
}

export const getAudioLen = (audio) => {
  return fetch(`${apiRoot}/api/audio/?uuid=${MRS_USERNAME}&get_len=True`, {
    method: 'POST',
    body: audio,
    headers: {
      'Content-Type': 'audio/wav'
    }
  })
}

export const createUser = () => {
  const data = {
    uuid: MRS_USERNAME,
    user_name: MRS_USERNAME
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
