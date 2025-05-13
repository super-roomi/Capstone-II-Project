import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, GlobeAltIcon } from '@heroicons/react/24/outline'

export default function NavBar() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === "ar";
    const [activeTab, setActiveTab] = useState('Home');

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        document.dir = lang === "ar" ? "rtl" : "ltr";
    };

    useEffect(() => {
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        document.documentElement.lang = i18n.language;
    }, [i18n.language, isRTL]);

    const navigation = [
        { name: t('home'), href: '/', current: activeTab === 'Home' },
        { name: t('progress'), href: '/progress', current: activeTab === 'Progress' },
        { name: t('exercises'), href: '/grade', current: activeTab === 'Exercises' },
        { name: t('profile'), href: '/profile', current: activeTab === 'Profile' },
        { name: t('tournaments'), href: '/tournaments', current: activeTab === 'Tournaments' },
    ]

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    return (
        <Disclosure as="nav" className="bg-black shadow-lg z-30">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Left section */}
                    <div className="flex items-center">
                        {/* Mobile menu button */}
                        <div className="flex-shrink-0 sm:hidden">
                            <DisclosureButton className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                                <span className="sr-only">{t('open_menu')}</span>
                                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                            </DisclosureButton>
                        </div>

                        {/* Logo */}
                        <div className="hidden sm:flex flex-shrink-0 items-center">
                            <img
                                alt={t('app_logo')}
                                src="https://cdn-icons-png.flaticon.com/128/1077/1077159.png"
                                className="h-8 w-auto"
                            />
                        </div>

                        {/* Desktop navigation */}
                        <div className="hidden sm:ml-6 sm:block">
                            <div className={`flex ${isRTL ? 'space-x-reverse' : ''} space-x-2`}>
                                {navigation.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setActiveTab(item.name)}
                                        className={classNames(
                                            item.current
                                                ? 'bg-primary-500 text-white'
                                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                                            'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200'
                                        )}
                                        aria-current={item.current ? 'page' : undefined}
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right section */}
                    <div className="flex items-center gap-4">
                        {/* Language switcher */}
                        <Menu as="div" className="relative">
                            <MenuButton className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
                                <span className="sr-only">{t('change_language')}</span>
                                <GlobeAltIcon className="h-5 w-5 text-gray-600" />
                            </MenuButton>
                            <MenuItems
                                className={`absolute ${isRTL ? 'left-0' : 'right-0'} z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none`}
                            >
                                <div className="py-1">
                                    <MenuItem>
                                        <button
                                            onClick={() => changeLanguage("ar")}
                                            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-start arabic-font"
                                        >
                                            العربية
                                        </button>
                                    </MenuItem>
                                    <MenuItem>
                                        <button
                                            onClick={() => changeLanguage("en")}
                                            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-start english-font"
                                        >
                                            English
                                        </button>
                                    </MenuItem>
                                </div>
                            </MenuItems>
                        </Menu>

                        {/* Profile dropdown */}
                        <Menu as="div" className="relative ml-3">
                            <div>
                                <MenuButton className="flex rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                    <span className="sr-only">{t('open_user_menu')}</span>
                                    <img
                                        className="h-8 w-8 rounded-full"
                                        src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"
                                        alt={t('user_avatar')}
                                    />
                                </MenuButton>
                            </div>
                            <MenuItems
                                className={`absolute ${isRTL ? 'left-0' : 'right-0'} z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none`}
                            >
                                <MenuItem>
                                    <a
                                        href="/login"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        {t('login')}
                                    </a>
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <DisclosurePanel className="sm:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3">
                    {navigation.map((item) => (
                        <DisclosureButton
                            key={item.name}
                            as="a"
                            href={item.href}
                            onClick={() => setActiveTab(item.name)}
                            className={classNames(
                                item.current
                                    ? 'bg-primary-500 text-white'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                                'block px-3 py-2 rounded-md text-base font-medium'
                            )}
                            aria-current={item.current ? 'page' : undefined}
                        >
                            {item.name}
                        </DisclosureButton>
                    ))}
                </div>
            </DisclosurePanel>
        </Disclosure>
    )
}