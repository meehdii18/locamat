import React from 'react';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <p>&copy; 2024 Your Company. All rights reserved.</p>
            <nav>
                <ul>
                    <li><a href="/about">About Us</a></li>
                    <li><a href="/contact">Contact</a></li>
                    <li><a href="/privacy">Privacy Policy</a></li>
                </ul>
            </nav>
        </footer>
    );
}