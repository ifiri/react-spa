import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as entriesActions from '../../Actions/EntriesActions';
import * as modalsActions from '../../Actions/ModalsActions';

import styled from 'react-emotion'
import {Formik} from "formik";
import Dropzone from 'react-dropzone';

import { withMatch } from '../Routing';

import PropTypes from 'prop-types';

import DefaultModal from '../Modals/DefaultModal';
import CropperModal from '../Modals/CropperModal';
import { withState } from '../Modals';

import ActionButtons from '../ActionButtons';
import EntriesPreloader from '../Preloaders/EntriesPreloader';

import CompanyManageForm from '../Forms/CompanyManage';
import DepartmentAddForm from '../Forms/DepartmentAdd';
import DepartmentManageForm from '../Forms/DepartmentManage';

import Common from './Common';

import {Sections, Title, MainBlock, Wrapper} from './Company.style.js';

/**
 * Clients page
 */
class Company extends Common {
    constructor(props, context) {
        super(props, context);

        this.deleteDepartament = this.deleteDepartament.bind(this);

        this.state = {
            isLoad: false
        }
    }

    componentDidMount(){
        if(!this.state.isLoad){
            this.setState({isLoad: true});
            this.props.actions.load('company',{map:{company:'transneft'}});
            this.props.actions.load('company/departments',{map:{company:'transneft'}});
        }
    }

    handleAddDepartment() {
        this.props.modalsActions.modalOpening('add-department-modal');
    }

    handleEditDepartment(department) {
        this.props.modalsActions.modalOpening('manage-department-modal', department);
    }

    























    render() {
        const entriesType = this.getEntriesType();

        // { super.render() }
        return (<>
            <EntriesPreloader {...this.props} type={ this.getEntriesType() }>
                { this.getPageContent() }
            </EntriesPreloader>

            <DefaultModal
                title="Изменить ОСТ" 
                modalId="manage-department-modal" 
                modalClass="modal_size_sm" 
                
                form={DepartmentManageForm}
            />

            <DefaultModal
                title="Добавить ОСТ" 
                modalId="add-department-modal" 
                modalClass="modal_size_sm" 
            >
                <DepartmentAddForm />
            </DefaultModal>

            <CropperModal key="cropper-modal" modalClass="modal_type_cropper" />

            { this.getMessagingModals() }
            </>
        );
    }





















    getPageContent() {
        let company = this.props.state.company.items;
        if (!company) return null;
        const departments = this.props.state['company/departments'].items;
        if (!departments) return null;

        const editMode = true;
        
        return (
            <Wrapper>
                <MainBlock>
                    <Title>О компании</Title>
                    
                    <CompanyManageForm />
                </MainBlock>

                <div style={{marginLeft:'40px'}}>
                    <Sections>
                        <Title>ОСТ</Title>
                        <ul>
                            {departments.map(d => (
                                <li key={`department_list_${d.id}`} onClick={()=>this.handleEditDepartment(d)}>{d.title}</li>
                            ))}
                        </ul>

                        <ActionButtons.Create 
                            caption="Добавить" 
                            inside={true}
                            modalId="add-department-modal"
                        />
                    </Sections>                           
                </div>
            </Wrapper>
        )
    }

    getPageTitle() {
        return null;
    }

    // getPageContent() {
    //     return (<>
    //         <CompanyManageForm />

    //         <br/><br/>

    //         { this.getEntriesListFor({ entriesType: 'company/departments', actionButtons: this.getActions() }) }
    //         </>
    //     );
    // }

    getActions() {
        const entriesType = 'company/departments';

        return {
            delete: <ActionButtons.Delete 
                onClick={this.deleteDepartament} 
                entriesType={entriesType} 
            />,
            create: <ActionButtons.Create 
                entriesType={entriesType} 
                caption="Добавить ОСТ" 
                modalId="add-department-modal"
            />
        };
    }

    /**
     * Delete selected entries, if there are blocked.
     * 
     * @param  {event} event
     * @return {void}
     */
    deleteDepartament(event) {
        const selectedEntries = this.props.state.selected;
        const entriesType = 'company/departments';

        for(const index in selectedEntries) {
            const entry = selectedEntries[index];

            this.props.actions.deleteEntry(entriesType, {
                body: entry,
                uniq: entry._uniq,
                map: {
                    departament: entry.id
                }
            });
        }
    }

    getEntriesType() {
        return 'company';
    }

    getFilter() {
        return null;
    }
}

// Prop Types
Company.propTypes = {
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
};

// Connect
function mapStateToProps(state) {
    return {
        state: state.entries
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(entriesActions, dispatch),
        modalsActions: bindActionCreators(modalsActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withMatch(Company));