import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

/**
 * Preloader for search. Showing when search in process.
 */
class SearchPreloader extends React.Component {
    constructor(props) {
        super(props);

        // Link to preloader node
        this.preloader = null;

        // Inner search flag
        this.isSearchPerformed = false;

        // True when showing / hiding animation ended
        this.isTransitionEnd = false;

        this.setPreloaderRef = this.setPreloaderRef.bind(this);
        this.removeLoader = this.removeLoader.bind(this);
    }

    /**
     * If preloader exists, catch animation ending for remove preloader node.
     * 
     * @param  prevProps Object
     * @return void
     */
    componentDidUpdate(prevProps) {
        const prevState = prevProps.state;
        const { state, type } = this.props;

        if(this.preloader) {
            this.preloader.addEventListener('animationend', this.removeLoader);
        }
    }

    render() {
        const { state, type } = this.props;

        let layout = this.props.children;

        // If search in process, set searching flag to true
        // and show preloader layout
        if(state[type] && state[type].isSearching) {
            this.isSearchPerformed = true;

            return (
                <div className="data data_searching">
                    {layout}
                </div>
            );
        } 
        // Otherwise, if search isn't in process and search was performed,
        // show final animation. At this moment we add listener, and on
        // next component update this block was removed from DOM.
        else if(!state[type].isSearching && this.isSearchPerformed) {
            return (
                <div className="data data_searched" ref={this.setPreloaderRef}>
                    {layout}
                </div>
            );
        }

        // In all other cases just render childrens
        return layout;
    }

    /**
     * Reset search flag and clear `preloader` property.
     * After all update component.
     * 
     * @param  event Object
     * @return void
     */
    removeLoader(event) {
        event.target.removeEventListener('animationend', this.removeLoader);

        this.isSearchPerformed = false;
        this.preloader = null;

        this.forceUpdate();
    }

    setPreloaderRef(element) {
        this.preloader = element;
    }
}

// Prop Types
SearchPreloader.propTypes = {
    type: PropTypes.string.isRequired,
    state: PropTypes.object.isRequired,
};

// Connect
function mapStateToProps(state) {
    return {
        state: state.entries
    };
}

export default connect(mapStateToProps)(SearchPreloader);