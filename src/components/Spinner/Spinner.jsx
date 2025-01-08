import React from 'react';
import './Spinner.css';
import {SyncLoader} from "react-spinners";

const Spinner = () => {
    return (
        <div className="spinner">
            <SyncLoader classname="loader" color="#9c27b0" />
        </div>
    );
};

export default Spinner;