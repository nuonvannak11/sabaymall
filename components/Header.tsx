'use client'

import { useTranslations } from 'next-intl'
import { useState, useRef, useEffect } from 'react'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function Header() {
  const t = useTranslations('navigation')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false)
      }
      
      // Close search when clicking outside
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
    if (!isSearchOpen) {
      setSearchQuery('')
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle search logic here
    console.log('Searching for:', searchQuery)
  }

  return (
    <header className="py-6 flex justify-between items-center relative">
      <h1 className="font-bold">Sabay Mall</h1>
      
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        <a href="#" className="text-gray-800 hover:text-brand-red font-semibold">
          {t('Home')}
        </a>
        <a href="#" className="text-gray-500 hover:text-brand-red">
          {t('Cloths')}
        </a>
        <a href="#" className="text-gray-500 hover:text-brand-red">
          {t('Incense')}
        </a>
        <a href="#" className="text-gray-500 hover:text-brand-red">
          {t('Electronics')}
        </a>
        <a href="#" className="text-gray-500 hover:text-brand-red">
          {t('contact')}
        </a>
      </nav>

      <div className="flex items-center space-x-4">
        {/* Search Container */}
        <div className="relative" ref={searchRef}>
          {/* Search Icon Button */}
          <button
            onClick={toggleSearch}
            className={`p-2 rounded-full transition-all duration-300 ${
              isSearchOpen 
                ? 'bg-brand-red text-white shadow-lg' 
                : 'text-gray-500 hover:text-brand-red hover:bg-gray-100'
            }`}
          >
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>

          {/* Search Input */}
          <div className={`absolute right-0 top-0 transition-all duration-300 ease-in-out ${
            isSearchOpen 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 translate-x-4 pointer-events-none'
          }`}>
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-64 px-4 py-2 pr-12 bg-white border-2 border-gray-200 rounded-full focus:outline-none focus:border-brand-red shadow-lg text-sm"
              />
              <button
                type="submit"
                className="absolute right-2 p-1 text-brand-red hover:text-brand-red-dark transition-colors"
              >
                <i className="fa-solid fa-arrow-right text-sm"></i>
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          ref={buttonRef}
          onClick={toggleMenu}
          className="bg-white p-2 rounded-full shadow-sm md:hidden z-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"></div>
      )}

      {/* Mobile Menu Sidebar */}
      <div 
        ref={menuRef}
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-bold text-xl">Sabay Mall</h2>
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <nav className="flex flex-col space-y-4 flex-grow">
            <a href="#" className="text-gray-800 hover:text-brand-red font-semibold py-2 border-b border-gray-100">
              {t('Home')}
            </a>
            <a href="#" className="text-gray-500 hover:text-brand-red py-2 border-b border-gray-100">
              {t('Cloths')}
            </a>
            <a href="#" className="text-gray-500 hover:text-brand-red py-2 border-b border-gray-100">
              {t('Incense')}
            </a>
            <a href="#" className="text-gray-500 hover:text-brand-red py-2 border-b border-gray-100">
              {t('Electronics')}
            </a>
            <a href="#" className="text-gray-500 hover:text-brand-red py-2 border-b border-gray-100">
              {t('contact')}
            </a>
          </nav>
          
          {/* Language Switcher at bottom */}
          <div className="mt-auto pt-4 border-t border-gray-100">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  )
} 