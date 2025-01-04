import React from 'react';
import PropTypes from 'prop-types';
import './Header.css';

export default function Header({ currentUser }) {
    return (
        <header className="header">
            <nav>
                <ul>
                    {currentUser && <li className="currentUser">Salut, {currentUser.email}</li>}
                    <li><a href="/home">Home</a></li>
                </ul>
            </nav>
        </header>
    );
}

Header.propTypes = {
    currentUser: PropTypes.shape({
        email: PropTypes.string,
    }),
};