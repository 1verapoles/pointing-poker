import ScrollToBottom from 'react-scroll-to-bottom';
import React, {useState} from 'react';
import { useSelector } from 'react-redux';
import { RiSendPlaneFill } from 'react-icons/ri';
import ChatCard from '../ChatCard/ChatCard';
import { v4 } from 'uuid';
import "./Chat.scss";

const Chat = () => {  
  const [msg, setMsg] = useState("");
  const socket = useSelector(state => state.socket); 
  const roomId = useSelector(state => state.roomId);
  // const name = useSelector(state => state.currentUser.name);
  // const surname = useSelector(state => state.currentUser.surname);
  // const isKicked = useSelector(state => state.currentUser.isKicked);
  const currUserId = useSelector(state => state.currentUser.id);
  const users = useSelector(state => state.users);
  const currentUser = users.find(user => user.id === currUserId);
  const messages = useSelector(state => state.messages);

  const changeMsg = ({target:{value}}) => {
    setMsg(value);
  };

  const sendMessage = (e) => {
    e && e.preventDefault();
    let msgId = v4();
    // socket.emit('addMessage', {msg, id, name, surname, isKicked}, roomId);
    socket.emit('addMessage', {msg, msgId, ...currentUser}, roomId);
    setMsg("");
  };

  return (
    <div>
      <ScrollToBottom>
      {/* {messages && messages.map((message) => {return <div key={message.id} className="d-flex mb-1">
      <div className="msg">{message.msg}</div>
      <div className="author" style={{"backgroundColor": message.isKicked ? "#C70039" : "#fff"}}>{message.name} {message.surname}</div>
      </div>})} */}
      {messages && messages.map((message) => {
        // let user = users.find(us => us.id === message.id);
        return <div key={message.msgId} className="d-flex mb-2">
      <div className="msg">{message.msg}</div>
      <ChatCard {...message} />
      </div>})}
      </ScrollToBottom>
  <form className="d-flex mb-5">
<textarea className="msg__text" value={msg} onChange={changeMsg}></textarea>
<button type="submit" className="msg__btn" onClick={sendMessage}><RiSendPlaneFill /></button> 
</form>
    </div>
  );
};

export default Chat;