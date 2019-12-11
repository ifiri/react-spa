import React from 'react';

import PropTypes from 'prop-types';

/**
 * Application preloader. Showing when AuthGuard component perform auth checks.
 */
class AppPreloader extends React.Component {
    render() {
        let layout = this.props.children || null;

        if(this.props.isCheckPerforming) {
            layout = <div className="data data_loading">Загружаем приложение...</div>;
        }

        return layout;
    }
}

// Prop Types
AppPreloader.propTypes = {
    isCheckPerforming: PropTypes.bool,
};

export default AppPreloader;