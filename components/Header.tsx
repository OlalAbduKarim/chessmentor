import React, { useState, useEffect, useRef, useContext } from 'react';
import { User, UserRole, Page, AppContextType } from '../types';
import { ChessBoardIcon, MoonIcon, SunIcon } from './icons/Icons';
import { AppContext } from '../App';

interface HeaderProps {
    user: User;
    logout: () => void;
    setPage: AppContextType['setPage'];
    currentRole: UserRole;
    currentPage: Page;
}

export const Header: React.FC<HeaderProps> = ({ user, logout, setPage, currentRole, currentPage }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const appContext = useContext(AppContext);
    
    const navItems = currentRole === UserRole.STUDENT ? [
        { label: 'Dashboard', page: Page.STUDENT_DASHBOARD },
        { label: 'Explore Coaches', page: Page.EXPLORE },
        { label: 'My Schedule', page: Page.SCHEDULE },
    ] : [
        { label: 'Dashboard', page: Page.COACH_DASHBOARD },
        { label: 'Schedule', page: Page.SCHEDULE },
    ];
    
    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    const handleNavClick = (page: Page) => {
        setPage(page);
        setMenuOpen(false);
    };

    return (
        <header className="bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-lg border-b border-light-border dark:border-dark-border sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                       <button onClick={() => handleNavClick(currentRole === UserRole.STUDENT ? Page.STUDENT_DASHBOARD : Page.COACH_DASHBOARD)} className="flex items-center flex-shrink-0">
                            <ChessBoardIcon className="h-8 w-8 text-brand-primary" />
                            <span className="font-bold text-xl ml-2 text-light-text-primary dark:text-dark-text-primary">ChessMentor</span>
                        </button>
                        <nav className="hidden md:flex items-center ml-10 space-x-8">
                           {navItems.map(item => {
                               const isActive = currentPage === item.page;
                               const activeClasses = 'text-brand-primary font-semibold';
                               const inactiveClasses = 'text-light-text-secondary dark:text-dark-text-secondary hover:text-brand-primary dark:hover:text-brand-primary';
                               
                               return (
                                 <button 
                                     key={item.label} 
                                     onClick={() => handleNavClick(item.page)} 
                                     className={`text-sm font-medium transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}
                                     aria-current={isActive ? 'page' : undefined}
                                 >
                                    {item.label}
                                 </button>
                               )
                           })}
                        </nav>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                       <button
                         onClick={appContext?.toggleTheme}
                         className="p-2 rounded-full text-light-text-secondary dark:text-dark-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary focus:ring-offset-light-surface dark:focus:ring-offset-dark-surface transition-colors"
                         aria-label="Toggle theme"
                       >
                         {appContext?.theme === 'dark' ? (
                           <SunIcon className="w-5 h-5" />
                         ) : (
                           <MoonIcon className="w-5 h-5" />
                         )}
                       </button>
                       <div className="relative" ref={menuRef}>
                           <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary focus:ring-offset-light-surface dark:focus:ring-offset-dark-surface" id="user-menu-button" aria-expanded={menuOpen} aria-haspopup="true">
                                <img src={user.avatarUrl} alt={user.name} className="h-9 w-9 rounded-full object-cover" />
                                <div className="hidden sm:flex flex-col items-start">
                                    <span className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">{user.name}</span>
                                    <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary capitalize">{user.role.toLowerCase()}</span>
                                </div>
                           </button>
                           {menuOpen && (
                               <div className="absolute right-0 mt-2 w-56 bg-light-surface dark:bg-dark-surface rounded-md shadow-lg py-1 border border-light-border dark:border-dark-border ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in-down" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
                                   <div className="px-4 py-3" role="none">
                                       <p className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary" role="none">{user.name}</p>
                                       <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary truncate" role="none">{user.email}</p>
                                   </div>
                                   <div className="border-t border-light-border dark:border-dark-border" role="none"></div>
                                   <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">
                                       Logout
                                   </button>
                               </div>
                           )}
                       </div>
                    </div>
                </div>
            </div>
        </header>
    );
};