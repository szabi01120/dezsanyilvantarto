// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from '../utils/axios';
import { FiUser, FiMail, FiLock, FiEdit2, FiCalendar } from 'react-icons/fi';

const Profile = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        real_name: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/users/me');
                setUserData(response.data.data);
                setFormData({
                    username: response.data.data.username,
                    email: response.data.data.email,
                    real_name: response.data.data.real_name,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } catch (err) {
                setError('Hiba történt az adatok betöltésekor');
            }
        };

        fetchUserData();
    }, []);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
        setSuccess('');
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const updateData = {};

            if (formData.email !== userData.email) updateData.email = formData.email;
            if (formData.username !== userData.username) updateData.username = formData.username;
            if (formData.real_name !== userData.real_name) updateData.real_name = formData.real_name;

            if (Object.keys(updateData).length === 0) {
                setError('Nincs módosítandó adat!');
                return;
            }

            const response = await axios.put(`/users/${userData.id}`, updateData);
            setUserData(response.data);
            setSuccess('Profil sikeresen frissítve!');
            setIsEditing(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Hiba történt a módosítás során');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            setError('Minden mező kitöltése kötelező!');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('A megadott jelszavak nem egyeznek!');
            return;
        }

        if (formData.currentPassword === formData.newPassword) {
            setError('Az új jelszó nem lehet azonos a régi jelszóval!');
            return;
        }

        try {
            await axios.put(`/users/${userData.id}`, {
                current_password: formData.currentPassword,
                password: formData.newPassword
            });
            setSuccess('Jelszó sikeresen módosítva!');
            setFormData({
                ...formData,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err) {
            setError(err.response?.data?.error || 'Hiba történt a jelszó módosítása során');
        }
    };

    if (!userData) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl uppercase">
                            {userData.username[0]}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{userData.real_name}</h1>
                            <p className="text-gray-600">@{userData.username}</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="flex border-b">
                        <button
                            className={`flex-1 py-4 px-6 text-center ${activeTab === 'profile'
                                ? 'border-b-2 border-blue-500 text-blue-500'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                            onClick={() => setActiveTab('profile')}
                        >
                            <FiUser className="inline-block mr-2" />
                            Profil Adatok
                        </button>
                        <button
                            className={`flex-1 py-4 px-6 text-center ${activeTab === 'security'
                                ? 'border-b-2 border-blue-500 text-blue-500'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                            onClick={() => setActiveTab('security')}
                        >
                            <FiLock className="inline-block mr-2" />
                            Biztonság
                        </button>
                    </div>

                    <div className="p-6">
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                                {success}
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <form onSubmit={handleProfileUpdate}>
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Teljes név
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="real_name"
                                                value={formData.real_name}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                            />
                                            <FiUser className="absolute left-3 top-3 text-gray-400" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Email cím
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                            />
                                            <FiMail className="absolute left-3 top-3 text-gray-400" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Regisztráció dátuma
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={new Date(userData.created_at).toLocaleDateString()}
                                                disabled
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                                            />
                                            <FiCalendar className="absolute left-3 top-3 text-gray-400" />
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-3 mt-4">
                                        {!isEditing ? (
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(true)}
                                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                <FiEdit2 className="mr-2" />
                                                Szerkesztés
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        setFormData({
                                                            ...userData,
                                                            currentPassword: '',
                                                            newPassword: '',
                                                            confirmPassword: ''
                                                        });
                                                    }}
                                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                >
                                                    Mégse
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                >
                                                    Mentés
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </form>
                        )}

                        {activeTab === 'security' && (
                            <form onSubmit={handlePasswordChange}>
                                <div className="space-y-6">
                                    <div className="mt-4 p-4 bg-gray-100 rounded-md">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                                            Jelszó követelmények:
                                        </h4>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li className="flex items-center">
                                                <span className={`mr-2 text-${formData.newPassword.length >= 8 ? 'green' : 'gray'}-500`}>
                                                    {formData.newPassword.length >= 8 ? '✓' : '•'}
                                                </span>
                                                Legalább 8 karakter hosszú.
                                            </li>
                                            <li className="flex items-center">
                                                <span className={`mr-2 text-${/[A-Z]/.test(formData.newPassword) ? 'green' : 'gray'}-500`}>
                                                    {/[A-Z]/.test(formData.newPassword) ? '✓' : '•'}
                                                </span>
                                                Tartalmaz nagybetűt.
                                            </li>
                                            <li className="flex items-center">
                                                <span className={`mr-2 text-${/[a-z]/.test(formData.newPassword) ? 'green' : 'gray'}-500`}>
                                                    {/[a-z]/.test(formData.newPassword) ? '✓' : '•'}
                                                </span>
                                                Tartalmaz kisbetűt.
                                            </li>
                                            <li className="flex items-center">
                                                <span className={`mr-2 text-${/[0-9]/.test(formData.newPassword) ? 'green' : 'gray'}-500`}>
                                                    {/[0-9]/.test(formData.newPassword) ? '✓' : '•'}
                                                </span>
                                                Tartalmaz számot.
                                            </li>
                                            <li className="flex items-center">
                                                <span className={`mr-2 text-${/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) ? 'green' : 'gray'}-500`}>
                                                    {/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) ? '✓' : '•'}
                                                </span>
                                                Tartalmaz speciális karaktert.
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Jelenlegi jelszó
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                name="currentPassword"
                                                value={formData.currentPassword}
                                                onChange={handleInputChange}
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <FiLock className="absolute left-3 top-3 text-gray-400" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Új jelszó
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={formData.newPassword}
                                                onChange={handleInputChange}
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <FiLock className="absolute left-3 top-3 text-gray-400" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Új jelszó megerősítése
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <FiLock className="absolute left-3 top-3 text-gray-400" />
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Jelszó módosítása
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
