import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './Profile.css';

function Profile() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        contactNo: user?.contactNo || '',
        address: user?.address || '',
        profilePic: user?.profilePic || ''
    });

    const handleProfilePicClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {

            if (file.size > 5 * 1024 * 1024) {
                alert("File is too large! Please choose an image smaller than 5MB.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result;

                setUser(prev => ({ ...prev, profilePic: base64String }));

                try {
                    const res = await axios.put(`https://ecommerce-deploy-production.up.railway.app/api/users/${user.id}`, {
                        ...user,
                        profilePic: base64String
                    });

                    localStorage.setItem("user", JSON.stringify(res.data));
                    setFormData(prev => ({ ...prev, profilePic: base64String }));

                } catch (err) {
                    console.error("Error updating profile pic on server", err);
                    alert("The image was too large for the server. Try a smaller image.");
                    setUser(JSON.parse(localStorage.getItem("user")));
                }
            };

            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (!user) {
            window.location.href = "/login";
            return;
        }

        const fetchLatestProfile = async () => {
            try {
                const res = await axios.get(`https://ecommerce-deploy-production.up.railway.app/api/users/${user.id}`);

                if (res.data && res.data.username) {

                    localStorage.setItem("user", JSON.stringify(res.data));
                    setUser(res.data);

                    setFormData({
                        username: res.data.username || '',
                        email: res.data.email || '',
                        contactNo: res.data.contactNo || '',
                        address: res.data.address || '',
                        profilePic: res.data.profilePic || ''
                    });

                } else {
                    console.warn("Fetched profile was empty or invalid.");
                }

            } catch (err) {
                console.error("Error fetching latest profile", err);
            }
        };

        fetchLatestProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const res = await axios.put(`https://ecommerce-deploy-production.up.railway.app/api/users/${user.id}`, {
                ...user,
                ...formData
            });

            localStorage.setItem("user", JSON.stringify(res.data));
            setUser(res.data);
            setIsEditing(false);

            alert("Profile updated successfully!");

        } catch (err) {
            console.error("Error updating profile", err);
            alert("Failed to update profile.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    if (!user) return null;

    return (
        <div className="profile-container">
            <Navbar />

            <div className="profile-card">

                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleFileChange}
                />

                <div className="profile-header">

                    <div className="profile-pic-container" onClick={handleProfilePicClick}>
                        <img
                            src={user.profilePic || "https://via.placeholder.com/150"}
                            alt="Profile"
                            className="profile-pic"
                        />
                        <div className="profile-pic-overlay">
                            <span>Change Photo</span>
                        </div>
                    </div>

                    <h2>{user.username}</h2>
                    <p className="user-role">{user.role}</p>

                </div>

                {!isEditing ? (

                    <div className="profile-details">

                        <div className="detail-group">
                            <label>Email:</label>
                            <p>{user.email || 'Not set'}</p>
                        </div>

                        <div className="detail-group">
                            <label>Contact No:</label>
                            <p>{user.contactNo || 'Not set'}</p>
                        </div>

                        <div className="detail-group">
                            <label>Address:</label>
                            <p>{user.address || 'Not set'}</p>
                        </div>

                        <div className="profile-actions">
                            <button className="btn-edit-profile" onClick={() => setIsEditing(true)}>Edit Profile</button>
                            <button className="btn-logout" onClick={handleLogout}>Logout</button>
                        </div>

                    </div>

                ) : (

                    <form className="profile-form" onSubmit={handleSubmit}>

                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Contact No</label>
                            <input type="number" name="contactNo" value={formData.contactNo} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Address</label>
                            <textarea name="address" value={formData.address} onChange={handleChange}></textarea>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-save-profile">Save Changes</button>
                            <button type="button" className="btn-cancel-profile" onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>

                    </form>

                )}

            </div>
        </div>
    );
}

export default Profile;