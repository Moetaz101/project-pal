import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Home, FolderKanban, CheckSquare, Users, Bell, Menu } from 'lucide-react';
import { NavLink } from './NavLink';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const Layout: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { currentUser } = useAuth();
  const { notifications } = useApp();
  const location = useLocation();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const navItems = [
    { to: '/', label: t('nav.dashboard'), icon: Home },
    { to: '/projects', label: t('nav.projects'), icon: FolderKanban },
    { to: '/tasks', label: t('nav.tasks'), icon: CheckSquare },
    { to: '/team', label: t('nav.team'), icon: Users },
    { to: '/notifications', label: t('nav.notifications'), icon: Bell, badge: unreadCount },
  ];

  const NavContent = () => (
    <>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className="flex items-center gap-2 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-base"
          activeClassName="text-primary bg-accent/50 font-medium"
        >
          <item.icon className="h-5 w-5" />
          <span className="text-sm">{item.label}</span>
          {item.badge !== undefined && item.badge > 0 && (
            <Badge variant="destructive" className="ml-auto h-5 min-w-5 flex items-center justify-center px-1">
              {item.badge}
            </Badge>
          )}
        </NavLink>
      ))}
    </>
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation Bar - Desktop */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <CheckSquare className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg hidden sm:inline">ProjectHub</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 px-3">
                  {language === 'en' ? '🇬🇧 EN' : '🇫🇷 FR'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover">
                <DropdownMenuItem onClick={() => setLanguage('en')} className="cursor-pointer">
                  🇬🇧 English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('fr')} className="cursor-pointer">
                  🇫🇷 Français
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            {currentUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {currentUser.avatar}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{currentUser.name}</p>
                      <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    {t('common.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 border-r bg-card/50 p-4">
          <nav className="flex flex-col gap-1 w-full">
            <NavContent />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto pb-20 lg:pb-4">
          <Outlet />
        </main>
      </div>

      {/* Bottom Navigation - Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.slice(0, 4).map((item) => {
            const isActive = location.pathname === item.to || 
              (item.to !== '/' && location.pathname.startsWith(item.to));
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg text-muted-foreground relative"
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
                <span className={`text-xs ${isActive ? 'text-primary font-medium' : ''}`}>
                  {item.label}
                </span>
                {item.badge !== undefined && item.badge > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute top-1 right-1 h-4 min-w-4 flex items-center justify-center px-1 text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
              </NavLink>
            );
          })}
          
          {/* More Menu for Mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg text-muted-foreground relative">
                <Menu className="h-5 w-5" />
                <span className="text-xs">{t('nav.more')}</span>
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute top-1 right-1 h-4 min-w-4 flex items-center justify-center px-1 text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-card h-auto">
              <nav className="flex flex-col gap-2 py-4">
                <NavContent />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
