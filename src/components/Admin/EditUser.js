import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './EditUser.css';

export const EditUser = () => {
    const { state } = useLocation();
    const [user, setUser] = useState(state.user);
    const [permissionGrp, setPermissionGrp] = useState(user.permissiongrp || []);
    const [permissionUser, setPermissionUser] = useState(user.permissionuser || []);
    const navigate = useNavigate();

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (user.name) {
            setUser({ ...user, [name]: value });
        } else {
            user.name = value;
        }
    };

    // Convert array to string (e.g., ['C', 'R'] => 'CR')
    const getPermissionString = (permissionArray) => {
        return permissionArray.join('');
    };

    // Handle checkbox change (add/remove permission)
    const handlePermissionChange = (permission, isGroupPermission) => {
        if (isGroupPermission) {
            setPermissionGrp((prev) => {
                const updatedPermissions = prev.includes(permission)
                    ? prev.filter((p) => p !== permission) // remove permission
                    : [...prev, permission]; // add permission
                return updatedPermissions;
            });
        } else {
            setPermissionUser((prev) => {
                const updatedPermissions = prev.includes(permission)
                    ? prev.filter((p) => p !== permission) // remove permission
                    : [...prev, permission]; // add permission
                return updatedPermissions;
            });
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_HOSTURL}/api/admin/updateuser/${user._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token'),
                },
                body: JSON.stringify({
                    ...user,
                    permissiongrp: getPermissionString(permissionGrp), // Convert array to string for group permissions
                    permissionuser: getPermissionString(permissionUser), // Convert array to string for user permissions
                }),
            });

            const result = await response.json();
            if (response.status === 200) {
                navigate('/admin/userlist');
                toast.success('User updated successfully');
            } else {
                toast.error('Failed to update user');
            }
        } catch (error) {
            toast.error('Failed to update user');
        }
    };

    return (
        <div className="edit-user-page-container">
            <h2 className="edit-user-page-header">Edit User</h2>
            <form className="edit-user-form" onSubmit={handleSubmit}>
                <label className="edit-user-form-label">
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        className="edit-user-form-input"
                    />
                </label>
                <label className="edit-user-form-label">
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        className="edit-user-form-input"
                    />
                </label>
                <label className="edit-user-form-label">
                    Role:
                    <input
                        type="text"
                        name="role"
                        value={user.role}
                        onChange={handleChange}
                        className="edit-user-form-input"
                    />
                </label>
                <label className="edit-user-form-label">
                <h4>Group Permissions:</h4>
                {['C', 'R', 'U', 'D'].map((p) => (
                    <label key={p} className="permission-label">
                        <input
                            type="checkbox"
                            checked={permissionGrp.includes(p)}
                            onChange={() => handlePermissionChange(p, true)} // Handle permission for group
                        />
                        {p}
                    </label>
                ))}
                </label>
                
                <label className="edit-user-form-label">
                <h4>User Permissions:</h4>
                {['C', 'R', 'U', 'D'].map((p) => (
                    <label key={p} className="permission-label">
                        <input
                            type="checkbox"
                            checked={permissionUser.includes(p)}
                            onChange={() => handlePermissionChange(p, false)} // Handle permission for user
                        />
                        {p}
                    </label>
                ))}
                </label>

                <button type="submit" className="edit-user-form-btn submit-btn">
                    Update
                </button>
            </form>
        </div>
    );
};
