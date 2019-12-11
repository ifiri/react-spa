import React from 'react';
import PropTypes from 'prop-types';

import { withEntry } from '../Modals';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import blue from '@material-ui/core/colors/blue';

/**
 * Base abstract class for all modals in application.
 */
class CommonModal extends React.Component {
    constructor(props) {
        super(props);

        // True if modal content started to load
        this.isLoadingStarted = false;

        // Links to loader and modal nodes
        this.loader = null;
        this.modal = null;

        this.setLoaderRef = this.setLoaderRef.bind(this);
        this.setModalRef = this.setModalRef.bind(this);

        this.dismissModal = this.dismissModal.bind(this);
        this.dismissCurrentModal = this.dismissCurrentModal.bind(this);

        this.onEntering = this.onEntering.bind(this);



        // Connected to entry form
        this.ValueableForm = null;
        this.entry = null;
    }

    onEntering() {
        //
    }

    /**
     * On every update check modal status and loader status
     * If modal is loading and loader is exists, add listener
     * for catch loading animation end.
     *
     * If modal is opened, initialize custom scrollbars, and,
     * if modal closed, reset loading flag.
     * 
     * @param  prevProps Object
     * @return void
     */
    componentDidUpdate(prevProps) {
        const { state: prevState } = prevProps;
        const { state: currentState } = this.props;

        const prevModalStatus = this.getModalStatusFrom(prevState);
        const currentModalStatus = this.getModalStatusFrom(currentState);

        const loader = this.loader;

        if(prevModalStatus !== 'closed' && loader) {
            loader.addEventListener('transitionend', this.removeLoader);
        }

        if(currentModalStatus === 'closed') {
            this.isLoadingStarted = false;
        }
    }

    render(header = null) {
        const { state } = this.props;
        const modalStatus = this.getModalStatusFrom(state);
        const modalId = this.getModalId();
        const classname = this.getModalClassname();
        const style = this.getModalStyle();

        if(modalStatus === 'closed') {
            return null;
        }

        const isOpen = modalStatus === 'closing' ? false : true;

        const content = this.getModalContent();

        return (
            <Dialog 
                className={classname} 
                id={modalId} 

                style={style}
                BackdropProps={{
                    style: style
                }}

                PaperProps={{
                    className: "modal__dialog"
                }}
                scroll="body"

                onBackdropClick={this.dismissCurrentModal}
                transitionDuration={250}

                open={isOpen}
            >
                <div className="modal__content">
                    <div ref={this.setLoaderRef} className="modal__loader" data-caption="Загружаем данные..."></div>
                    
                    { this.getHeader() }

                    <div className="modal__body">
                        { this.getModalContent() }
                    </div>

                    { this.getFooter() }
                </div>
            </Dialog>
        );

        return (
            <div 
                className={classname} 
                id={modalId} 
                style={style}

                tabIndex="-1" 
                role="dialog" 
                aria-hidden="true" 

                ref={this.setModalRef} 
                onClick={this.dismissModal}
            >
                <div className="modal__dialog" role="document">
                    <div className="modal__content">
                        <div ref={this.setLoaderRef} className="modal__loader" data-caption="Загружаем данные..."></div>
                        
                        { this.getHeader() }

                        <div className="modal__body">
                            { this.getModalContent() }
                        </div>

                        { this.getFooter() }
                    </div>
                </div>
            </div>
        );
    }

    /**
     * Gets and return modal data from state. All data, passed
     * to modal, stored in state with specific modal ID.
     * 
     * @return Object | null
     */
    getModalData() {
        const modalId = this.getModalId();
        const { state } = this.props;
        const data = state.modals.modals[modalId + '.' + 'data'] || null;

        return data;
    }

    /**
     * Unique presentation of curent entry. Now this is just a JSON string.
     * Using when we need compare some entries between themselves.
     * 
     * @param  entry Object
     * @return String
     */
    getEntryHash(entry) {
        if(!entry) {
            return null;
        }

        const hash = JSON.stringify(entry);

        return hash;
    }

    /**
     * Entry compare function. Get JSON presentation of
     * current and previous entries and compare it.
     * If entries is the same, return true.
     * 
     * @param  previous Object
     * @return Boolean
     */
    isEntrySimilarTo(previous) {
        const entry = this.entry;

        const prevHash = this.getEntryHash(previous);
        const currentHash = this.getEntryHash(entry);

        if(prevHash === currentHash) {
            return true;
        }

        return false;
    }

    /**
     * Returns modal content. If modal content just text or JSX layout,
     * return it without any changes. If you want it, just pass that content
     * in props.children.
     *
     * If modal have property `form` in props, it means, modal have dynamic content.
     * Form should be entriesful, so we use HOC for create valueable form from common form,
     * for bind form with modal data. In this case, this function return valuable form.
     * 
     * @return JSX
     */
    getModalContent() {
        const { state, form, formProps = {} } = this.props;
        const modalStatus = this.getModalStatusFrom(state);
        const data = this.getModalData();

        // If we have form, make it valueable, i.e. bind it with modal data
        if(form) {
            // Valueable form stores in class property, and creates only once
            if(!this.ValueableForm || !this.isEntrySimilarTo(data)) {
                const ValueableForm = withEntry(form, data);

                this.ValueableForm = <ValueableForm {...formProps} entry={data} dismissModal={this.dismissCurrentModal} />;
                this.entry = data;
            }

            return this.ValueableForm;
        }

        return this.props.children;
    }

    /**
     * Returns modal ID from props
     *
     * @return String
     */
    getModalId() {
        const { modalId = null } = this.props;

        return modalId;
    }

    /**
     * Modal statuses storing in state. This function get it and return.
     * 
     * @param  state Object
     * @return String
     */
    getModalStatusFrom(state) {
        const modalId = this.getModalId();
        const modalStatus = state.modals.modals[modalId] || 'closed';

        return modalStatus;
    }

    /**
     * Returns modal classname for current modal status.
     * Modal classname is dynamic and changes every time when
     * modal status is changed.
     * 
     * @return String
     */
    getModalClassname() {
        const modalId = this.getModalId();

        const { state, modalClass = null } = this.props;
        const { isPreloaderRequired = false } = this.props;

        const modalStatus = this.getModalStatusFrom(state);

        let classnames = ['modal', modalClass, 'modal_' + modalStatus];

        if(isPreloaderRequired) {
            if(state.entries.isLoading) {
                classnames.push('modal_loading');

                this.isLoadingStarted = true;
            } else if(this.isLoadingStarted) {
                classnames.push('modal_loaded');
            }
        }

        return classnames.join(' ');
    }

    getModalStyle() {
        const modalId = this.getModalId();

        const header = document.getElementById('header');

        if(!header) {
            return {};
        }

        const headerHeight = header.offsetHeight;

        return {
            top: headerHeight,
            minHeight: `calc(100% / ${headerHeight})`
        };
    }

    /**
     * Returns modal title
     * 
     * @return String
     */
    getTitle() {
        const { title = null } = this.props;

        return title;
    }

    /**
     * Returns layout of modal header
     *
     * @return JSX
     */
    getHeader() {
        const title = this.getTitle();

        if(!title) {
            return this.getCloseButton();
        }

        return (
            <div className="modal__header">
                <DialogTitle className="modal__title">{title}</DialogTitle>

                { this.getCloseButton() }
            </div>
        );
    }

    /**
     * By default, modal haven't a footer.
     * 
     * @return null
     */
    getFooter() {
        return null;
    }

    /**
     * Returns close button for dismissing current modal
     * 
     * @return JSX
     */
    getCloseButton() {
        return <button className="modal__close" type="button" onClick={this.dismissModal}>
            <span aria-hidden="true">&times;</span>
        </button>;
    }

    dismissCurrentModal() {
        const modalId = this.getModalId();

        this.props.actions.modalClosing(modalId);
    }
    
    /**
     * If event target is one of modal-closing elements,
     * dismiss current modal.
     * 
     * @param  event Object
     * @return void
     */
    dismissModal(event) {
        const element = event.target;

        if(
            element.classList.contains('modal') 
            || 
            element.classList.contains('modal__close')
            ||
            element.closest('.modal__close')
        ) {
            this.dismissCurrentModal();

            event.preventDefault();
            event.stopPropagation();
        }
    }

    setLoaderRef(element) {
        this.loader = element;
    }

    setModalRef(element) {
        this.modal = element;
    }

    /**
     * Removes loader node from DOM
     * 
     * @param  event Object
     * @return void
     */
    removeLoader(event) {
        this.isLoadingStarted = false;

        if(event.target) {
            event.target.removeEventListener('transitionend', this.removeLoader);
            event.target.remove();
        }

        this.loader = null;
    }
}

export default CommonModal;