import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { CSVLink } from "react-csv";
import { useHistory } from 'react-router-dom';
import Issue from '../../components/Issue/Issue';
import PlayingCard from '../../components/PlayingCard/PlayingCard';
import {NEW_GAME} from '../../redux/constants';
import "./Results.scss";

const Results = () => {
  const gameId = useSelector(state => state.gameId);
  const issuesResolved = useSelector(state => state.issues.filter(issue => issue.isResolved));
  const socket = useSelector(state => state.socket); 
  const roomId = useSelector(state => state.roomId);
  const gameIsActive = useSelector(state => state.gameIsActive);
  const dispatch = useDispatch();
  let history = useHistory();
  useEffect(() => {
   socket.on('newGameAll', () => {
     dispatch({type: NEW_GAME});
     history.push('/');
   });
   }, []);

  console.log(issuesResolved);
  const headers = [
   { label: "Issue", key: "text" },
   { label: "Priority", key: "priority" },
   { label: "Card type", key: "cardType" },
   { label: "Card value", key: "cardValue" },
   { label: "Percent of votes, %", key: "percent" }
 ];
 let data = [];

 for (let i = 0; i < issuesResolved.length; i++ ) {
    let stat =  Object.keys(issuesResolved[i].stat);
    let val =  Object.values(issuesResolved[i].stat);
   for (let k = 0; k < stat.length; k++ ) {
      data.push({text: issuesResolved[i].text, priority: issuesResolved[i].priority, cardType: issuesResolved[i].cardType, cardValue: stat[k], percent: val[k]});
   }
 }

 const newGame = () => {
   socket.emit('newGame', roomId);
 };

  return (<Container>
     <Row>
        <Col className="d-flex justify-content-center mb-1">
        <h1>Game {gameId}</h1>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-end mb-3">
       {gameIsActive && (<CSVLink data={data} headers={headers} className="downl mb-1">
  Download results
        </CSVLink>)}
        </Col>
     </Row>
     {issuesResolved && issuesResolved.map((issue) => {return (<React.Fragment key={issue.id}>
     <Row key={issue.id}>
     <Col>
     <Issue key={issue.id} isInGame={true} {...issue} />
     </Col>
      </Row>
      <Row>
      <Col>
      <div className="d-flex flex-wrap">
     {Object.keys(issue.stat).map(card => {return <div key={card} className="d-flex flex-column align-items-center">
     <PlayingCard key={card} value={card} isInGame={true} isActive={false} />
     <div className="mb-3">{issue.stat[card]} %</div>
     </div>})}
      </div>
      </Col>
       </Row>
    </ React.Fragment> )})} 
    <Row>
        <Col className="d-flex justify-content-end">
        <Button onClick={newGame} className="downl mb-3">New game</Button>
        </Col>
     </Row>
    </Container>
);
}

export default Results;
