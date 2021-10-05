import React, {useState, useRef, useEffect} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Container, Row, Col, Button, Modal, Form, Toast } from 'react-bootstrap';
import { v4 } from 'uuid';
import { useSelector, useDispatch } from 'react-redux';
import logo from '../../assets/img/big-logo.svg';
import {setInitialData, initAdmin, addUser, addIssue, exitUser, setCurrentUser} from '../../redux/actions';
import {users} from '../../utils/constants';
import {CHANGE_PARTICIPANT, CHANGE_ANSWER} from '../../redux/constants';
import "./MainPage.scss";

const MainPage = () => {
  const useQuery = () => new URLSearchParams(useLocation().search);
  let queryId = useQuery().get("id");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [position, setPosition] = useState("");
  const [inputGameId, setInputGameId] = useState(() => {return (queryId ? queryId : "");});
  const [obs, setObs] = useState(false);
  const [show, setShow] = useState(false);
  const [blur, setBlur] = useState(false);
  const [showA, setShowA] = useState(false);
  const dispatch = useDispatch();
  let history = useHistory();
  const gameIsActive = useSelector(state => state.gameIsActive);
  const gameBegin = useSelector(state => state.gameBegin);
  const roomId = useSelector(state => state.roomId);
  const socket = useSelector(state => state.socket);
  const allowNewPlayersAfterGameStart = useSelector(state => state.allowNewPlayersAfterGameStart);
  const newParticipant = useSelector(state => state.newParticipant);
  const answer = useSelector(state => state.answer);
  const currentUser1 = useSelector(state => state.currentUser);
  const fileRef = useRef();
  

  useEffect(() => {
    socket.emit('initialData', (initData) => {
      dispatch(setInitialData(initData));
  });
  }, []);

  useEffect(() => {
    if (gameIsActive && gameBegin && !allowNewPlayersAfterGameStart && answer === "yes" && newParticipant.id === currentUser1.id) {
      socket.emit('addUser', {...currentUser1, isInLobby: false, isInGame: true});
      socket.emit('changeAnswer', roomId, ""); 
      socket.emit('changeParticipant', roomId, {});
      clearForm();
      setShow(false);
      history.push('/game');
      } 
      if (gameIsActive && gameBegin && !allowNewPlayersAfterGameStart && answer === "no" && newParticipant.id === currentUser1.id) {
        socket.emit('changeAnswer', roomId, ""); 
        socket.emit('changeParticipant', roomId, {});
        clearForm();
        setShow(false);
        alert("Dealer didn't admit you to the game!");
        } 
  }, [answer]);

  useEffect(() => {
    socket.on('addNewUser', (userData) => {
      dispatch(addUser(userData));
  });
  socket.on('changeParticipantAll', (participant) => {
    dispatch({type: CHANGE_PARTICIPANT, payload: participant});
  });
  socket.on('changeAnswerAll', (answer2) => {
    dispatch({type: CHANGE_ANSWER, payload: answer2});
  });  
  socket.on('addNewIssue', (newIssue) => {
    dispatch(addIssue(newIssue));
  });
  socket.on('exitUser', (userId) => {
    dispatch(exitUser(userId));
  });
  }, []);

  const changeFirstName = ({target:{value}}) => {
    setFirstName(value);
  };

  const changeLastName = ({target:{value}}) => {
    setLastName(value);
  };

  const changePosition = ({target:{value}}) => {
    setPosition(value);
  };

  const changeObs = ({target:{value}}) => {
    setObs(value => !value);
  };

  const changeBlur = () => {
    if (!blur) {
      setBlur(true);
    }
  };

  const changeInputGameId = ({target:{value}}) => {
    setInputGameId(value);
  };

  const clearForm = () => {
    setFirstName('');
    setLastName('');
    setPosition('');
    fileRef.current = undefined;
    setObs(false);
    setBlur(false);
    setShow(false);
  };

  const toggleShowA = () => setShowA(!showA);

  const handleClose = (e) => {
   e && e.preventDefault();
    if (firstName === '' && blur === false) {setBlur(true); return;}
    const fileRefCurr = fileRef.current.files[0];
    let letters;
    if (!fileRefCurr && lastName) {
      letters = `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`;
    }
    if (!fileRefCurr && !lastName) {
      letters = `${firstName[0].toUpperCase()}${firstName[firstName.length - 1].toUpperCase()}`;
    }
    if (!gameIsActive && !gameBegin) {
     const gameId = v4();
     const roomId1 = v4();
     dispatch(initAdmin({gameId, roomId: roomId1, gameIsActive: true}));
     socket.emit('initAdmin', {gameId, roomId: roomId1, gameIsActive: true});
     let currentUser = {name: firstName.toUpperCase(), surname: lastName.toUpperCase(), position: position, id: socket.id, img: '', letters: letters, role: users.ADMIN, bgColor: '#ccc', room: roomId1, isInLobby: true, isInGame: false, isKicked: false};
     dispatch(setCurrentUser(currentUser));
     socket.emit('addUser', currentUser);          
    clearForm();
    setShow(false);
    history.push('/lobby');
    }
    if (gameIsActive) {
      let role;
      let bgColor;
      if (obs) {
        role = users.OBSERVER;
        bgColor = '#60DABF';
      } else {
        role = users.PLAYER;
        bgColor = '#C34BAD';
      }
      let currentUser = {name: firstName.toUpperCase(), surname: lastName.toUpperCase(), position: position, id: socket.id, img: '', letters: letters, role, bgColor, room: roomId, isInLobby: true, isInGame: false, isKicked: false};
      dispatch(setCurrentUser(currentUser));
      if (!allowNewPlayersAfterGameStart && gameBegin) {
        socket.emit('changeParticipant', roomId, currentUser);
      }
      if (gameIsActive && !gameBegin) {
      socket.emit('addUser', currentUser);        
    clearForm();
    setShow(false);
    history.push('/lobby');
      } 
      if (gameIsActive && gameBegin && allowNewPlayersAfterGameStart) {
        socket.emit('addUser', {...currentUser, isInLobby: false, isInGame: true});        
      clearForm();
      setShow(false);
      history.push('/game');
        } 
      // if (gameIsActive && gameBegin && !allowNewPlayersAfterGameStart && answer === "yes" && newParticipant.id === currentUser.id) {
      //   socket.emit('addUser', {...currentUser, isInLobby: false, isInGame: true});
      //   socket.emit('changeAnswer', roomId, ""); 
      //   socket.emit('changeParticipant', roomId, {});
      //   clearForm();
      //   setShow(false);
      //   history.push('/game');
      //   } 
      //   if (gameIsActive && gameBegin && !allowNewPlayersAfterGameStart && answer === "no" && newParticipant.id === currentUser.id) {
      //     socket.emit('changeAnswer', roomId, ""); 
      //     socket.emit('changeParticipant', roomId, {});
      //     clearForm();
      //     setShow(false);
      //     alert("Dealer didn't admit you to the game!");
      //     } 
     }
  };

  
  const handleCloseCancel = (e) => {
    e && e.preventDefault();
    clearForm();
  };

  const handleConnect = () => {
     socket.emit('checkGameId', inputGameId, answer1 => {
      if (answer1 === true) {
        setShow(true);
       }
       if (answer1 === false) {
        setShowA(true);
       }
     });    
  };

  const handleShow = () => setShow(true);
  return (
   <Container>
     <Row >
       <Col className="d-flex justify-content-center">
          <img className="pp" src={logo} alt="big logo" width={550.09} height={149} />
        </Col>
     </Row>
     <Row>
       <Col>
       <span className="main__h">Start your planning:</span>
       </Col>
     </Row>
     <Row>
       <Col>
         <div className="d-flex align-items-center main__w">
         <span className="main__p">Create session:</span>
         <Button onClick={handleShow} disabled={gameIsActive} className="main__btn">
         Start new game
      </Button>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Connect to lobby</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
  <Form.Group className="mb-3" controlId="formGroupFirstName">
    <Form.Label>Your first name:</Form.Label>
    <Form.Control value={firstName} onChange={changeFirstName} onBlur={changeBlur} type="text" required />
    {blur && <Form.Control.Feedback className={firstName === '' ? "d-block" : ""} type="invalid">Enter your name </Form.Control.Feedback>}
  </Form.Group>
  <Form.Group className="mb-3" controlId="formGroupLastName">
    <Form.Label>Your last name (optional):</Form.Label>
    <Form.Control value={lastName} onChange={changeLastName} type="text"  />
  </Form.Group>
  <Form.Group className="mb-3" controlId="formGroupPosition">
    <Form.Label>Your job position (optional):</Form.Label>
    <Form.Control value={position} onChange={changePosition} type="text"  />
  </Form.Group>
    <label htmlFor="files" className="main__label">Image:</label>
      <input id="files" type="file" ref={fileRef} className="btn-file-upload mt-1 mb-2" data-val="Upload file" />
    <Form.Group className="mt-1 mb-3" controlId="formBasicCheckbox">
    <Form.Check type="checkbox"  checked={obs} onChange={changeObs} label="Connect as Observer" />
  </Form.Group>
  <Button variant="primary" type="submit" onClick={handleClose}>
    Confirm
  </Button>
    <Button variant="secondary" type="reset" onClick={handleCloseCancel} className="float-right">
     Cancel
      </Button>  
</Form>
        </Modal.Body>
        </Modal>
       </Col>
     </Row>
     <Row >
       <Col>
         <span className="main__or">or:</span>
        </Col>
     </Row>
     <Row >
       <Col>
         <div className="main__p add__m">Connect to lobby by <span className="main__url">URL</span>:</div>
        </Col>
     </Row>
     <Row >
       <Col>
       <div className="d-flex justify-content-center mb-4">
        <Toast show={showA} onClose={toggleShowA} delay={5000} autohide>
      <Toast.Body>Game id is invalid!</Toast.Body>
        </Toast>
        </div>
       <div className="d-flex align-items-center main__conn">
    <Form.Control value={inputGameId} onChange={changeInputGameId} type="text" className="main__input" />
    <Button onClick={handleConnect} className="main__btn">Connect</Button>
        </div>
         </Col>
     </Row>
    </Container>
)};

export default MainPage;
