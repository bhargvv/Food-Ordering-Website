import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
const Footer = () => {
    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    <img src={assets.logo} alt='' className="footer-logo" />
                    <p>TasteCart makes ordering your favorite food simple, fast, and convenient.
                        Discover delicious dishes, explore our menu, and enjoy a smooth ordering experience.
                        Fresh choices, easy ordering, and great taste — all in one place.</p>
                    <div className="footer-social-icons">
                        <div className="social-icon-wrapper"><img src={assets.facebook_icon} alt="" /></div>
                        <div className="social-icon-wrapper"><img src={assets.twitter_icon} alt="" /></div>
                        <div className="social-icon-wrapper"><img src={assets.linkedin_icon} alt="" /></div>
                    </div>
                </div>
                <div className="footer-content-right">
                    <h2>COMPANY</h2>
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
                        <li>+91 9110983012</li>
                        <li>dbhargav030.08@gmail.com</li>
                    </ul>

                </div>
            </div>
            <hr />
            <p className="footer-copyright">© 2026 TasteCart. All rights reserved.</p>
        </div>
    )
}

export default Footer
