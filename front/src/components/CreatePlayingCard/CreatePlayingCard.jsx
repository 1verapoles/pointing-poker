import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BsPlusCircle } from 'react-icons/bs';
import { v4 } from 'uuid';
// import {addPlCard} from '../../redux/actions';
import "./CreatePlayingCard.scss";

const CreatePlayingCard = () => {
  // const cardType = useSelector(state => state.cardType) || "unknown";
  // const dispatch = useDispatch();
  const socket = useSelector(state => state.socket);
  const roomId = useSelector(state => state.roomId);

  const addPlayingCard = () => {
    const id = v4();
    socket.emit('addPlCard', roomId, {id, value: 'un', isActive: false});
    // dispatch(addPlCard([id, 'un']));
  }; 
 
  return (<div className="crplcard__wrapper" onClick={addPlayingCard}>
  <BsPlusCircle size={35} />
  </div>);
};

export default CreatePlayingCard;