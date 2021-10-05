import { MdDoNotDisturbAlt } from 'react-icons/md';
import { useSelector, useDispatch } from 'react-redux';
import { KICKING_USER} from '../../redux/constants';
import "./ChatCard.scss";

const ChatCard = ({name, surname, position, img, letters, bgColor, isKicked, isInLobby, role, id}) => {
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
    <div className="chat__wpapper">
      <div className="chimg__wrapper">
      {letters && <div className="chat__letters" style={{"backgroundColor": bgColor}}>{letters}</div>}
      {!letters && <img className="chat__img" style={{"backgroundColor": bgColor}} src={img} alt={name} />}
      <div className={isKicked? "crs chat__name" : "chat__name"}>{name} {surname}</div>
      <div className="chat__position">{position}</div>
      </div>
  {isInLobby && <MdDoNotDisturbAlt className="not__allow" size={20} data-role={role} data-id={id} data-ns={`${name} ${surname}`} onClick={offerKick} />}
    </div>
  );
};

export default ChatCard;