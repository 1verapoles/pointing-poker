import { MdEdit } from 'react-icons/md';
import { FaRegSave } from 'react-icons/fa';
import React, {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import playingCardImg from '../../assets/img/active.svg';
import {CHOOSE_PLAYING_CARD} from '../../redux/constants';
import "./PlayingCard.scss";

const PlayingCard = ({id, value, isInGame, isActive}) => {
  const role = useSelector(state => state.currentUser.role);
  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState("");
  const roomId = useSelector(state => state.roomId);
  const socket = useSelector(state => state.socket);
  const cardType = useSelector(state => state.cardType);
  const gameHasStarted = useSelector(state => state.gameHasStarted);  
  const dealerGetsCards = useSelector(state => state.dealerGetsCards); 
  const currentUserId = useSelector(state => state.currentUser.id);
  const issueId = useSelector(state => {let activeIssue = state.issues.find(issue => issue.isActive);
    return activeIssue && activeIssue.id});
  const dispatch = useDispatch();  

  const changeEditValue = ({target:{value}}) => {
  setEditValue(value);
};

const changeMode = (e) => {
  e && e.stopPropagation();
  setEditMode(true);
};

const changePlCard = (e) => {
  e && e.stopPropagation();
  socket.emit('changePlCard', id, roomId, editValue);
  setEditValue("");
  setEditMode(false);
};

const chooseCard = () => {
  if (!isInGame) {return;}
  if (!gameHasStarted) {return;}
  dispatch({type: CHOOSE_PLAYING_CARD, payload: id});
  socket.emit('chooseCard', roomId, issueId, currentUserId, value, cardType, dealerGetsCards);
};

return (<div className={isActive ? "activeCard plcard__wrapper" : "plcard__wrapper"} onClick={chooseCard}>
  <div className="plcard__up">{cardType}</div>
  <div className="plcard__down">{cardType}</div>
  {role === "admin" && !isInGame && <div className="plicons__wrapper">
      {editMode && <FaRegSave className="plcard__cur" onClick={changePlCard} size={20}/>}
      {!editMode && <MdEdit className="plcard__cur" onClick={changeMode} size={20} />}
      </div>}
      {isActive && <img src={playingCardImg} alt="active" className="plCardActive" />}
 <div className="cardValue">{!editMode && (value || "UN")}
 {role === "admin" && editMode && <input autoFocus className="plcard__inp" type="text" value={editValue} onChange={changeEditValue} />}  
 </div>
</div>);
}

export default PlayingCard;