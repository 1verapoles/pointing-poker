import {
  ADD_USER,
  INITIAL_DATA,
  CURRENT_USER, 
  INIT_ADMIN,
  START_GAME_ALL,
  CANCEL_GAME_ALL,
  EXIT_USER,
  ADD_ISSUE,
  DELETE_ISSUE,
  CHANGE_ISSUE,
  ADD_MESSAGE,
  ADD_PLAYING_CARD,
  KICK_USER_FINALLY
} from "./constants";


export const setInitialData = (initData) => {
  return {
    type: INITIAL_DATA,
    payload: initData
  }
};

export const setCurrentUser = (currentUser) => {
  return {
    type: CURRENT_USER,
    payload: currentUser
  }
};

export const initAdmin = (data) => {
  return {
    type: INIT_ADMIN,
    payload: data
  }
};

export const addUser = (userData) => {
  return {
    type: ADD_USER,
    payload: userData
  }
};

export const startGameAll = () => {
  return {
    type: START_GAME_ALL
  }
};

export const cancelGameAll = () => {
  return {
    type: CANCEL_GAME_ALL
  }
};

export const exitUser = (userId) => {
  return {
    type: EXIT_USER,
    payload: userId
  }
};

export const addIssue = (newIssue) => {
  return {
    type: ADD_ISSUE,
    payload: newIssue
  }
};

export const deleteIssue = (issueId) => {
  return {
    type: DELETE_ISSUE,
    payload: issueId
  }
};

export const changeIssue = (issueData) => {
  return {
    type: CHANGE_ISSUE,
    payload: issueData
  }
};

export const addMessage = (newMessage) => {
  return {
    type: ADD_MESSAGE,
    payload: newMessage
  }
};

export const addPlCard = (cardType) => {
  return {
    type: ADD_PLAYING_CARD,
    payload: cardType
  }
};

export const kickUserFinally = (userId) => {
  return {
    type: KICK_USER_FINALLY,
    payload: userId
  }
};

// export const fetchData = (url, id) => {
//   return dispatch => {
//     dispatch({ type: IS_LOADING })
//     fetch(url)
//       .then(response => response.json())
//       .then(json => {
//         dispatch({ type: FETCH_DETAIL, payload: json.articles[0] })
//         localStorage.setItem(id, JSON.stringify(json.articles[0]))
//         dispatch({ type: LOADED })
//       })
//       .catch(error => {
//         console.log(error)
//         dispatch({ type: LOADED })
//       })
//   }
// }

// export const fetchDataAll = url => {
//   return dispatch => {
//     dispatch({ type: IS_LOADING })
//     fetch(url)
//       .then(response => response.json())
//       .then(json => {
//         dispatch({ type: FETCH_CARDS, payload: json })
//         dispatch({ type: LOADED })
//       })
//       .catch(error => {
//         console.log(error)
//         dispatch({ type: LOADED })
//       })
//   }
// }