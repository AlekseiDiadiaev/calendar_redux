import './joinModal.scss';
import { useState } from 'react';
import { auth } from "../../firebase";
import { doc, setDoc } from "firebase/firestore"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toggleJoinModalShowed } from '../../redux/actions'
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage, useField } from 'formik';
import * as Yup from 'yup';
import { db } from '../../firebase';

const JoinModal = () => {
    const dispatch = useDispatch();
    const [errorAuth, setErrorAuth] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false);

    const handleJoin = (values) => {
        setIsDisabled(true)
        const {email, password, name} = values;
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => { 
            setIsDisabled(false)
            dispatch(toggleJoinModalShowed()) 
            return userCredential.user.uid;
          })
          .then((uid) => {
                setDoc(doc(db, "users", uid), {
                    uid: uid,
                    name: name
                });
                setErrorAuth(false)
          })
          .catch((error) => {
            setIsDisabled(false)
            setErrorAuth(true)
            console.error('error', error)
          });
    };

    return (
        <>  
            <div className="overlay" onMouseDown={() => dispatch(toggleJoinModalShowed())}>
                <div  className="join-modal"    onMouseDown={(e) => e.stopPropagation()}>
                    <div className="join-modal__wrapper-close">
                        Join to us
                        <button className="event-modal__close" onClick={() => dispatch(toggleJoinModalShowed())}>                               
                        </button>
                    </div>
                    {errorAuth && <div className="join-modal__error">An error occurred during registration, 
                    you may have entered a non-existent email.</div>}
                    <Formik
                        initialValues = {{
                            name: '',
                            email: '',
                            password: '',
                        }}
                        validationSchema={ Yup.object({
                            name: Yup.string()
                                    .min(2, 'Min 2 letters')
                                    .required('Required field'),
                            email: Yup.string()
                                    .email('Invalid email address')
                                    .required('Required field'),
                            password: Yup.string()
                                    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.{8,})/, 'Weak password')
                                    .required('Password required')
                        })}
                        onSubmit = {handleJoin}
                    >
                        <Form className="join-modal__form">
                            
                            <Field name="name">
                                {({ field, form, meta }) => {
                                    return(  
                                    <>
                                        <label htmlFor='join-modal__name' className="join-modal__label">Name</label>
                                        <input  className="join-modal__input" type="text" placeholder="Name" id="join-modal__name" {...field}/>
                                        {meta.touched && meta.error && <div className="join-modal__error">{meta.error}</div>}
                                    </>
                                )}}
                            </Field>

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

                            <button className="btn join-modal__create" type="submit" disabled={isDisabled}>Create account</button>
                            <button className="btn join-modal__reset" type="reset">Reset</button>
                        </Form>    
                    </Formik>
                    
                </div>
            </div>
        </>
    )
}

export default JoinModal;