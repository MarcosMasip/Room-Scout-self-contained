import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginRegisterForm.css';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { HiIdentification } from "react-icons/hi2";
import axios from 'axios';
import { API_BASE } from '../../../api/baseUrl';

const LoginRegisterForm = () => {
    const [action, setAction] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [username, setUsername] = useState('');
    const [identification, setIdentification] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const navigate = useNavigate();

    const registerLink = () => {
        setAction('active');
    };

    const loginLink = () => {
        setAction('');
    };

    const registerUser = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${API_BASE}/users`, {
                username,
                identification: parseInt(identification),
                email,
                name,
                surname,
                password,
                role: "User"
            });
            console.log('User registered:', response.data);
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('identification', response.data.id);
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('document', response.data.identification);
            navigate('/');
        } catch (err) {
            if (err.response && err.response.data) {
                alert('Error: ' + err.response.data.message);
            } else {
                console.error('Error registering user:', err);
            }
        }
    };

    const loginUser = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${API_BASE}/users/login`, {
                email: loginEmail,
                password: loginPassword
            });
            console.log('Login successful:', response.data);
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('identification', response.data.id);
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('document', response.data.identification);
            
            navigate('/');
        } catch (err) {
            console.error('Error logging in:', err);
            alert('Invalid identification or password.');
        }
    };

    return (
        <div className={`form-container ${action}`}>
            <div className='form-box login'>
                <form onSubmit={loginUser}>
                    <h1>Login</h1>
                    <div className='input-box'>
                        <input 
                            type="text" 
                            placeholder='Enter your Email' 
                            value={loginEmail} 
                            onChange={(e) => setLoginEmail(e.target.value)} 
                            required 
                        />
                        <HiIdentification className="icon"/>
                    </div>
                    <div className='input-box'>
                        <input 
                            type="password" 
                            placeholder='Enter your password' 
                            value={loginPassword} 
                            onChange={(e) => setLoginPassword(e.target.value)} 
                            required 
                        />
                        <FaLock className="icon"/>
                    </div>
                    <div className='remember-forgot'>
                        <label className='label-holder'><input type="checkbox"/>Remember me</label>
                        <button type='button' className='link-button'>Forgot password?</button>
                    </div>

                    <button type='submit'>Login</button>
                    <div className='register-link'>
                        <p>Don't have an account? <button type='button' className='link-button' onClick={registerLink}>Register</button></p>
                    </div>
                </form>
            </div>

            <div className='form-box register'>
                <form onSubmit={registerUser}>
                    <h1>Registration</h1>
                    <div className='input-box'>
                        <input type="text" placeholder='Enter your Id' value={identification} onChange={(e) => setIdentification(e.target.value)} required/>
                        <HiIdentification className="icon"/>
                    </div>
                    <div className='input-box'>
                        <input type="text" placeholder='Enter your name' value={name} onChange={(e) => setName(e.target.value)} required/>
                        <FaUser className="icon"/>
                    </div>
                    <div className='input-box'>
                        <input type="text" placeholder='Enter your surname' value={surname} onChange={(e) => setSurname(e.target.value)} required/>
                        <FaUser className="icon"/>
                    </div>
                    <div className='input-box'>
                        <input type="text" placeholder='Enter your username' value={username} onChange={(e) => setUsername(e.target.value)} required/>
                        <FaUser className="icon"/>
                    </div>
                    <div className='input-box'>
                        <input type="email" placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
                        <FaEnvelope className="icon"/>
                    </div>
                    <div className='input-box'>
                        <input type="password" placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
                        <FaLock className="icon"/>
                    </div>
                    <div className='remember-forgot'>
                        <label className='label-holder'><input type="checkbox" required/>I agree to the terms & conditions</label>
                    </div>

                    <button type='submit'>Register</button>
                    <div className='register-link'>
                        <p>Already have an account? <button type='button' className='link-button' onClick={loginLink}>Login</button></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginRegisterForm;

