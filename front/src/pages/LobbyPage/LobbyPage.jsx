import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Row, Col, Button, Modal, Form, Toast } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { v4 } from 'uuid';
import {startGameAll, cancelGameAll, exitUser, addIssue, deleteIssue, changeIssue, addMessage, kickUserFinally, addPlCard} from '../../redux/actions';
import {START_VOTING_ALL, KICKING_USER, CHANGE_ADMIT, DEALER_GETS_CARDS, CHANGE_CHOICE_CARD, CHANGE_TIMER, CHANGE_SCORE_TYPE, CHANGE_TIMER_VALUE, CHANGE_PLAYING_CARD} from '../../redux/constants';
import UserCard from '../../components/UserCard/UserCard';
import Issue from '../../components/Issue/Issue';
import CreateIssue from '../../components/CreateIssue/CreateIssue';
import PlayingCard from '../../components/PlayingCard/PlayingCard';
import CreatePlayingCard from '../../components/CreatePlayingCard/CreatePlayingCard';
import Chat from '../../components/Chat/Chat';
import sortFunction from '../../utils/sortFunction';
import "./LobbyPage.scss";

const LobbyPage = () => {
  const role = useSelector(state => state.currentUser.role);
  const gameId = useSelector(state => state.gameId);
  const issues = useSelector(state => state.issues.sort(sortFunction));
  const admin = useSelector(state => state.users.find(user => user.role === "admin"));
  const link = `http://localhost:3000/?id=${gameId}`; 
  const socket = useSelector(state => state.socket); 
  const roomId = useSelector(state => state.roomId);
  const usersInLobby = useSelector(state => state.users.filter((user) => user.isInLobby));
  const currentUserId = useSelector(state => state.currentUser.id);
  const currentUserName = useSelector(state => state.currentUser.name);
  const currentUserSurname = useSelector(state => state.currentUser.surname);
  const dealerGetsCards = useSelector(state => state.dealerGetsCards);
  const changeChoiceAfterFlipCard = useSelector(state => state.changeChoiceAfterFlipCard);
  const allowNewPlayersAfterGameStart = useSelector(state => state.allowNewPlayersAfterGameStart);
  // const timer = useSelector(state => state.timer);
  const show = useSelector(state => state.kickingUser.showModalR);
  const ns = useSelector(state => state.kickingUser.ns);
  const kickUserId = useSelector(state => state.kickingUser.id);
  const votingData = useSelector(state => state.votingData);
  const cardValues = useSelector(state => state.cardValues);
  const dispatch = useDispatch();
  const [showA, setShowA] = useState(false);
  const [scoreType, setScoreType] = useState("");
  const [scoreTypeSh, setScoreTypeSh] = useState("");
  // const [timerValueL, setTimerValueL] = useState("");
  let history = useHistory();

  useEffect(() => {
    socket.on('startGameAll', () => {
      dispatch(startGameAll());
      history.push('/game');
  });
  }, []);

  useEffect(() => {
    socket.on('cancelGameAll', () => {
      dispatch(cancelGameAll());
  }); 
  socket.on('deleteIssueFromList', (issueId) => {
    dispatch(deleteIssue(issueId));
  });
  socket.on('changeIssueText', (issueId, newText) => {
    dispatch(changeIssue({issueId, newText}));
  });
  socket.on('addNewMessage', (newMessage) => {
    dispatch(addMessage(newMessage));
  });
  socket.on('startVotingAll', (voteId, ns, kickUserId, roomId, killer) => {
    dispatch({type: START_VOTING_ALL, payload: {showModalR: true, voteId, ns, kickUserId, roomId, killer}});
  });
  socket.on('kickUserFinally', (userId) => {
    dispatch(kickUserFinally(userId));
  });
  socket.on('dealerGetsCardsAll', (dealerCards1) => {
    dispatch({type: DEALER_GETS_CARDS, payload: dealerCards1});
  });
  socket.on('changeAdmitAll', (admit) => {
    dispatch({type: CHANGE_ADMIT, payload: admit});
  });
  socket.on('changeChoiceAfterFlipCardAll', (changeChoiceAfterFlipCard1) => {
    dispatch({type: CHANGE_CHOICE_CARD, payload: changeChoiceAfterFlipCard1});
  });
  socket.on('changeTimerAll', (timer1) => {
    dispatch({type: CHANGE_TIMER, payload: timer1});
  });
  socket.on('changeTimerValueAll', (timerValue1) => {
    dispatch({type: CHANGE_TIMER_VALUE, payload: timerValue1});
  });
  socket.on('changeScoreTypeAll', (scoreTypeSh1) => {
    dispatch({type: CHANGE_SCORE_TYPE, payload: scoreTypeSh1});
  });
  socket.on('addPlCardAll', (plCard) => {
    dispatch(addPlCard(plCard));
  });
  socket.on('changePlCardAll', (plCardId, newVal) => {
    dispatch({type: CHANGE_PLAYING_CARD, payload: {id: plCardId, value: newVal}});
  });
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
  }; 

  const startGame = () => {
    socket.emit('startGame', roomId);
  };

  const cancelGame = () => {
    socket.emit('cancelGame', roomId);
    setShowA(true);
  };

  const exit = () => {
    socket.emit('exit', currentUserId, roomId);
    // socket.disconnect();
  };

  const toggleShowA = () => setShowA(!showA);

  
  const handleCloseCancel = () => {
    dispatch({type: KICKING_USER, payload: {id: "", ns: "", showModalR: false}}); 
  };

  const handleClose = () => { 
    let voteId = v4();  
    socket.emit('startVoting', voteId, ns, kickUserId, roomId, `${currentUserName} ${currentUserSurname}`);
    dispatch({type: KICKING_USER, payload:{id: "", ns: "", showModalR: false}}); 
  };

  const handleCloseCancel1 = () => {
    socket.emit('votingResults', votingData.voteId, votingData.kickUserId, roomId, 'no');
    dispatch({type: START_VOTING_ALL, payload: {showModalR: false, voteId: '', ns: '', kickUserId: '', roomId: '', killer: ''}}); 
  };

  const handleClose1 = () => { 
    socket.emit('votingResults', votingData.voteId, votingData.kickUserId, roomId, 'yes');
    dispatch({type: START_VOTING_ALL, payload: {showModalR: false, voteId: '', ns: '', kickUserId: '', roomId: '', killer: ''}}); 
  };

  const changeDealerGetsCards = () => {
    socket.emit('dealerGetsCards', roomId, !dealerGetsCards);
  };

  const changeAdmit = () => {
    socket.emit('changeAdmit', roomId, !allowNewPlayersAfterGameStart);
  };

  const changeChoiceAfterFlipCardHandler = () => {
    socket.emit('changeChoiceAfterFlipCard', roomId, !changeChoiceAfterFlipCard);
  };

  // const changeTimer = () => {
  //   socket.emit('changeTimer', roomId, !timer);
  // };

  // const changeTimerValue = ({target:{value}}) => {
  //   setTimerValueL(value);
  // };

  // const changeTimerValueBlur = () => {    
  //   socket.emit('changeTimerValue', roomId, +timerValueL);
  // };

  const changeScoreType = ({target:{value}}) => {
    setScoreType(value);
  };

  const changeScoreTypeSh = ({target:{value}}) => {
    setScoreTypeSh(value);
  };

  const scoreTypeBlur = () => {
    socket.emit('changeScoreType', roomId, scoreTypeSh);
  };

    return (<Container>
      <Row>
        <Col className="d-flex justify-content-center mb-3">
        <h1>Game {gameId}</h1>
        </Col>
      </Row>
      <Row>
        <Col>
        <div className="scrum">Scram master:</div>
        </Col>
      </Row>
      <Row>
        <Col>
        <UserCard {...admin}/>
        </Col>
      </Row>
      {role === "admin" && (<div>
      <Row>
        <Col>
        <div className="lobby__link">Link to lobby:</div>
        </Col>
      </Row>
      <Row>
        <Col>
        <div className="d-flex align-items-center lobby__conn">
    <Form.Control defaultValue={link} readOnly type="text" className="lobby__input" />
    <Button onClick={copyToClipboard} className="lobby__btn">Copy</Button>
        </div>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-between mb-3">
        <Button onClick={startGame} className="lobby__btn">Start Game</Button>
        <Button onClick={cancelGame} className="lobby__btn cancel">Cancel Game</Button>
        </Col>
      </Row>
     {showA && (<Row>
        <Col>
        <div className="d-flex justify-content-center mb-4">
        <Toast show={showA} onClose={toggleShowA} delay={5000} autohide>
      <Toast.Body>Game is cancelled successfully!</Toast.Body>
        </Toast>
        </div>
        </Col>
      </Row>)}    
      </div>)}
      {role !== "admin" && (<Row>
        <Col>
        <div className="d-flex justify-content-end mb-4">
        <Button onClick={exit} className="lobby__btn cancel">Exit</Button>
        </div>
        </Col>
      </Row>)}
      <Row>
        <Col>
        <div className="members">Members:</div>
        </Col>
      </Row>
      <Row>
        <Col>
        <div className="d-flex align-items-center flex-wrap">
          {usersInLobby && usersInLobby.map((user) => {return <UserCard key={user.id} {...user} />})}
        </div>
        </Col>
      </Row>
      {role === "admin" && (<><Row>
        <Col>
        <div className="members">Issues:</div>
        </Col>
      </Row>
      <Row>
        <Col>
        <div className="d-flex flex-wrap">
          <div className="d-flex flex-column">
          {issues && issues.map((issue) => {return <Issue key={issue.id} isInGame={false} {...issue} />})}
          </div>
        <CreateIssue />
        </div>
        </Col>
      </Row>
     <Row>
       <Col>
       <div className="members">Game settings:</div>
       </Col>
     </Row>
     <Row>
       <Col>
       <div className="d-flex flex-wrap align-items-center justify-content-between">
         <label htmlFor="player">Scram master as player:</label>
         <input  id="player" type="checkbox" value={dealerGetsCards} checked={dealerGetsCards} onChange={changeDealerGetsCards}/>
       </div>
       <div className="d-flex flex-wrap align-items-center justify-content-between">
         <label htmlFor="chcard">Allow to change card after round end:</label>
         <input  id="chcard" value={changeChoiceAfterFlipCard} checked={changeChoiceAfterFlipCard} onChange={changeChoiceAfterFlipCardHandler} type="checkbox" />
       </div>
       <div className="d-flex flex-wrap align-items-center justify-content-between">
         <label htmlFor="admit">Turn on admit/reject for new users after game start:</label>
         <input  id="admit" type="checkbox" value={!allowNewPlayersAfterGameStart} checked={!allowNewPlayersAfterGameStart} onChange={changeAdmit}/>
       </div>
       {/* <div className="d-flex flex-wrap align-items-center justify-content-between">
         <label htmlFor="timer">Is timer needed:</label>
         <input  id="timer" type="checkbox" value={timer} checked={timer} onChange={changeTimer}/>
       </div> */}
       {/* {timer && <div className="d-flex flex-wrap align-items-center justify-content-between mb-1">
         <label htmlFor="timerValue">Round time, millisecons:</label>
         <input  id="timerValue" type="number" min="1000" value={timerValueL} onChange={changeTimerValue} onBlur={changeTimerValueBlur}/>
       </div>} */}
       <div className="d-flex flex-wrap align-items-center justify-content-between mb-1">
         <label htmlFor="score">Score type:</label>
         <input  id="score" type="text" value={scoreType} onChange={changeScoreType}/>
       </div>
       <div className="d-flex flex-wrap align-items-center justify-content-between mb-1">
         <label htmlFor="scoreSh">Score type (Short):</label>
         <input  id="scoreSh" maxLength={2} type="text" value={scoreTypeSh} onChange={changeScoreTypeSh} onBlur={scoreTypeBlur} />
       </div>
       </Col>
     </Row>
     <Row>
       <Col>
       <div className="members">Add card values:</div>
       </Col>
     </Row>
     <Row>
       <Col>
       <div className="d-flex flex-wrap align-items-center">
       {cardValues && cardValues.map((cdV) => {return <PlayingCard key={cdV.id}  isInGame={false}  {...cdV} />})}
       <CreatePlayingCard />
       </div>
       </Col>
     </Row>
     </>)}
     <Row>
       <Col>
       <div className="members">Chat:</div>
       </Col>
     </Row>
     <Chat />
     <Modal show={show} onHide={handleClose}>
       <Modal.Header closeButton>
         <Modal.Title>Kick player?</Modal.Title>
       </Modal.Header>
       <Modal.Body>
         <div className="mb-3">Do you really want to remove player {ns} from game session?</div>
 <Button variant="primary" type="submit" onClick={handleClose} >YES</Button>
  <Button variant="secondary" type="reset" onClick={handleCloseCancel} className="float-right">NO</Button>  
       </Modal.Body>
       </Modal>
       <Modal show={votingData.showModalR} onHide={handleClose1}>
       <Modal.Header closeButton>
         <Modal.Title>Kick</Modal.Title>
       </Modal.Header>
       <Modal.Body>
         <div className="mb-3">{votingData.killer} want to kick member {votingData.ns}. Do you agree with it?</div>
 <Button variant="primary" type="submit" onClick={handleClose1} >YES</Button>
  <Button variant="secondary" type="reset" onClick={handleCloseCancel1} className="float-right">NO</Button>  
       </Modal.Body>
       </Modal>
    </Container>
)};

export default LobbyPage;
