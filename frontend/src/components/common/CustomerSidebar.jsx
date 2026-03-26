import React, { useContext } from 'react'
import { CustomerAuthContext } from '../context/CustomerAuth'
import { Link } from 'react-router-dom';

const CustomerSidebar = () => {

    // user logout for this sidebar 
    const { logout } = useContext(CustomerAuthContext);

    return (
        <div className='card shadow mb-5 sidebar'>
            <div className='card-body p-4'>
                <ul>
                    <li><Link to="/account/dashboard">Profile</Link></li>
                    <li><Link to="/account/orders">Orders</Link></li>
                    <li><Link to="/account/dashboard/password-change">Change Password</Link></li>
                    <li><a href='' onClick={logout} >Logout</a></li>
                </ul>
            </div>
        </div>
    )
}

export default CustomerSidebar
