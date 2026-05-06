import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Contacts = () => {

  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    ContactsRequest();
  }, []);

  const ContactsRequest = async () => {
    try {

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}Contact`
      );

      console.log("CONTACT API:", res.data);

      setContacts(res.data?.data || res.data.Contact || []);

    } catch (error) {
      console.error("Erreur API:", error);
    }
  };

  return (
    <section className="section-contact py-5 bg-light">

      <div className="container px-3">

        <span className="badge-category mb-2">
          Contact
        </span>

        <h3 className="section-title">
          Nous contacter
        </h3>

        <div className="section-divider mb-4" />

        <div className="row g-3">

          {contacts.length > 0 ? (

            contacts.map((contact) => (

              <div className="col-12" key={contact.id}>

                <div className="row g-3">

                  {/* ADRESSE */}
                  <div className="col-12 col-md-4">
                    <div className="contact-item">

                      <div
                        className="contact-icon"
                        style={{ background: "#E6F1FB" }}
                      >
                        📍
                      </div>

                      <div>
                        <h5>Adresse</h5>

                        <p>
                          {contact.adress || "Adresse non définie"}
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* TELEPHONE */}
                  <div className="col-12 col-md-4">
                    <div className="contact-item">

                      <div
                        className="contact-icon"
                        style={{ background: "#E1F5EE" }}
                      >
                        📞
                      </div>

                      <div>
                        <h5>Téléphone</h5>

                        <p>
                          <a href={`tel:${contact.numero}`}>
                            {contact.numero || "Numéro non défini"}
                          </a>
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* EMAIL */}
                  <div className="col-12 col-md-4">
                    <div className="contact-item">

                      <div
                        className="contact-icon"
                        style={{ background: "#FAEEDA" }}
                      >
                        ✉️
                      </div>

                      <div>
                        <h5>Email</h5>

                        <p>
                          <a href={`mailto:${contact.email}`}>
                            {contact.email || "Email non défini"}
                          </a>
                        </p>
                      </div>

                    </div>
                  </div>

                </div>

              </div>

            ))

          ) : (

            <p>Aucune information de contact</p>

          )}

        </div>

      </div>

    </section>
  );
};

export default Contacts;
