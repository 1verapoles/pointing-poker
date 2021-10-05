import React from 'react';
import { MdDoNotDisturbAlt } from 'react-icons/md';
import { useSelector, useDispatch } from 'react-redux';
import { KICKING_USER} from '../../redux/constants';
import "./UserCard.scss";

const UserCard = ({name, surname, position, img, letters, bgColor, isKicked, isInLobby, role, id}) => {
   
  const usersQty = useSelector(state => state.users.length);
  const dispatch = useDispatch();
 
  const offerKick = (e) => {
    if (e.target.dataset.role) {
    if (e.target.dataset.role === "admin") {alert("You can't kick dealer!"); return;}
    if (usersQty < 4) {alert("You can't start voting, because there are less than 3 people in lobby!"); return;}
    dispatch({type: KICKING_USER, payload: {id: e.target.dataset.id, ns: e.target.dataset.ns, showModalR: true}}); 
    }
  };
  return (
    <div className="usercard__wpapper" >
      <div className="img__wrapper">
      {letters && <div className="usercard__letters" style={{"backgroundColor": bgColor}}>{letters}</div>}
      {!letters && <img className="usercard__img" style={{"backgroundColor": bgColor}} src={img} alt={name} />}
      <div className={isKicked? "crs usercard__name" : "usercard__name"}>{name} {surname}</div>
      <div className="usercard__position">{position}</div>
      </div>
  {isInLobby && <MdDoNotDisturbAlt className="not__allow" size={35} data-role={role} data-id={id} data-ns={`${name} ${surname}`} onClick={offerKick} />}
    </div>
  );
};

export default UserCard;