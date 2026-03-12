import React from 'react'
import './ContactUsWarning.css'

const ContactUsWarning = ({ onClose, title, description, type }) => {
  return (
    <div className={`contact-us-warning contact-us-warning--${type}`}>
      <div className="contact-us-warning__content">
        <h4 className="contact-us-warning__title">{title}</h4>
        <p className="contact-us-warning__description">{description}</p>
      </div>
      <button className="contact-us-warning__close" onClick={onClose}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  )
}

export default ContactUsWarning
