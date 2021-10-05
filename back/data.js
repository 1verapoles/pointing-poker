let users = [];
let messages = [];
let issues = [];
let roomId = '';
let gameId = '';
let gameIsActive = false;
let gameHasStarted = false;
let gameEnded = false;
let dealerGetsCards = false;
let cardType = 'UN';
let cardValues = [{id: '0', value:'unknown', isActive: false}];
let allowNewPlayersAfterGameStart = true;
let newParticipant = {};
let answer = '';
let gameBegin = false;
let autoFlipCards = false;
let changeChoiceAfterFlipCard = false;
let timer = false;
let timerValue = 0;
let votes = {};
let currentRound = {};

const getInitialData = () => {
    return {gameIsActive, gameId, roomId, gameHasStarted, users, messages, issues, gameEnded, dealerGetsCards,
         cardType, cardValues, allowNewPlayersAfterGameStart, autoFlipCards, currentRound, gameBegin};
};

const initAdmin = ({gameId: gameId1, roomId: roomId1, gameIsActive: gameIsActive1}) => {
    gameId = gameId1;
    roomId = roomId1;
    gameIsActive = gameIsActive1;
    console.log(gameId);
};

const addUser = currentUser => {
    users.push(currentUser);
    console.log(users);
};

const addIssue = newIssue => {
    issues.push(newIssue);
    console.log(issues);
};

const deleteIssue = (issueId) => {
    let issueIndex = issues.findIndex((issue) => {return issue.id === issueId});
    issues.splice(issueIndex, 1);
    console.log(issues);
};

const changeIssue = (issueId, newText) => {
    issues.forEach((issue) => {
        if (issue.id === issueId) {
            issue.text = newText;
        }
    });
    console.log(issues);
};

const chooseIssue = (issueId) => {
    currentRound = {};
    cardValues.forEach(i => {if (i.isActive) {i.isActive = false;}});
    issues.forEach((issue) => {
        if (issue.id === issueId) {
            issue.isActive = true;
            issue.isResolved = false;
        } else {
            issue.isActive = false; 
        }
    });
    console.log(issues);
};

const startGame = () => {
    gameBegin = true;
    users.forEach((user) => {
        if (user.isInLobby && !user.isKicked) {
            user.isInLobby = false;
            user.isInGame = true;
        }
    });
    console.log(users);
};

const cancelGame = () => {
    gameIsActive = false;
    users.forEach((user) => {
        if (user.isInLobby && !user.isKicked) {
            user.isInLobby = false;
        }
    });
    console.log(users);
};

const exit = (currentUserId) => {
    let currentUserIndex = users.findIndex((user) => {return user.id === currentUserId});
    users.splice(currentUserIndex, 1);
    console.log(users);
};

const checkGameId = inputGameId => {
    if (inputGameId === gameId) {
        return true;
    } else {
        return false;
    }
};

const dealerGetsCards1 = (dealerCards) => {
    dealerGetsCards = dealerCards;
};

const changeAdmit = (admit) => {
    allowNewPlayersAfterGameStart = admit;
};

const changeAnswer = (answer1) => {
    answer = answer1;
};

const changeParticipant = (participant) => {
    newParticipant = participant;    
    console.log('partic', newParticipant);
};

const changeChoiceAfterFlipCard1 = (changed) => {
    changeChoiceAfterFlipCard = changed;
};

const changeTimer1 = (timer1) => {
    timer = timer1;
};

const changeTimerValue1 = (timerValue1) => {
    timerValue = timerValue1;
};

const changeScoreType1 = (scoreTypeSh) => {
    cardType = scoreTypeSh;
};


const addMessage = newMessage => {
    messages.push(newMessage);
    console.log(messages);
};

const startRound1 = () => {
  gameHasStarted = true;
};

const getUsersLength = () => {
    return users.length;
};

const startVoting = (voteId, kickUserId) => {
    votes[voteId] = {kickUserId, isFinished: false, yes: 0, no: 0};
};

const checkVotingResult = (voteId, vote, kickUserId) => {
    if (votes[voteId].isFinished) {return;}
    if (vote === 'yes') {votes[voteId].yes = votes[voteId].yes + 1;}
    if (vote === 'no') {votes[voteId].no = votes[voteId].no + 1;}
    if ((votes[voteId].yes - 1) >= (users.length / 2)) {
        votes[voteId].isFinished = true;
        let userIndex = users.findIndex((user) => {return user.id === kickUserId});
        if (userIndex >= 0) {users.splice(userIndex, 1);}
        return true;}
    if (((votes[voteId].yes + votes[voteId].no) / users.length) > 0.84) {votes[voteId].isFinished = true; return;}
    console.log(votes);
};

const getUser = id => {
    let user = users.find(user => user.id == id)
    return user
};

const deleteUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) return users.splice(index, 1)[0];
};

const getRoundResults = (issueId, userId, cardChoice, cdType, dealerGetsCards) => {
    let currentIssue = issues.find(issue => issue.id === issueId);
    if (currentIssue && currentIssue.isResolved) {return;}
    let usersInGame = users.filter(user => {
        if (dealerGetsCards) {
        return user.isInGame && user.role !== "observer";
        } else {
        return user.isInGame && user.role === "player";
        }
    });
    currentRound[userId] = cardChoice;
    console.log(8, currentRound);
    let currentRoundUsers = Object.keys(currentRound);
    let stat;
    if (usersInGame.length === currentRoundUsers.length) {
        currentIssue.isResolved = true;
        gameHasStarted = false;
        stat = currentRoundUsers.reduce((res, item) => {
            let newCard = currentRound[item];
            if ( newCard in res) {
                return {...res, [newCard]: res[newCard] + 1};   
            } else {
                return {...res, [newCard]: 1};
            }
        }, {});
        let sum = Object.values(stat).reduce((acc, i) => acc + i, 0);
        Object.keys(stat).forEach(i => {stat[i] = (stat[i] / sum * 100).toFixed(2)});
        currentIssue.stat = stat;
        currentIssue.cardType = cdType;
        if (issues.every(issue => issue.isResolved)) {gameEnded = true;}
        console.log(2, currentIssue,3,currentRound);
        return {currentIssue, currentRound, gameEnded};
    }
};

const addPlCard1 = plV => {
    cardValues.push(plV);
    console.log(cardValues);
};

const changePlCard = (plCardId, newVal) => {
    cardValues.forEach((cd) => {
        if (cd.id === plCardId) {
            cd.value = newVal;
        }
    });
    console.log(cardValues);
};

const newGame = () => {
     users = [];
     messages = [];
     issues = [];
     roomId = '';
     gameId = '';
     gameIsActive = false;
     gameHasStarted = false;
     gameEnded = false;
     dealerGetsCards = false;
     cardType = 'UN';
     cardValues = [{id: '0', value:'unknown', isActive: false}];
     allowNewPlayersAfterGameStart = false;
     autoFlipCards = false;
     changeChoiceAfterFlipCard = false;
     timer = false;
     gameBegin = false;
     timerValue = 0;
     votes = {};
     currentRound = {};
};

const getUsers = (room) => users.filter(user => user.room === room)

module.exports = { getInitialData, initAdmin, checkGameId, addUser, getUser, deleteUser, getUsers, startGame,
     cancelGame, exit, addIssue, deleteIssue, changeIssue, addMessage, getUsersLength, startVoting,
      checkVotingResult, dealerGetsCards1, changeChoiceAfterFlipCard1, changeTimer1, changeScoreType1,
      changeAnswer, addPlCard1, changePlCard, changeTimerValue1, chooseIssue, getRoundResults, startRound1,
       newGame, changeAdmit, changeParticipant}
