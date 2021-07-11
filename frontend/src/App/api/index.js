const apiRoot = `http://localhost:${process.env.MRS_PORT_BACKEND}`;

export const postAudio = (audio, prompt) => {
  return fetch(`${apiRoot}/api/audio/?uuid=${process.env.MRS_USERNAME}&prompt=${prompt}`, {
    method: 'POST',
    body: audio,
    headers: {
      'Content-Type': 'audio/wav'
    }
  })
};

export const getPrompt = () => {
  return fetch(`${apiRoot}/api/prompt/?uuid=${process.env.MRS_USERNAME}`, {
    method: 'GET'
  });
};

export const getUser = () => {
  return fetch(`${apiRoot}/api/user/?uuid=${process.env.MRS_USERNAME}`, {
    method: 'GET'
  })
}

export const getAudioLen = (audio) => {
  return fetch(`${apiRoot}/api/audio/?uuid=${process.env.MRS_USERNAME}&get_len=True`, {
    method: 'POST',
    body: audio,
    headers: {
      'Content-Type': 'audio/wav'
    }
  })
}

export const createUser = () => {
  const data = {
    uuid: process.env.MRS_USERNAME,
    user_name: process.env.MRS_USERNAME
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
