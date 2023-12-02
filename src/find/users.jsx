import React from 'react';

import { SessionEvent, SessionNotifier } from './sessionNotifier';
import './find.css';

export function Users({ userName }) {

  const [events, setEvent] = React.useState([]);

  React.useEffect(() => {
    SessionNotifier.addHandler(handleSessionEvent);

    return () => {
        SessionNotifier.removeHandler(handleSessionEvent);
    };
  });

  function handleSessionEvent(event) {
    setEvent([...events, event]);
  }

  function createMessageArray() {
    console.log('Creating Array');
    const messageArray = [];
    for (const [i, event] of events.entries()) {
        console.log(event.type);
      let message = 'unknown';
      if (event.type === SessionEvent.Like) {
        message = `liked ${event.value.title}`;
      } else if (event.type === SessionEvent.Dislike) {
        message = `dislike ${event.value.title}`;
      } else if (event.type === SessionEvent.Save) {
        message = `saved ${event.value.title}`;
      }

      messageArray.push(
        <div key={i} className='event'>
          <span className={'player-event'}>{event.from.split('@')[0]} </span>
          {message}
        </div>
      );
    }
    return messageArray;
  }

  return (
    <div className='user-section'>
      User 
      <span id='user-name'> {userName}</span>
      <div id='user-messages'>{createMessageArray()}</div>
    </div>
  );
}