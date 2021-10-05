import React, {useState} from 'react';
import { useSelector } from 'react-redux';
import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import { v4 } from 'uuid';
import { GrAdd } from 'react-icons/gr';
import "./CreateIssue.scss";

const CreateIssue = () => {
  const roomId = useSelector(state => state.roomId);
  const socket = useSelector(state => state.socket);
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("low");

  const handleShow = () => setShow(true);

  const changeTitle = ({target:{value}}) => {
    setTitle(value);
  };

  const changePriority = ({target:{value}}) => {
    setPriority(value);
  };

  const clearForm = () => {
    setTitle('');
    setPriority('low');
  };

  const handleCloseCancel = (e) => {
    e && e.preventDefault();
    clearForm();
    setShow(false);
  };

  const handleClose = (e) => {
      e && e.preventDefault();
      const issueId = v4();
      socket.emit('addIssue', roomId, {id: issueId, text: title, priority, isActive: false, isResolved: false});
     clearForm();
     setShow(false);
   };
 
  return (<>  
    <div className="newissue__wpapper" onClick={handleShow}>
      <div>Create new Issue</div>
      <GrAdd size={35}/>
    </div>
<Container>
<Row>
<Col>
<Modal show={show} onHide={handleClose}>
 <Modal.Header closeButton>
   <Modal.Title>Create Issue</Modal.Title>
 </Modal.Header>
 <Modal.Body>
 <Form>
<Form.Group className="mb-3" controlId="formGroupTitle">
<Form.Label>Title:</Form.Label>
<Form.Control value={title} onChange={changeTitle} type="text" required />
</Form.Group>
<Form.Group className="mb-3" controlId="formGroupPriority">
<Form.Label>Priority:</Form.Label>
<select className="form-control mb-5" value={priority} onChange={changePriority}>
  <option value="Low">Low</option>
  <option value="Middle">Middle</option>
  <option value="High">High</option>
</select>
</Form.Group>
<Button variant="primary" type="submit" onClick={handleClose}>
Yes
</Button>
<Button variant="secondary" type="reset" onClick={handleCloseCancel} className="float-right">
No
</Button>  
</Form>
 </Modal.Body>
 </Modal>
</Col>
</Row>
</Container>
</>);
};

export default CreateIssue;