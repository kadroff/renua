import React from 'react'
import './ContactUsSubmitLoader.css'

const ContactUsSubmitLoader = ({ attachmentsCount, files }) => {
  const progress = files.length > 0 ? Math.round((attachmentsCount / files.length) * 100) : 0;

  return (
    <div className="contact-us-submit-loader">
      <div className="contact-us-submit-loader__content">
        <span className="contact-us-submit-loader__text">Uploading</span>
      </div>
      <div className="contact-us-submit-loader__bar">
        <div 
          className="contact-us-submit-loader__bar-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

export default ContactUsSubmitLoader
