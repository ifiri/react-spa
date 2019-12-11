import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import {Formik} from "formik";
import Dropzone from 'react-dropzone';
import Form from '../Form';
import ActionButtons from '../ActionButtons';

import Common from './Common';

import CommonUtils from '../../Utils/Common';
import * as entriesActions from '../../Actions/EntriesActions';

import { UploadLine, InputWrapper, BottomButtons } from './Company.style';

/**
 * Form for update existing company.
 */
class CompanyManage extends Common {
    constructor(props) {
        super(props);

        this.logoBlob = null;

        this.setLogoBlob = this.setLogoBlob.bind(this);
        this.setFormRef = this.setFormRef.bind(this);
    }

    setFormRef(element) {
        this.form = element;
    }

    componentDidMount() {
        const entriesType = this.getEntriesType();

        if(!this.getEntries(entriesType) && !this.isLoadPerformed() && !this.isLoadStarted()) {
            // this.props.entriesActions.load(entriesType, {
            //     map: {
            //         company: 'transneft'
            //     }
            // });

            // this.props.entriesActions.load('company/departments',{map:{company:'transneft'}});
        }
    }




    handleSubmit(values){
        const entry = this.getEntry();
        const entriesType = this.getEntriesType();
        const form = this.form;

        const body = CommonUtils.objectify(form);

        this.props.entriesActions.update(entriesType, {
            form: form,
            uniq: entry._uniq,
            body: values

            // {
            //     title: body.title,
            //     description: body.description,

            //     file: this.logoBlob
            // }
        });
    }




    handleVideoDrop(acceptedFiles,rejectedFiles,setFieldValue){
        setFieldValue('file',acceptedFiles[0]);
    }




    render() {
        let company = this.props.state.entries.company.items;
        if (!company) return null;
        const departments = this.props.state.entries['company/departments'].items;
        if (!departments) return null;

        return (
            <Formik
                ref={e => {
                    this.formik = e;
                }}
                initialValues={{
                    id: company.id,
                    title: company.title,
                    description:company.description,
                    file: null
                }}
                onSubmit={e=>this.handleSubmit(e,company)}
                render={({
                    values,
                    errors,
                    touched,
                    handleSubmit,
                    handleChange,
                    setFieldValue,
                    isSubmitting,
                    status,
                }) => {return (
                    <form onSubmit={handleSubmit} ref={this.setFormRef}>
                        <InputWrapper style={{marginTop:'8px'}}>
                            <label>Название компании</label>
                            <input type="text" placeholder="Укажите название" id="title" value={values.title} onChange={handleChange} />
                        </InputWrapper>
                        <InputWrapper style={{marginTop:'8px'}}>
                            <label>Описание компании</label>
                            <textarea style={{minHeight:'400px'}} placeholder="Укажите описание компании" id="description" onChange={handleChange}>{values.description}</textarea>
                        </InputWrapper>
                        <InputWrapper style={{marginTop:'24px'}}>
                            <label>Загрузка видеоролика о компании</label>
                            <Dropzone className="dropzone"
                                onDrop={(a,b)=>this.handleVideoDrop(a,b,setFieldValue)}
                            >
                                <p id="uploadPlaceholder" className="dropzone-placeholder">{values.file ? values.file.name : 'Перетащите видеоролик для загрузки'}</p>
                                <UploadLine id="uploadLine">
                                    <div className="file-name">{values.file ? values.file.name : null} <span id="uploadInfo"></span></div>
                                    <div className="all-line">
                                        <div className="ready"></div>
                                    </div>
                                </UploadLine>
                            </Dropzone>
                        </InputWrapper>
                        
                        <Form.Footer>
                            <Form.Submit caption="Сохранить" />
                        </Form.Footer>
                    </form>
                )}}
            />
        );
    }





























    // render() {
    //     const entry = this.getEntry();

    //     return (
    //         <Form.Wrapper onSubmit={this.onFormSubmit}>
    //             <Form.Row>
    //                 <Form.Column>
    //                     <Form.Text
    //                         name="title"
    //                         label="Название компании"
    //                         placeholder="Введите название компании"
    //                         required={true}
    //                         value={entry.title || null}
    //                     />
    //                 </Form.Column>
    //             </Form.Row>

    //              <Form.Row>
    //                 <Form.Column>
    //                     <Form.TextArea
    //                         label="Описание компании"
    //                         name="description"
    //                         placeholder="Введите описание компании"
    //                         required={true}
    //                         value={entry.description || null}
    //                     />
    //                 </Form.Column>
    //             </Form.Row>

    //              <Form.Row>
    //                 <Form.Column>
    //                     <Form.File 
    //                         label="Презентационный видеоролик"
    //                         setLogoBlob={this.setLogoBlob} 
    //                         name="file" 
    //                         accept=".mp4"
    //                         id="company-manage-video" 
    //                         value={entry.video_url} 
    //                     />
    //                 </Form.Column>
    //             </Form.Row>

    //             <Form.Footer>
    //                 <Form.Submit caption="Обновить" />

    //                 <span className="progress" data-progress-for="company"></span>
    //             </Form.Footer>

    //             <Form.Hidden
    //                 name="video_url"
    //                 value={entry.video_url || null}
    //             />

    //             <Form.Hidden
    //                 name="video_preview"
    //                 value={entry.video_preview || null}
    //             />
    //         </Form.Wrapper>
    //     );
    // }

    getEntry() {
        const entriesType = this.getEntriesType();
        const entry = this.props.state.entries[entriesType].items || {};

        return entry;
    }

    

    getEntriesType() {
        return 'company';
    }

    setLogoBlob(blob) {
        this.logoBlob = blob;
    }
}

// Prop Types
CompanyManage.propTypes = {
    entry: PropTypes.object,

    state: PropTypes.object,
    entriesActions: PropTypes.object.isRequired,
};

// Connect
function mapStateToProps(state) {
    return {
        state: state
    };
}

function mapDispatchToProps(dispatch) {
    return {
        entriesActions: bindActionCreators(entriesActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyManage);