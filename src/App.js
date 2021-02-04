import { useState, useEffect } from "react";
import { isFunctionDeclaration } from "typescript";
import "./styles.css";
const axios = require("axios");

const backendURI =
  "http://ec2-65-1-84-14.ap-south-1.compute.amazonaws.com/api/v1";
// const backendURI = "http://localhost:5000/api/v1";

export default function App() {
  // STATES
  /**********************************/

  // Data states
  const [users, setUsers] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [allEvents, setAllEvents] = useState(null);
  const [allWinners, setAllWinners] = useState(null);

  // Error states
  const [ticketError, setTicketError] = useState(null);
  const [eventError, setEventError] = useState(null);

  // Form states
  const [eventFormValues, setEventFormValues] = useState({
    name: "",
    scheduledAt: "",
    prizes: [],
  });

  /**********************************/

  // Use effect - Fetch upcoming events
  useEffect(async () => {
    const allUsers = await axios.get(`${backendURI}/test/users`);
    setUsers(allUsers.data.result);

    const allEvents = await axios.get(`${backendURI}/event/upcoming`);
    setAllEvents(allEvents.data.result);

    const allWinners = await axios.get(`${backendURI}/winner/recent`);
    setAllWinners(allWinners.data.result);
  }, []);

  /**********************************/

  const getTicket = async (currentUser) => {
    if (currentUser) {
      const ticket = await axios.post(`${backendURI}/ticket`, {
        userId: currentUser,
        expiresIn: 2,
      });

      console.log(ticket.data.result);

      setCurrentTicket(ticket.data.result._id);
      setTicketError(null);
    } else {
      setTicketError("Please select a user first!");
    }
  };

  const onChange = (event) => {
    event.persist();

    setEventFormValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

  const createEvent = async (event) => {
    event.preventDefault();

    const { name } = eventFormValues;
    const scheduledAt = new Date(eventFormValues.scheduledAt).getTime();
    const prizes = eventFormValues.prizes
      .split(",")
      .map((prize) => prize.trim());

    const newEvent = await axios.post(`${backendURI}/event`, {
      name: name,
      scheduledAt: scheduledAt,
      prizes: prizes,
    });

    alert(newEvent.data.message);
  };

  const enterEvent = async (eventId) => {
    if (currentTicket) {
      const updatedEvent = await axios.post(
        `${backendURI}/event/${eventId}/enter`,
        {
          ticketId: currentTicket,
        }
      );

      if( updatedEvent.data.success ) {
        alert(updatedEvent.data.message );
        setEventError(null);
      } else {
        setEventError(updatedEvent.data.message);
      }
    } else {
      setEventError("Please generate a ticket first");
    }
  };

  return (
    <div className="App">
      <h1>Lucky draw</h1>

      {/* Select User */}
      <h3>Select a user</h3>

      <div>
        {users &&
          users.map((user) => {
            return (
              <div key={user._id} onClick={() => setCurrentUser(user._id)}>
                <span>
                  {user._id === currentUser ? (
                    <strong>{user._id}</strong>
                  ) : (
                    user._id
                  )}
                </span>{" "}
                -<span>{user.firstName + " " + user.lastName}</span>
              </div>
            );
          })}
      </div>

      {/* Generate ticket */}
      <h2>Generate raffle ticket</h2>
      <div>
        <button onClick={() => getTicket(currentUser)}>Get ticket</button>

        {/* Current ticket */}
        {currentTicket && <div>TicketId: {currentTicket}</div>}
        {ticketError && <div>{ticketError}</div>}
      </div>

      {/* Create an event */}
      <div>
        <h2>Create event</h2>
        <form onSubmit={createEvent}>
          <div>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={eventFormValues.name}
                onChange={onChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              ScheduledAt:
              <input
                type="datetime-local"
                name="scheduledAt"
                value={eventFormValues.scheduledAt}
                onChange={onChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Prizes (Multiple comma separated):
              <input
                type="text"
                name="prizes"
                value={eventFormValues.prizes}
                onChange={onChange}
                required
              />
            </label>
          </div>
          <button type="submit">Create an event</button>
        </form>
      </div>

      {/* Enter latest event */}
      <div>
        <h2>Upcoming events</h2>
        {allEvents &&
          allEvents.map((item) => {
            return (
              <div key={item._id}>
                <div>{item._id}</div>
                <div>Event name: {item.name}</div>
                <div>Scheduled At: {item.scheduledAt}</div>
                <div>Prizes: {item.prizes.join(", ")}</div>
                <div>
                  <button onClick={() => enterEvent(item._id)}>Enter</button>
                </div>
              </div>
            );
          })}
        {eventError && <div>{eventError}</div>}
      </div>

      {/* See winners of the events in last 1 week */}
      <div>
        <h2>Winners</h2>
        {allWinners &&
          allWinners.map((item) => {
            return (
              <div key={item._id}>
                <div>{item.name}</div>
                <div>Winner: {item.participants[0].ticket.user}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
