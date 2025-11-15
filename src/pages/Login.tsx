import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CheckSquare, Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  const { members } = useApp();
  const { t, language, setLanguage } = useLanguage();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handleLogin = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    if (member) {
      setCurrentUser(member);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/5 to-primary/5 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Language Switcher */}
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Globe className="h-4 w-4" />
                {language === 'en' ? 'English' : 'Français'}
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
        </div>

        {/* Login Card */}
        <Card className="gradient-card border-0 shadow-primary">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center">
              <CheckSquare className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold">ProjectHub</CardTitle>
              <CardDescription>
                {t('common.welcome')} - Select your profile to continue
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {members.map((member) => (
                <button
                  key={member.id}
                  onClick={() => {
                    setSelectedUser(member.id);
                    handleLogin(member.id);
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all hover:border-primary hover:bg-accent/50 ${
                    selectedUser === member.id ? 'border-primary bg-accent' : 'border-transparent bg-background/50'
                  }`}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                      {member.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left space-y-1">
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                  <div className={`h-4 w-4 rounded-full border-2 ${
                    selectedUser === member.id ? 'border-primary bg-primary' : 'border-muted'
                  }`}>
                    {selectedUser === member.id && (
                      <div className="h-full w-full rounded-full bg-primary-foreground scale-50" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Demo app - Select any team member to explore the app
        </p>
      </div>
    </div>
  );
};

export default Login;
