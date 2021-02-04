import { useState, useEffect } from "react";
import "./styles.css";
const axios = require("axios");

const backendURI = "http://ec2-65-1-84-14.ap-south-1.compute.amazonaws.com/api/v1";
// const backendURI = "http://localhost:5000/api/v1";

export default function App() {

  // STATES
  /**********************************/

  const [users, setUsers] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [allEvents, setAllEvents] = useState(null);
  const [allWinners, setAllWinners] = useState(null);

  const [eventFormValues, setEventFormValues] = useState({
    name: '',
    scheduledAt: '',
    prizes: [],
  })

  /**********************************/

  // Use effect - Fetch upcoming events
  useEffect( async() => {
    const allUsers = await axios.get(`${backendURI}/test/users`);
    setUsers(allUsers.data.result);

    const allEvents = await axios.get(`${backendURI}/event/upcoming`);
    setAllEvents(allEvents.data.result);

    const allWinners = await axios.get(`${backendURI}/winner/recent`);
    setAllWinners(allWinners.data.result);
  }, [])

  /**********************************/

  const getTicket = async (currentUser) => {
    console.log("getTicket()");

    const ticket = await axios.post(`${backendURI}/ticket`, {
      userId: currentUser,
      expiresIn: 2
    });

    console.log(ticket.data.result);

    setCurrentTicket(ticket.data.result._id);
  };

  const onChange = (event) => {
    event.persist();

    setEventFormValues((values)=>({
      ...values,
      [event.target.name]: event.target.value,
    }))
  }

  const createEvent = async (event) => {
    event.preventDefault();

    const { name } = eventFormValues;
    const scheduledAt = new Date(eventFormValues.scheduledAt).getTime();
    const prizes = eventFormValues.prizes.split(",").map( prize=> prize.trim() );

    console.log( scheduledAt, prizes );

    const newEvent = await axios.post(`${backendURI}/event`, {
      name: name,
      scheduledAt: scheduledAt,
      prizes: prizes,
    });

    console.log( newEvent );

  }

  const enterEvent = async (eventId) => {
    if(currentTicket) {
      const updatedEvent = await axios.post(`${backendURI}/event/${eventId}/enter`, {
        ticketId: currentTicket,
      });
    }
  }

  return (
    <div className="App">
      <h1>Lucky draw</h1>

      <h3>Select a user</h3>
      <div>
        {
          users &&
          users.map(user => {
            return (
              <div key={user._id} onClick={() => setCurrentUser(user._id)}>
                { user._id === currentUser ?
                  <strong>{user._id}</strong>:
                  user._id
                }
              </div>
            );
          })}
      </div>
      <button onClick={() => getTicket(currentUser)}>Get ticket</button>

      <div>
        TicketId: {currentTicket}
      </div>

      <div>
        <h2>Create event</h2>
        <form onSubmit={createEvent}>
          Name:
          <input type="text" name="name" value={eventFormValues.name} onChange={onChange} required/>
          ScheduledAt:
          <input type="datetime-local" name="scheduledAt" value={eventFormValues.scheduledAt} onChange={onChange} required/>
          Prizes (Multiple comma separated):
          <input type="text" name="prizes" value={eventFormValues.prizes} onChange={onChange} required/>
          <button type="submit">Create an event</button>
        </form>
      </div>


      <div>
        <h2>Upcoming events</h2>
        {
          allEvents &&
          allEvents.map( item => {
            return <div key={item._id}>
              <div>
                {item._id}
              </div>
              <div>
                Event name: {item.name}
              </div>
              <div>
                Scheduled At: {item.scheduledAt}
              </div>
              <div>
                Prizes: {item.prizes.join(", ")}
              </div>
              <div>
                <button onClick={()=>enterEvent(item._id)}>Enter</button>
              </div>
            </div>
          })
        }
      </div>

      <div>
        <h2>Winners</h2>
        {
          allWinners &&
          allWinners.map( item => {
            return <div key={item._id}>
              <div>
                {item.name}
                </div>
                <div>
                  Winner: {item.participants[0].ticket.user}
                  </div>
              </div>
          })
        }
      </div>
    </div>
  );
}
