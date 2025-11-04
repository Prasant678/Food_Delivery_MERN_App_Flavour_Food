import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css'
import { StoreContext } from '../../Context/storeContext';

const Profile = () => {
    const [user, setUser] = useState(null);
    const { url } = useContext(StoreContext);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${url}/api/v1/user/profile`, {
                    headers: { token: localStorage.getItem("token")  }
                });
                setUser(res.data.user);
            } catch (err) {
                console.log(err);
            }
        };
        fetchProfile();
    }, []);

    return (
        <div className="profile-container">
            <h2>Profile</h2>
            {user ? (
                <div>
                    <p><b>Name:</b> {user?.name}</p>
                    <p><b>Email:</b> {user?.email}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}

export default Profile