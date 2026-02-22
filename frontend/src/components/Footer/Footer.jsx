import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
const Footer = () => {
    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    <img src={assets.logo} alt='' className="footer-logo" />
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum qui, esse, eligendi eaque quisquam ipsa reprehenderit saepe eos aspernatur odio quidem suscipit, facere officia harum eveniet! Ut neque quae ratione.</p>
                    <div className="footer-social-icons">
                        <div className="social-icon-wrapper"><img src={assets.facebook_icon} alt="" /></div>
                        <div className="social-icon-wrapper"><img src={assets.twitter_icon} alt="" /></div>
                        <div className="social-icon-wrapper"><img src={assets.linkedin_icon} alt="" /></div>
                    </div>
                </div>
                <div className="footer-content-right">
                    <h2>COMAPNY</h2>
                    <ul>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Delivery</li>
                        <li>Privacy policy</li>
                    </ul>
                </div>
                <div className="footer-content-right">
                    <h2>GET IN TOUCH</h2>
                    <ul>
                        <li>+1-212-456-7890</li>
                        <li>contact@tastecart.com</li>
                    </ul>

                </div>
            </div>
            <hr />
            <p className="footer-copyright">© 2026 TasteCart. All rights reserved.</p>
        </div>
    )
}

export default Footer
