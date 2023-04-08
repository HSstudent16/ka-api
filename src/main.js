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
  },
  "scratchpad": {
    url: "https://www.khanacademy.org/api/internal/graphql/programQuery",
    method: "POST",
    needed: [
      "programId"
    ],
    operationName: "programQuery",
    query: `query programQuery($programId: String!) {
      programById(id: $programId) {
        byChild
        created
        creatorProfile: author {
          id
          nickname
          profileRoot
        }
        deleted
        description
        spinoffCount: displayableSpinoffCount
        docsUrlPath
        flags
        flaggedBy: flaggedByKaids
        flaggedByUser: isFlaggedByCurrentUser
        height
        hideFromHotlist
        id
        imagePath
        isProjectOrFork: originIsProject
        isOwner
        kaid: authorKaid
        newUrlPath
        originScratchpad: originProgram {
          deleted
          translatedTitle
          url
        }
        revision: latestRevision {
          id
          code
          configVersion
          created
          editorType
          folds
        }
        slug
        sumVotesIncremented
        title
        translatedTitle
        url
        width
      }
    }`
  }
};

// fetch("https://www.khanacademy.org/api/internal/graphql/programQuery?lang=en&_=230407-1158-197d4a174633_1680919299569", {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "en-US,en;q=0.9",
//     "content-type": "application/json",
//     "sec-ch-ua": "\"Chromium\";v=\"111\", \"Not(A:Brand\";v=\"8\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"Linux\"",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin",
//     "x-ka-fkey": "1.0_1r2hvd31ne6io93oe1bt726nq8v13gbqefp6m09u233odt7i1bkjo1opii96k351iuhf_1680914900253"
//   },
//   "referrer": "https://www.khanacademy.org/computer-programming/wip/5684846702936064",
//   "referrerPolicy": "strict-origin-when-cross-origin",
//   "body": "{\"operationName\":\"programQuery\",\"query\":\"query programQuery($programId: String!) {\\n  programById(id: $programId) {\\n    byChild\\n    category\\n    created\\n    creatorProfile: author {\\n      id\\n      nickname\\n      profileRoot\\n      profile {\\n        accessLevel\\n        __typename\\n      }\\n      __typename\\n    }\\n    deleted\\n    description\\n    spinoffCount: displayableSpinoffCount\\n    docsUrlPath\\n    flags\\n    flaggedBy: flaggedByKaids\\n    flaggedByUser: isFlaggedByCurrentUser\\n    height\\n    hideFromHotlist\\n    id\\n    imagePath\\n    isProjectOrFork: originIsProject\\n    isOwner\\n    kaid: authorKaid\\n    key\\n    newUrlPath\\n    originScratchpad: originProgram {\\n      deleted\\n      translatedTitle\\n      url\\n      __typename\\n    }\\n    restrictPosting\\n    revision: latestRevision {\\n      id\\n      code\\n      configVersion\\n      created\\n      editorType\\n      folds\\n      __typename\\n    }\\n    slug\\n    sumVotesIncremented\\n    title\\n    topic: parentCurationNode {\\n      id\\n      nodeSlug: slug\\n      relativeUrl\\n      slug\\n      translatedTitle\\n      __typename\\n    }\\n    translatedTitle\\n    url\\n    userAuthoredContentType\\n    upVoted\\n    width\\n    __typename\\n  }\\n}\\n\",\"variables\":{\"programId\":\"5684846702936064\"}}",
//   "method": "POST",
//   "mode": "cors",
//   "credentials": "include"
// });

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
