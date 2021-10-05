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
    KICK_USER_FINALLY,
    KICKING_USER,
    START_VOTING_ALL,
    DEALER_GETS_CARDS,
    CHANGE_CHOICE_CARD,
    CHANGE_TIMER,
    CHANGE_SCORE_TYPE,
    CHANGE_PLAYING_CARD,
    CHANGE_TIMER_VALUE,
    CHOOSE_ISSUE,
    CHOOSE_PLAYING_CARD,
    START_ROUND,
    CHOOSE_CARD_ALL,
    DONT_SHOW_RESULTS,
    NEW_GAME,
    CHANGE_ADMIT,
    CHANGE_ANSWER,
    CHANGE_PARTICIPANT
} from "./constants";
import socket from "../utils/socket";

export const initialState = {
    socket: socket,
    currentUser: {name: '', surname: '', position: '', id: '', img: '', letters: '', role: '', bgColor: '', room: '', isInLobby: false, isInGame: false, isKicked: false},
    users: [],
    issues: [],
    messages: [],
    roomId: "",
    gameId: "",
    currentRound: {},
    gameIsActive: false,
    gameHasStarted: false,
    gameEnded: false,
    kickingUser: {id: '', showModalR: false, ns: ''},
    votingData: {showModalR: false, voteId: '', ns: '', kickUserId: '', roomId: '', killer: ''},
        dealerGetsCards: false,
        cardType: 'UN',
        cardValues: [{id: '0', value:'unknown', isActive: false}],
        allowNewPlayersAfterGameStart: true,
        newParticipant: {},
        answer: '',
        gameBegin: false,
        autoFlipCards: false,
        timer: false,
        timerValue: 0,
        changeChoiceAfterFlipCard : false
};

 const reducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case CURRENT_USER:
            return { ...state, currentUser: payload};
            break;
            case INITIAL_DATA:
            return { ...state, users: [...state.users, ...payload.users], messages: [...state.messages, ...payload.messages], issues: [...state.issues, ...payload.issues], gameIsActive: payload.gameIsActive, gameId: payload.gameId, roomId: payload.roomId, gameHasStarted: payload.gameHasStarted,
              dealerGetsCards: payload.dealerGetsCards,  currentRound: payload.currentRound, gameBegin: payload.gameBegin,
              cardType: payload.cardType, cardValues: payload.cardValues, allowNewPlayersAfterGameStart: payload.allowNewPlayersAfterGameStart, autoFlipCards: payload.autoFlipCards, changeChoiceAfterFlipCard: payload.changeChoiceAfterFlipCard};
            break;
            case INIT_ADMIN:
            return { ...state, gameIsActive: payload.gameIsActive, gameId: payload.gameId, roomId: payload.roomId};
            break;
            case NEW_GAME:
              return initialState;
              break;
            case ADD_USER:
                return { ...state, users: [...state.users, payload]};
                break;
            case START_GAME_ALL:
                return { ...state, gameBegin: true, users: state.users.map((user) => {
                    if (user.isInLobby && !user.isKicked) {
                        return {
                            ...user,
                            isInLobby: false,
                            isInGame: true
                          }
                        } else {
                          return user;
                        }
                })};
                break;
                case CANCEL_GAME_ALL:
                return { ...state, gameIsActive: false, users: state.users.map((user) => {
                    if (user.isInLobby && !user.isKicked) {
                        return {
                            ...user,
                            isInLobby: false
                          }
                        } else {
                          return user;
                        }
                })};
                break;
                case EXIT_USER:
                    return { ...state, users: state.users.filter((user) => user.id !== payload)};
                    break;
                case ADD_ISSUE:
                      return { ...state, issues: [...state.issues, payload]};
                      break;
                     case DELETE_ISSUE:
                      return { ...state, issues: state.issues.filter((issue) => issue.id !== payload)};
                      break;   
                      case CHANGE_ISSUE:
                        return { ...state, issues: state.issues.map((issue) => {
                            if (issue.id === payload.issueId) {
                                return {
                                    ...issue,
                                    text: payload.newText
                                  }
                                } else {
                                  return issue;
                                }
                        })};
                        break;  
                        case CHOOSE_ISSUE:
                        return { ...state, currentRound: {}, cardValues: state.cardValues.map((cardValue) => {
                          if (cardValue.isActive) {
                              return {...cardValue, isActive: false};
                              } else {
                                return cardValue;
                              }
                      }),
                          issues: state.issues.map((issue) => {
                            if (issue.id === payload) {
                                return {
                                    ...issue,
                                    isActive: true,
                                    isResolved: false
                                  };
                                } else {
                                  return {
                                    ...issue,
                                    isActive: false
                                  };
                                }
                        })};
                        break; 
                        case ADD_MESSAGE:
                            return { ...state, messages: [...state.messages, payload]};
                         break; 
                         case ADD_PLAYING_CARD:
                         return { ...state, cardValues: [...state.cardValues, payload]};
                         break; 
                         case KICK_USER_FINALLY:
                          return { ...state, users: state.users.map((user) => {
                              if (user.id === payload) {
                                  return {
                                      ...user,
                                      isInLobby: false,
                                      isKicked: true
                                    }
                                  } else {
                                    return user;
                                  }
                          })};
                          case KICKING_USER:
                            return { ...state, kickingUser: payload};
                            break;
                            case START_VOTING_ALL:
                              return { ...state, votingData: payload};
                              break;
                              case START_ROUND:
                            return { ...state, gameHasStarted: true};
                            break;
                            case DONT_SHOW_RESULTS:
                            return { ...state, gameEnded: false};
                            break;
                              case DEALER_GETS_CARDS:
                                return { ...state, dealerGetsCards: payload};
                             break;
                             case CHANGE_ANSWER:
                              return { ...state, answer: payload};
                           break;
                           case CHANGE_PARTICIPANT:
                              return { ...state, newParticipant: payload};
                           break;
                             case CHANGE_ADMIT:
                              return { ...state, allowNewPlayersAfterGameStart: payload};
                           break;
                             case CHANGE_CHOICE_CARD:
                              return { ...state, changeChoiceAfterFlipCard: payload};
                              break;
                              case CHANGE_TIMER:
                                return { ...state, timer: payload};
                            break;
                            case CHANGE_TIMER_VALUE:
                                return { ...state, timerValue: payload};
                            break;
                            case CHANGE_SCORE_TYPE:
                           return { ...state, cardType: payload};
                          break;
                          case CHOOSE_PLAYING_CARD:
                        return { ...state, cardValues: state.cardValues.map((cV) => {
                            if (cV.id === payload) {
                                return {
                                    ...cV,
                                    isActive: true
                                  };
                                } else {
                                  return {
                                    ...cV,
                                    isActive: false
                                  };
                                }
                        })};
                        break; 
                        case CHOOSE_CARD_ALL:
                          return { ...state, gameHasStarted: false, gameEnded: payload.gameEnded, currentRound: payload.currentRound, issues: state.issues.map((issue) => {
                              if (issue.id === payload.currentIssue.id) {
                                  return {
                                      ...payload.currentIssue
                                    }
                                  } else {
                                    return issue;
                                  }
                          })};
                          break;  
                          case CHANGE_PLAYING_CARD:
                            return { ...state, cardValues: state.cardValues.map((cardValue) => {
                                if (cardValue.id === payload.id) {
                                    return {...cardValue, value: payload.value};
                                    } else {
                                      return cardValue;
                                    }
                            })};
        default:
            return state;
    }
};

export default reducer;