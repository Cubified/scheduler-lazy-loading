import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Calendar, Scheduler, MobileScheduler, useArrayState } from "@cubedoodl/react-simple-scheduler";
import "./index.css";

function rand(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function App() {
  const [selected, setSelected] = useState(new Date());
  const [events, setEvents, addEvent, deleteEvent] = useArrayState();
  const [lazyLog, setLazyLog, addLog, deleteLog] = useArrayState();
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function resize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    addLog(new Date());
  }, [selected]);

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
      role="main"
    >
      <div>
        <Calendar
          selected={selected}
          setSelected={setSelected}
          style={{container: {padding: "12px"}}}
        />
        <br />
        <hr />
        <button
          onClick={() => {
            let cpy = events.slice();
            for(let i=0;i<1000;i++){
              const time = rand(Date.now() - 2066024938, Date.now() + 2066024938);
              const from = new Date(time);
              const to = new Date(from);
              to.setHours(from.getHours() + 2);
              cpy.push({
                from,
                to,
                name: `Random event ${i}`,
                calendar: {
                  name: "Sample",
                  enabled: true,
                },
                style: {
                  filter: `hue-rotate(${(i + 1) * 40}deg)`,
                },
              })
            }
            setEvents(cpy);
          }}
        >
          Add 1000 random events
        </button>
        <br />
        Current array size:
        <br />
        {events.length}
        <br />
        <hr />
        Rerender log:
        <br />
        {
          lazyLog.map((load) => (
            <div>{load.toLocaleTimeString()}: Rerender</div>
          ))
        }
        <br />
      </div>
      {(width > 600) ? (
        <Scheduler
          events={events}
          selected={selected}
          setSelected={setSelected}
          onRequestAdd={(cur) =>
            addEvent({
              ...cur,
              name: "New event",
              style: {
                filter: `hue-rotate(${(events.length + 1) * 40}deg)`,
              },
            })
          }
          onRequestEdit={(evt) => {
            alert(`You clicked an event from ${evt.from.toLocaleDateString()} @ ${evt.from.toLocaleTimeString()} until ${evt.to.toLocaleDateString()} @ ${evt.to.toLocaleTimeString()}`);
            deleteEvent(evt?.original ?? evt);
          }}
          style={{
            container: { width: "calc(100vw - 200px)" },
            head: { width: "calc(100vw - 200px)" },
            body: { height: "calc(100vh - 70px)", width: "calc(100vw - 200px)" }
          }}
        />) :
        (<MobileScheduler
          events={events}
          onRequestEdit={(evt) => {
            alert(`You clicked an event from ${evt.from.toLocaleDateString()} @ ${evt.from.toLocaleTimeString()} until ${evt.to.toLocaleDateString()} @ ${evt.to.toLocaleTimeString()}`);
            deleteEvent(evt?.original ?? evt);
          }}
          style={{
            container: { width: "calc(100vw - 200px)", height: "90vh", }
          }}
        />)
      }
    </main>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
