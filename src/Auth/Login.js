import react, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import './Login.css';
const Login = () => {
    const [user, Setuser] = useState({ email: "", password: "" });
    let navigate = useNavigate();
    const LoginUser = async () => {

        const response = await fetch(`http://www.localhost:5000/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email:user.email, password:user.password })
        });
        const json = await response.json();
        console.log(json);
        if (response.status==200) { 
            //Save And Redirect To Home
            localStorage.setItem("token", json.token);
            localStorage.setItem("role", json.role);
            localStorage.setItem("name", json.name);
            toast.success('Login successfully!');
            navigate('/');
        } else {
            if (json.error) toast.error(`Error: ${json.message || 'Failed to Login'}`);
            else {
                alert("Some error occurred .PLease try again !");
                toast.error(`Some error occurred .PLease try again !`);
            }
        }
    }

    const handleChange = (e) => {
        Setuser({ ...user, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if ( user.email.length < 4 || user.password.length < 4) {
            toast.error("Detail should be atleast 4 characters long");
        }
        LoginUser();
    }
    return (
        <div className='outer_box'>
            <form className='login_container' onSubmit={handleSubmit}>
                <h1>Login</h1>
              
                <div className='login_row'>
                    <h4 className='login_email'>Email</h4>
                    <input type='email' name='email' onChange={handleChange} required />
                </div>
                <div className='login_row'>
                    <h4>Password</h4>
                    <input type='password' name='password' onChange={handleChange} required />
                </div>
                <button disabled={ user.password.length < 5} >Submit</button>
            </form>
        </div>

        
    );
}
export default Login;