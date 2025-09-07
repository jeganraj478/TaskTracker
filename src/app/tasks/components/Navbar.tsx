'use client';

import { useState, useRef, useEffect } from 'react';

interface NavbarProps {
  onLogout: () => void;
}

export default function Navbar({ onLogout }: NavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get user data from localStorage on component mount
  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail') || '';
    const storedName = localStorage.getItem('userName') || '';
    
    setUserEmail(storedEmail);
    setUserName(storedName);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    // Clear localStorage data
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    onLogout();
  };

  // Get user initials for avatar
  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const displayName = userName || userEmail || 'User';
  const initials = getInitials(userName, userEmail);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Title */}
        <div className="navbar-brand">
          <div className="navbar-logo">📋</div>
          <h1 className="navbar-title">Task Tracker App</h1>
        </div>

        {/* Profile Section */}
        <div className="navbar-profile" ref={dropdownRef}>
          <button 
            className="profile-button"
            onClick={toggleDropdown}
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
          >
            <div className="profile-avatar">
              {initials}
            </div>
            <span className="profile-name">{displayName}</span>
            <svg 
              className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}
              width="16" 
              height="16" 
              viewBox="0 0 16 16"
            >
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <div className="dropdown-avatar">
                  {initials}
                </div>
                <div className="dropdown-info">
                  {userName && <div className="dropdown-name">{userName}</div>}
                  {userEmail && <div className="dropdown-email">{userEmail}</div>}
                </div>
              </div>
              
              <div className="dropdown-divider"></div>
              
              <button 
                className="dropdown-item logout-item"
                onClick={handleLogout}
              >
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <path d="M6 2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H6zM5 3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V3z"/>
                  <path d="M10.5 8.5a.5.5 0 0 0 0-1H4.354l1.823-1.823a.5.5 0 1 0-.708-.708l-2.5 2.5a.5.5 0 0 0 0 .708l2.5 2.5a.5.5 0 0 0 .708-.708L4.354 8.5H10.5z"/>
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}