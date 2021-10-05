import { BsTrash } from 'react-icons/bs';
import { MdEdit } from 'react-icons/md';
import { FaRegSave } from 'react-icons/fa';
import React, {useState} from 'react';
import { useSelector } from 'react-redux';
import "./Issue.scss";

const Issue = ({id, text, priority, isActive, isResolved, isInGame}) => {
  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState("");
  const roomId = useSelector(state => state.roomId);
  const socket = useSelector(state => state.socket);
  const role = useSelector(state => state.currentUser.role);
  const gameHasStarted = useSelector(state => state.gameHasStarted);
  const changeChoiceAfterFlipCard = useSelector(state => state.changeChoiceAfterFlipCard);

  const deleteIssue = (e) => {
    e && e.stopPropagation();
    socket.emit('deleteIssue', id, roomId);
 };

 const changeEditValue = ({target:{value}}) => {
  setEditValue(value);
};

const changeMode = (e) => {
  e && e.stopPropagation();
  setEditMode(true);
};

const changeIssue = (e) => {
  e && e.stopPropagation();
  socket.emit('changeIssue', id, roomId, editValue);
  setEditValue("");
  setEditMode(false);
};

const chooseIssue = () => {
  if (!isInGame) {return;}
  if (gameHasStarted) {return;}
  if (role !== "admin") {return;}
  if (!changeChoiceAfterFlipCard && isResolved) {return;}
  socket.emit('chooseIssue', id, roomId);
};

  return (
    <div className={isResolved ? "resolvedIssue issue__wpapper" : isActive ? "activeIssue issue__wpapper" : "issue__wpapper"} onClick={chooseIssue}>
      <div className="issue">
      {!editMode && text}
      {editMode && <input autoFocus className="issue__inp" type="text" value={editValue} onChange={changeEditValue} />}  
      <div className="issue__priority">{priority}</div>
      </div>
     {role === "admin" && !isInGame && <div className="icons__wrapper">
      {editMode && <FaRegSave className="issue__cur" onClick={changeIssue} size={35}/>}
      {!editMode && <MdEdit className="issue__cur" onClick={changeMode} size={35} />}
      <BsTrash className="issue__cur" onClick={deleteIssue} size={30}/>
      </div>}
    </div>
  );
};

export default Issue;