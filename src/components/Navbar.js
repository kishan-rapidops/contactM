

import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Navbar.css';
import { useEffect } from 'react';



export const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        toast.success('Logout successfully!');
        navigate('/signup');
    }
    useEffect(()=>{
        if(!localStorage.getItem('token')){
            navigate('/signup');
        }
    },[]);
    return (
        <div className='navbar'>
            <div className='logo'>{ localStorage.getItem("name") }</div>
            <div className='links'>
                <Link className={`link ${location.pathname==='/'? "active": ""}`}   to='/'>Home</Link>
                <Link className={`link ${location.pathname === '/about' ? "active" : ""}`} to='/about'>About</Link>
                <Link className={`link ${location.pathname === '/group' ? "active" : ""}`} to='/group'>Groups</Link>
            </div>
            <div>
                  
                {!localStorage.getItem('token') ? (<>
                    <Link className={`link ${location.pathname === '/login' ? "active" : ""}`} to='/login'>Login</Link>
                    <Link className={`link ${location.pathname === '/signup' ? "active" : ""}`} to='/signup'>Signup</Link>
                </>)
                    :
                    (<h5 className="nav_logout" onClick={handleLogout}>Logout</h5>)}
                   
            </div>
        </div>
    );
}