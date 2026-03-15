import React from 'react'

const ContactUsFooter = () => {
  return (
    <footer className='contact-us-footer'>
      <span>Renua ®</span>
      <div className='contact-us-footer__links'>
        <a href="mailto:hey@renua.one" className='mail'>hey@renua.one</a>
        <a href="https://ee.linkedin.com/company/renua_one" target='_blank' className='linkedin'>LinkedIn</a>
        <a href="https://www.behance.net/renua_one" target='_blank' className='behance'>Behance</a>
      </div>
    </footer>
  )
}

export default ContactUsFooter;
