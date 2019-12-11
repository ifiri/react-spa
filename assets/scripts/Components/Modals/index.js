import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as modalsActions from '../../Actions/ModalsActions';

/**
 * Connect modal to state
 * 
 * @param  Modal Object
 * @return JSX
 */
function withState(Modal) {
    class StatefulModal extends React.Component {
        render() {
            return <Modal {...this.props}>
                {this.props.children}
            </Modal>;
        }
    };

    function mapStateToProps(state) {
        return {
            state: {
                modals: state.modals,
                entries: state.entries,
            }
        };
    }

    function mapDispatchToProps(dispatch) {
        return {
            actions: bindActionCreators(modalsActions, dispatch)
        };
    }

    return connect(mapStateToProps, mapDispatchToProps)(StatefulModal);
}

/**
 * Connect form with some entry data
 * 
 * @param  Form Object
 * @param  entry Object
 * @return JSX
 */
function withEntry(Form, entry) {
    return class ValueableForm extends React.Component {
        render() {
            return <Form {...this.props} entry={entry} />;
        }
    };
}

export { withState, withEntry };