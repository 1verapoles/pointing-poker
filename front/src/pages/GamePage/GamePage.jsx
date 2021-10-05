import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import {cancelGameAll} from '../../redux/actions';
import {CHOOSE_ISSUE, START_ROUND, CHOOSE_CARD_ALL, DONT_SHOW_RESULTS} from '../../redux/constants';
import { GrInProgress } from 'react-icons/gr';
import sortFunction from '../../utils/sortFunction';
import UserCard from '../../components/UserCard/UserCard';
import Issue from '../../components/Issue/Issue';
import CreateIssue from '../../components/CreateIssue/CreateIssue';
import PlayingCard from '../../components/PlayingCard/PlayingCard';
import "./GamePage.scss";

const GamePage = () => {
  const role = useSelector(state => state.currentUser.role);
  const newParticipant = useSelector(state => state.newParticipant);
  const newParticipantExists = newParticipant && Object.keys(newParticipant) && Object.keys(newParticipant).length > 0;
  const [showAdmit, setShowAdmit] = useState(newParticipantExists);
  const gameId = useSelector(state => state.gameId);
  const issues = useSelector(state => state.issues.sort(sortFunction));
  const curIs = useSelector(state => state.issues.find(issue => issue.isResolved && issue.isActive));
  const admin = useSelector(state => state.users.find(user => user.role === "admin"));
  const socket = useSelector(state => state.socket); 
  const roomId = useSelector(state => state.roomId);
  const allowNewPlayersAfterGameStart = useSelector(state => state.allowNewPlayersAfterGameStart);
  const currentRound = useSelector(state => state.currentRound);
  const dealerGetsCards = useSelector(state => state.dealerGetsCards); 
  const changeChoiceAfterFlipCard = useSelector(state => state.changeChoiceAfterFlipCard);  
  const usersInGame = useSelector(state => state.users.filter((user) => {
  if (dealerGetsCards) {
    return user.isInGame && user.role !== "observer";
    } else {
    return user.isInGame && user.role === "player";
    }
  }));
  const currentUserId = useSelector(state => state.currentUser.id);
  const cardValues = useSelector(state => state.cardValues);
  const gameHasStarted = useSelector(state => state.gameHasStarted);
  const gameEnded = useSelector(state => state.gameEnded);
  const dispatch = useDispatch();
  let history = useHistory();
  const checkBtnDisabled = useSelector(state => state.issues.find(issue => !issue.isResolved && issue.isActive));
  
  useEffect(() => {
  //   socket.on('cancelGameAll', () => {
  //     dispatch(cancelGameAll());
  // });
  socket.on('chooseIssueAll', (idActive) => {
    dispatch({type: CHOOSE_ISSUE, payload: idActive});
  });
  socket.on('chooseCardAll', (data) => {
    dispatch({type: CHOOSE_CARD_ALL, payload: data});
  });
  socket.on('startRoundAll', () => {
    dispatch({type: START_ROUND});
  });
  socket.on('dontShowResultsAll', () => {
    dispatch({type: DONT_SHOW_RESULTS});
  });
  socket.on('stopGameAll', () => {
    history.push('/results');
  });
  }, []); 

  useEffect(() => {
    setShowAdmit(newParticipantExists);
    }, [newParticipantExists]); 

  const startRound = () => {
   if (!issues.some(issue => issue.isActive)) {return;}
   socket.emit('startRound', roomId);
  };
 
  const stopGame = () => {
    socket.emit('stopGame', roomId);
  };

  const exit = () => {
    socket.emit('exit', currentUserId, roomId);
    // socket.disconnect();
  };

  const handleClose = () => { 
    socket.emit('stopGame', roomId); 
  };

  const handleCloseCancel = () => {
    socket.emit('dontShowResults', roomId); 
  };

  const handleYes = () => { 
    socket.emit('changeAnswer', roomId, "yes"); 
    setShowAdmit(false); 
  };

  const handleNo = () => { 
    socket.emit('changeAnswer', roomId, "no"); 
    setShowAdmit(false); 
  };

  const handleCloseAdmit = () => {
    setShowAdmit(false); 
  };

  return (<Container>
     <Row>
       <Col xs={12} md={8}>
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
        {role === "admin" && (<Row>
        <Col className="d-flex justify-content-end mb-3">
        <Button onClick={stopGame} className="game__btn cancel">Stop Game</Button>
        </Col>
      </Row>)}
      {role !== "admin" && (<Row>
        <Col>
        <div className="d-flex justify-content-end mb-4">
        <Button onClick={exit} className="game__btn cancel">Exit</Button>
        </div>
        </Col>
      </Row>)}

      <Row>
        <Col>
        <div>
        <div className="members">Issues:</div>
        <div className="d-flex flex-column">
          {issues && issues.map((issue) => {return <Issue key={issue.id} isInGame={true} {...issue} />})}
          {role === "admin" && <CreateIssue isInGame={true}/>}
        </div>
        </div>
        <div className="d-flex flex-wrap justify-content-center mt-1">
        {role === "admin" && <Button onClick={startRound} disabled={gameHasStarted || !checkBtnDisabled} className="game__btn mb-3">Run Round</Button>}
        {role === "admin" && changeChoiceAfterFlipCard && <Button onClick={startRound} disabled={gameHasStarted || (!curIs && !checkBtnDisabled)} className="game__btn mb-3">Restart Round</Button>}
        </div></Col>
      </Row>

      {role === "player" && gameHasStarted && <Row>
      <Col className="d-flex justify-content-center">
      <div className="d-flex justify-content-center align-items-center my-3 rST">
        Round started! 
      </div>
      </Col>
       </Row>}

      {!gameHasStarted && curIs && <Row>
      <Col>
      <div className="d-flex flex-wrap justify-content-center mt-3">
     {Object.keys(curIs.stat).map(card => {return <div key={card} className="d-flex flex-column align-items-center">
     <PlayingCard key={card} value={card} isInGame={true} isActive={false} />
     <div className="mb-3">{curIs.stat[card]} %</div>
     </div>})}
      </div>
      </Col>
       </Row>}

      {(dealerGetsCards ? role !== "observer" : role === "player") && (<Row>
        <Col>
        <div className="d-flex justify-content-center flex-wrap my-3">
        {cardValues && cardValues.map((cdV) => {return <PlayingCard key={cdV.id} isInGame={true} {...cdV} />})}
       </div>
        </Col>
      </Row>)}
      

      

       </Col>





       <Col  xs={12} md={4} className="game__bd d-flex">
         <div>
           <div className="members">Score:</div>
           <div className="d-flex flex-column">
           {usersInGame && usersInGame.map((user) => {
             return <div key={user.id} className="game__score">{gameHasStarted ? <GrInProgress size={30} /> : Object.keys(currentRound).length ? currentRound[user.id] : "-"}</div>})}
            </div>
         </div>
         <div>
           <div className="members">Players: </div>
           <div className="d-flex flex-column">
           {usersInGame && usersInGame.map((user) => {return <UserCard key={user.id} {...user} />})}
            </div>
         </div>
       </Col>
     </Row>
     <Modal show={gameEnded} onHide={handleCloseCancel}>
       <Modal.Header closeButton>
         <Modal.Title>Game results</Modal.Title>
       </Modal.Header>
       <Modal.Body>
         <div className="mb-3">All issue are resolved. Do you want to see the results?</div>
  <Button variant="primary" type="submit" onClick={handleClose} >YES</Button>
  <Button variant="secondary" type="reset" onClick={handleCloseCancel} className="float-right">NO</Button>  
       </Modal.Body>
       </Modal>

       {role === "admin" && !allowNewPlayersAfterGameStart && newParticipantExists && (<Modal show={showAdmit} onHide={handleCloseAdmit}>
       <Modal.Header closeButton>
         <Modal.Title>New participant</Modal.Title>
       </Modal.Header>
       <Modal.Body>
         <div className="mb-3">Do you want to admit {newParticipant.name} {newParticipant.surname} into the game?</div>
  <Button variant="primary" type="submit" onClick={handleYes}>YES</Button>
  <Button variant="secondary" type="reset" onClick={handleNo} className="float-right">NO</Button>  
       </Modal.Body>
       </Modal>)}
     
    </Container>
);
}

export default GamePage;
