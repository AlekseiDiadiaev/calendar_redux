import './loginModal.scss';
import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toggleLoginModalShowed, userFetched } from '../../redux/actions'
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage, useField } from 'formik';
import * as Yup from 'yup';

const LoginModal = () => {
    const dispatch = useDispatch();
    const [errorAuth, setErrorAuth] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const handleLogin = (values) => {
        setIsDisabled(true)
        const auth = getAuth();
        const {email, password} = values;
        signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            setIsDisabled(false)
            dispatch(toggleLoginModalShowed(false))
            setErrorAuth(false)
        })
        .catch((error) => {
            setIsDisabled(false)
            setErrorAuth(true)
            console.error(error)
        });
    };

    return (
        <>  
            <div className="overlay" onMouseDown ={() => dispatch(toggleLoginModalShowed())}>
                <div  className="join-modal"    onMouseDown={(e) => e.stopPropagation()} >
                    <div className="join-modal__wrapper-close">
                        Log in
                        <button className="event-modal__close" onClick={() => dispatch(toggleLoginModalShowed())}>                               
                        </button>
                    </div>
                    {errorAuth && <div className="join-modal__error">An error occurred while logging into your account, 
                    please check your details and try again.</div>}
                    <Formik
                        initialValues = {{
                            email: '',
                            password: '',
                        }}
                        validationSchema={ Yup.object({
                            email: Yup.string()
                                    .email('Invalid email address')
                                    .required('Required field'),
                            password: Yup.string()
                                    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.{8,})/, 'Weak password')
                                    .required('Password required')
                        })}
                        onSubmit = {handleLogin}
                    >
                        <Form className="join-modal__form">

                            <Field name="email" >
                                {({ field, form, meta }) => (  
                                    <>
                                        <label htmlFor='join-modal__email' className="join-modal__label">Email</label>
                                        <input  type="email" placeholder="Email" className="join-modal__input" id='join-modal__email'{...field}/>
                                        {meta.touched && meta.error && <div className="join-modal__error">{meta.error}</div>}
                                    </>
                                )}
                            </Field>

                            <Field name="password">
                                {({ field, form, meta }) => (  
                                    <>
                                        <label htmlFor='join-modal__pass' className="join-modal__label">Password</label>
                                        <input type="password"  placeholder="Password" className="join-modal__input" id='join-modal__pass'{...field}/>
                                        {meta.touched && <div className="join-modal__error">{meta.error}</div>}
                                    </>
                                )}
                            </Field>

                            <button className="btn join-modal__create" type="submit" disabled={isDisabled}>Log in</button>
                            <button className="btn join-modal__reset" type="reset">Reset</button>
                        </Form>    
                    </Formik>
                </div>
            </div>
        </>
    )
}

export default LoginModal;

// const MyTextInput = ({label, ...props}) => {
    
//     return (
//         <>
//             <label htmlFor={props.name}>{label}</label>
//             <input
//                 {...props}
//                 {...field}
//             />
//             {meta.touched && meta.error ? <div className='error'>{meta.error}</div> : null}
//         </>
//     )
// }