const requestData = {
  "profile": {
    url: "https://www.khanacademy.org/api/internal/graphql/getFullUserProfile",
    method: "POST",
    needed: [
      "kaid", "username"
    ],
    operationName: "getFullUserProfile",
    query: `query getFullUserProfile($kaid: String, $username: String) {
      user(kaid: $kaid, username: $username) {
        kaid
        username
        profileRoot
        nickname
        hideVisual
        joined
        points
        countVideosCompleted
        bio
        badgeCounts
      }
    }`    
  }
};

const failMessage = JSON.stringify({
  failed: true,
  body: {}
});

function handleResponse (response) {
  if (!response.ok) {
    return postMessage(failMessage);
  }
  postMessage(JSON.stringify({
    failed: false,
    body: response.body,
    sender: response.url
  });
}

function handleError (response) {
  postMessage(failMessage);
}

function handleMessage (data) {
  let requestType = data.type ?? "profile";
  let requestTemplate = requestData[requestType];
  
  if (!requestTemplate) 
  
  let variables = {};
  
  for (let i = 0; i < requestTemplate.needed.length; i++) {
    let options = requestTemplate.needed[i];
    if (i in data) {
      variables[i] = data[i];
    }
  }
  
  fetch(requestTemplate.url, {
    method: requestTemplate.method,
    body: JSON.stringify({
      operationName: requestTemplate.operationName,
      variables: variables,
      query: requestTemplate.query
    })
  })
    .then(handleResponse)
    .error(handleError);  
}

addEventListener("message", handleMessage);
