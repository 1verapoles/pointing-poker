const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const cors = require('cors')
const PORT = process.env.PORT || 5000
const { getInitialData, initAdmin, checkGameId, addUser, getUser, deleteUser, getUsers, startGame, cancelGame,
     exit, addIssue, deleteIssue, changeIssue, addMessage, getUsersLength, startVoting, checkVotingResult,
     dealerGetsCards1, changeChoiceAfterFlipCard1, changeTimer1, changeScoreType1, addPlCard1, changePlCard, changeTimerValue1,
     chooseIssue, getRoundResults, startRound1, newGame, changeAdmit, changeAnswer, changeParticipant } = require('./data')


app.use(cors())

io.on('connection', (socket) => {
    socket.on('addUser', currentUser => {
        addUser(currentUser);
        socket.join(currentUser.room)
        // socket.in(roomId).emit('notification', { title: 'Someone\'s here', description: `${currentUser.name} ${currentUser.surname} just entered the room` })
        io.in(currentUser.room).emit('addNewUser', currentUser);
    });

    socket.on('initialData', cb => {
        cb(getInitialData());
    });

    socket.on('initAdmin', data => {
        initAdmin(data);
    });

    socket.on('checkGameId', (inputGameId, cb) => {
        cb(checkGameId(inputGameId));
    });

    socket.on('startGame', (roomId) => {
        startGame();
        io.in(roomId).emit('startGameAll');
    });

    socket.on('cancelGame', (roomId) => {
        cancelGame();
        io.in(roomId).emit('cancelGameAll');
    });

    socket.on('exit', (currentUserId, roomId) => {
        exit(currentUserId);
        io.in(roomId).emit('exitUser', currentUserId);
    });

    socket.on('addIssue', (roomId, newIssue) => {
        addIssue(newIssue);
         io.in(roomId).emit('addNewIssue', newIssue);
    });

    socket.on('deleteIssue', (issueId, roomId) => {
        deleteIssue(issueId);
        io.in(roomId).emit('deleteIssueFromList', issueId);
    });

    socket.on('changeIssue', (issueId, roomId, newText) => {
        changeIssue(issueId, newText);
        io.in(roomId).emit('changeIssueText', issueId, newText);
    });

    socket.on('chooseIssue', (issueId, roomId) => {
        chooseIssue(issueId);
        io.in(roomId).emit('chooseIssueAll', issueId);
    });

    socket.on('addMessage', (newMessage, roomId) => {
        addMessage(newMessage);
         io.in(roomId).emit('addNewMessage', newMessage);
    });

    socket.on('startVoting', (voteId, ns, kickUserId, roomId, killer) => {
        startVoting(voteId, kickUserId);
         io.in(roomId).emit('startVotingAll', voteId, ns, kickUserId, roomId, killer);
    });

    socket.on('votingResults', (voteId, kickUserId, roomId, vote) => {
      if  (checkVotingResult(voteId, vote, kickUserId)) {
         io.in(roomId).emit('kickUserFinally', kickUserId);
      }
    });

    socket.on('dealerGetsCards', (roomId, dealerCards) => {
        dealerGetsCards1(dealerCards);
         io.in(roomId).emit('dealerGetsCardsAll', dealerCards);
    });

    socket.on('changeAdmit', (roomId, admit) => {
        changeAdmit(admit);
         io.in(roomId).emit('changeAdmitAll', admit);
    });

    socket.on('changeAnswer', (roomId, answer) => {
        changeAnswer(answer);
        //  io.in(roomId).emit('changeAnswerAll', answer);
        io.emit('changeAnswerAll', answer);
    });

    socket.on('changeParticipant', (roomId, participant) => {
        changeParticipant(participant);
        //  io.in(roomId).emit('changeParticipantAll', participant);
         io.emit('changeParticipantAll', participant);
    });

    socket.on('changeChoiceAfterFlipCard', (roomId, changed) => {
        changeChoiceAfterFlipCard1(changed);
         io.in(roomId).emit('changeChoiceAfterFlipCardAll', changed);
    });

    socket.on('changeTimer', (roomId, timer) => {
        changeTimer1(timer);
         io.in(roomId).emit('changeTimerAll', timer);
    });

    socket.on('changeTimerValue', (roomId, timerValue) => {
        changeTimerValue1(timerValue);
         io.in(roomId).emit('changeTimerValueAll', timerValue);
    });

    socket.on('changeScoreType', (roomId, scoreTypeSh) => {
        changeScoreType1(scoreTypeSh);
         io.in(roomId).emit('changeScoreTypeAll', scoreTypeSh);
    });

    socket.on('addPlCard', (roomId, plV) => {
        addPlCard1(plV);
         io.in(roomId).emit('addPlCardAll', plV);
    });

    socket.on('changePlCard', (plCardId, roomId, newVal) => {
        changePlCard(plCardId, newVal);
        io.in(roomId).emit('changePlCardAll', plCardId, newVal);
    });

    socket.on('chooseCard', (roomId, issueId, userId, cardChoice, cdType, dealerGetsCards) => {
        let res = getRoundResults(issueId, userId, cardChoice, cdType, dealerGetsCards);
        if (res) {
        io.in(roomId).emit('chooseCardAll', res);}
    });

    socket.on('sendMessage', message => {
        const user = getUser(socket.id)
        io.in(user.room).emit('message', { user: user.name, text: message });
    });

    socket.on('startRound', (roomId) => {
        startRound1();
        io.in(roomId).emit('startRoundAll');
    });

    socket.on('dontShowResults', (roomId) => {
        io.in(roomId).emit('dontShowResultsAll');
    });

      socket.on('stopGame', (roomId) => {
        io.in(roomId).emit('stopGameAll');
    });

    socket.on('newGame', (roomId) => {
        newGame();
        io.in(roomId).emit('newGameAll');
    });


    socket.on('getID', cb => {
        cb(socket.id);
    })

    socket.on("disconnect", () => {
        console.log("User disconnected");
        const user = deleteUser(socket.id)
        if (user) {
            io.in(user.room).emit('notification', { title: 'Someone just left', description: `${user.name} just left the room` })
            io.in(user.room).emit('users', getUsers(user.room))
        }
    })
})

app.get('/', (req, res) => {
    res.send("Server is up and running")
})

http.listen(PORT, () => {
    console.log(`Listening to ${PORT}`);
})