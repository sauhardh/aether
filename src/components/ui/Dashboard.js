import React from 'react';
import PropTypes from 'prop-types';

const Dashboard = ({ user }) => {
    return (
        <div>
            <h1>Welcome {user.name}! Have a good day!</h1>
        </div>
    );
};

Dashboard.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string.isRequired,
    }).isRequired,
};

export default Dashboard;