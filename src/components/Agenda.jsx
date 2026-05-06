import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from './common/Layout';

const Agenda = () => {

  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}evenements`
      );

      console.log('API RESPONSE:', res.data);

      setEvents(res.data?.data || res.data?.Event || []);

    } catch (error) {
      console.error("Erreur API:", error);
    }
  };

  // 🔥 format date
  const formatDate = (date) => {
    if (!date) return { day: "--", mon: "--" };

    const d = new Date(date);

    return {
      day: d.getDate().toString().padStart(2, "0"),
      mon: d.toLocaleDateString("fr-FR", { month: "short" })
    };
  };

  return (

   
    <section className="section-events py-5 bg-light">
      <div className="container px-3">
        <span className="badge-category mb-2">Agenda</span>
        <h3 className="section-title">Prochains événements</h3>
        <div className="section-divider mb-4" />

        <div className="events-list">

          {events.length > 0 ? (
            events.map((event, index) => {

              console.log("EVENT:", event);

              const { day, mon } = formatDate(
                event.created_at || event.date
              );

              return (
                <div className="event-item" key={event.id || index}>

                  <div className="event-date">
                    <div className="day">{day}</div>
                    <div className="mon">{mon}</div>
                  </div>

                  <div className="event-info">
                    <h5>{event.titre || event.titre || "Sans titre"}</h5>
                    <p>{event.lieu || event.location || "Lieu inconnu"}</p>

                   <span
                      className="event-tag"
                      style={{
                        color: event.statut === "terminé" ? "#800000" : "#30a50f"
                      }}
                    >
                      {event.statut  || "Info"}
                    </span>

                  </div>

                </div>
              );
            })
          ) : (
            <p>Aucun événement disponible</p>
          )}

        </div>
      </div>
    </section>

  
  );
};
 
export default Agenda;
