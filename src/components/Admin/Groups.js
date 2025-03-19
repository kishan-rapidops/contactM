import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import './Group.css';

export const Groups = () => {
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [users, setUsers] = useState([]);  // Store users to add to a group
    const [selectedUsers, setSelectedUsers] = useState([]);  // Store selected users
    const [isModalOpen, setIsModalOpen] = useState(false);  // Modal to create a group
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);  // Modal to add users to a group
    const [groupName, setGroupName] = useState('');
    const [currentGroupId, setCurrentGroupId] = useState(null);  // State for storing current group ID
    const [permission, setPermission] = useState('CRUD');



    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setGroupName('');
    };

    const openUserModal = (groupId) => {
        setIsUserModalOpen(true);
        setSelectedUsers([]);  // Reset selected users
        setCurrentGroupId(groupId);  // Set the current group ID when opening the modal
    };

    const closeUserModal = () => setIsUserModalOpen(false);

    const handleGroupCreation = async () => {
        if (!groupName) {
            alert("Group name is required");
            return;
        }

        try {
            const response = await fetch(`http://www.localhost:5000/api/group/creategroup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token'),
                },
                body: JSON.stringify({ name: groupName }),
            });

            const json = await response.json();
            // console.log(json);
            if (json.status === 200) {
                setGroups((prevGroups) => [...prevGroups, json]);
                closeModal();
            }
        } catch (error) {
            console.error('Error creating group:', error.message);
        }
    };

    const handleUserSelection = (e, userId) => {
        if (e.target.checked) {
            setSelectedUsers([...selectedUsers, userId]);
        } else {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        }
    };

    // Function to handle permission change
    const handlePermissionChange = (p, flg) => {
        if (flg) {
            setPermission(permission + p);
        } else {
            setPermission(permission.replace(p, ''));
        }
        console.log(permission, p, flg);

    }


    const handleAddUsersToGroup = async () => {
        if (selectedUsers.length === 0) {
            alert("Please select at least one user");
            return;
        }

        try {
            const response = await fetch(`http://www.localhost:5000/api/group/addusertogroup/${currentGroupId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token'),
                },
                body: JSON.stringify({ users: selectedUsers, permission: permission }),
            });

            const json = await response.json();

            if (json) {
                setGroups(groups.map(group =>
                    group._id === currentGroupId ? { ...group, users: json.users } : group
                ));
                closeUserModal();  // Close the user modal after successful addition
                toast.success('Users added to group successfully!');
            }
        } catch (error) {
            toast.error(`Error adding users: ${error.message}`);
        }
    };

    const handleDelGroup = async (groupId) => {
        console.log('deleting');
        try {
            const response = await fetch(`http://www.localhost:5000/api/group/deletegroup/${groupId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token'),
                },
            });

            fetchPersonalGroups();
            toast.success('Group deleted successfully!');
        } catch (error) {
            console.error('Error deleting group:', error.message);
        }
    };

    const fetchGroups = async () => {
        try {
            const response = await fetch(`http://www.localhost:5000/api/group/fetchallgroups`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token'),
                },
            });
            const json = await response.json();
            setGroups(json);
        } catch (error) {
            toast.error(`Error fetching groups:${error.message}`);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch(`http://www.localhost:5000/api/admin/fetchalluser`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token'),
                },
            });
            const json = await response.json();
            if (json.error) {
                toast.error(`Error fetching users: ${json.message}`);
            } else {
                setUsers(json);
            }
        } catch (error) {
            toast.error(`Error fetching users:  ${error.message}`);
        }
    };

    const fetchPersonalGroups = async () => {
        try {
            const response = await fetch(`http://www.localhost:5000/api/group/fetchpersonalgroups`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token'),
                },
            });
            const json = await response.json();
            console.log(json);
            setGroups(json);
        } catch (e) {
            console.error('Error fetching personal groups:', e.message);
        }
    };

    useEffect(() => {
        

        


        if (localStorage.getItem('role') == 'admin') {
            fetchGroups();
            fetchUsers();
        }
        else {
            fetchPersonalGroups();
            fetchUsers();
        }
    }, []);

    return (
        <div className="groups-page-container">
            <h2 className="groups-page-header">Group List</h2>
            <button className="create-group-btn" onClick={openModal}>Create Group</button>

            {groups.length === 0 ? (
                <p>No groups found.</p>
            ) : (

                <table className="groups-table">
                    <thead>
                        <tr>
                            <th>Group Name</th>
                            <th>Group Created At</th>
                            <th>Group Contacts</th>
                            <th>Add Users</th>  {/* New column to add users */}
                            <th>Delete Group</th>
                        </tr>
                    </thead>
                    <tbody>
                            {groups.map((group) => (
                            <tr key={group._id}>
                                <td>{group.name}</td>
                                <td>{group.date}</td>
                                <td>
                                    <button className='view-contact-btn' onClick={() => navigate(`/group/contact/${group._id}`)}>View Contacts</button>
                                </td>
                                <td>
                                    <button className='add-user-btn' onClick={() => openUserModal(group._id)}> + Add User</button> {/* Add user button */}
                                </td>
                                <td>
                                    <button
                                        className='delete-group-btn'
                                        onClick={() => handleDelGroup(group._id)} //  delete handler
                                    >
                                        <i className="fa fa-trash" aria-hidden="true"></i> {/* Font Awesome delete icon */}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>






            )}

            {/* Modal for creating a group */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <h3 className="modal-header">Create New Group</h3>
                        <input
                            className="modal-input"
                            type="text"
                            placeholder="Group Name"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                        <button className="modal-action-btn" onClick={handleGroupCreation}>Create Group</button>
                        <button className="modal-cancel-btn" onClick={closeModal}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Modal for adding users to  group  */}
            {isUserModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <h3 className="modal-header">Add Users to Group</h3>
                        {users.map((user) => (
                            <div key={user._id} className="user-item">
                                <input
                                    type="checkbox"
                                    id={`user-${user._id}`}
                                    onChange={(e) => handleUserSelection(e, user._id)}
                                />
                                <label htmlFor={`user-${user._id}`}>{user.name}</label>
                            </div>
                        ))}

                        <div className="permissions">
                            <h4>Permissions : </h4>
                            {['C', 'R', 'U', 'D'].map(p => (
                                <label key={p} className='permission-label'>
                                    <input
                                        type="checkbox"
                                        checked={permission.includes(p)}
                                        onChange={permission.includes(p) ? () => handlePermissionChange(p, false) : () => handlePermissionChange(p, true)}
                                    />
                                    {p}
                                </label>
                            ))}
                            {permission}
                        </div>

                        <button className="modal-action-btn" onClick={handleAddUsersToGroup}>Add Users</button>
                        <button className="modal-cancel-btn" onClick={closeUserModal}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};
