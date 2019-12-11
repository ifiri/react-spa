import React from 'react';
import PropTypes from 'prop-types';
import {Formik} from "formik";

import CommonUtils from '../../Utils/Common';

import Form from '../Form';
import Error from './Elements/Error';

import { Wrapper, InputWrapper } from './Login.style';

/**
 * Login form.
 */
class Login extends React.Component {
    constructor(props) {
        super(props);

        this.form = null;

        this.setFormRef = this.setFormRef.bind(this);
    }

    handleSubmit(values) {
        const form = this.form;
        const { login,password } = values;

        const submitButton = form.querySelector('[type="submit"]');

        CommonUtils.toggleSubmitButton(submitButton);

        this.props.auth(login, password).then(() => {
            CommonUtils.toggleSubmitButton(submitButton);
        }).catch(() => {
            CommonUtils.toggleSubmitButton(submitButton);
        });
    }

    render(){
        return (
            <div className="form form_type_auth">
            <Wrapper>
                <img src={'dist/images/icons/logo.png'} />
                <div className="sublogo">Система информационной поддержки  массовых мероприятий</div>

                <Error state={this.props.state} />

                <Formik
                    ref={e => {
                        this.formik = e;
                    }}
                    initialValues={{
                        login: null,
                        password: null, 
                    }}
                    onSubmit={e=>this.handleSubmit(e)}
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
                            <InputWrapper style={{marginTop:'48px'}}>
                                <label>Логин</label>
                                <input type="text" placeholder="Введите логин" id="login" value={values.title} onChange={handleChange} />
                            </InputWrapper>
                            <InputWrapper style={{marginTop:'20px'}}>
                                <label>Пароль</label>
                                <input type="password" placeholder="Введите пароль" id="password" onChange={handleChange} value={values.password} />
                            </InputWrapper>
                            
                            <Form.Footer>
                                <Form.Submit caption="Войти" />
                            </Form.Footer>
                        </form>
                    )}}
                />
            </Wrapper>
            </div>
        )
    }

    // render() {
    //     return (
    //         <Form.Wrapper 
    //             type="auth" 
    //             onSubmit={this.onLoginFormSubmit}
    //         >
    //             <Form.Header>
    //                 <Logo />
    //             </Form.Header>

    //             <Error state={this.props.state} />

    //             <Form.Row>
    //                 <Form.Text
    //                     name="login"
    //                     placeholder="Логин"
    //                     required={true}
    //                     unlabeled={true}
    //                 />
    //             </Form.Row>

    //             <Form.Row>
    //                 <Form.Password
    //                     name="password"
    //                     placeholder="Пароль"
    //                     required={true}
    //                     unlabeled={true}
    //                 />
    //             </Form.Row>

    //             <Form.Footer>
    //                 <Form.Submit caption="Войти" />
    //             </Form.Footer>
    //         </Form.Wrapper>
    //     );
    // }

    setFormRef(element) {
        this.form = element;
    }
}

// Prop Types
Login.propTypes = {
    state: PropTypes.object.isRequired,
    auth: PropTypes.func.isRequired,
};

export default Login;