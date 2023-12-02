const SessionEvent = {
    System: 'system',
    Like: 'sessionLike',
    Dislike: 'sessionDislike',
    Save: 'sessionSave'
  };
  
  class EventMessage {
    constructor(from, type, value) {
      this.from = from;
      this.type = type;
      this.value = value;
    }
  }
  
  class SessionEventNotifier {
    events = [];
    handlers = [];
  
    constructor() {
      let port = window.location.port;
      const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
      this.socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);
      this.socket.onopen = (event) => {
        this.receiveEvent(new EventMessage('System', SessionEvent.System, { msg: 'connected' }));
      };
      this.socket.onclose = (event) => {
        this.receiveEvent(new EventMessage('System', SessionEvent.System, { msg: 'disconnected' }));
      };
      this.socket.onmessage = async (msg) => {
        try {
          const event = JSON.parse(await msg.data.text());
          this.receiveEvent(event);
        } catch {}
      };
    }
  
    broadcastEvent(from, type, value) {
      const event = new EventMessage(from, type, value);
      this.socket.send(JSON.stringify(event));
    }
  
    addHandler(handler) {
      this.handlers.push(handler);
    }
  
    removeHandler(handler) {
      this.handlers.filter((h) => h !== handler);
    }
  
    receiveEvent(event) {
      this.events.push(event);
  
      this.events.forEach((e) => {
        this.handlers.forEach((handler) => {
          handler(e);
        });
      });
    }
  }
  
  const SessionNotifier = new SessionEventNotifier();
  export { SessionEvent, SessionNotifier };

  
//   function configureWebSocket() {
//     const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
//     socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
//     socket.onopen = (event) => {
//       displayMsg('system', 'session', 'connected');
//     };
//     socket.onclose = (event) => {
//       displayMsg('system', 'session', 'disconnected');
//     };
//     socket.onmessage = async (event) => {
//       const msg = JSON.parse(await event.data.text());
//       console.log(msg.from)
//       if (msg.type === MovieLikeEvent) {
//         displayMsg('user', msg.from, `liked ${msg.value}`);
//       } else if (msg.type === MovieDislikeEvent) {
//         displayMsg('user', msg.from, `disliked ${msg.value}`);
//       } else if (msg.type === MovieSaveEvent) {
//         displayMsg('user', msg.from, `saved ${msg.value}`);
//       }
//     };
//   }