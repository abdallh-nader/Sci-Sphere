import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { ThemeProvider } from '../context/ThemeContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../utils/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, MailIcon, LockIcon, UserIcon, AtSign, BeakerIcon, TestTube, Atom, Home } from 'lucide-react';

const LoginPage = () => {
  const { language } = useTheme();
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  
  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  
  // Chemistry background animation props
  const bubbleElements = Array(10).fill(0);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoginLoading(false);
      toast({
        title: t('login.success'),
        description: t('login.success.message'),
      });
      
      // Store user info in localStorage
      localStorage.setItem('user', JSON.stringify({ email: loginEmail, name: loginEmail.split('@')[0] }));
      
      // Redirect to Index page instead of reactions
      navigate('/');
    }, 1500);
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (registerPassword !== registerConfirmPassword) {
      toast({
        title: t('error'),
        description: t('register.passwords.mismatch'),
        variant: 'destructive',
      });
      return;
    }
    
    setIsRegisterLoading(true);
    
    // Simulate registration process
    setTimeout(() => {
      setIsRegisterLoading(false);
      toast({
        title: t('register.success'),
        description: t('register.success.message'),
      });
      
      // Store user info in localStorage
      localStorage.setItem('user', JSON.stringify({ 
        email: registerEmail, 
        name: registerName 
      }));
      
      // Redirect to Index page instead of reactions
      navigate('/');
    }, 1500);
  };
  
  return (
    <ThemeProvider>
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800">
        {/* Animated chemistry background */}
        <div className="absolute inset-0 overflow-hidden z-0">
          {bubbleElements.map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-green-400/20 backdrop-blur-sm"
              initial={{ 
                x: `${Math.random() * 100}%`, 
                y: `${Math.random() * 100 + 100}%`,
                scale: Math.random() * 0.5 + 0.5,
                opacity: Math.random() * 0.4 + 0.1
              }}
              animate={{ 
                y: `${-20 - Math.random() * 100}%`,
                x: `${Math.random() * 20 - 10 + parseInt(`${i}0`)}%`,
              }}
              transition={{ 
                duration: Math.random() * 20 + 20, 
                repeat: Infinity, 
                ease: "linear",
                repeatType: "loop"
              }}
              style={{
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
              }}
            />
          ))}
        </div>
        
        {/* Lab elements decoration */}
        <motion.div 
          className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-green-400/10 backdrop-blur-sm"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div 
          className="absolute top-20 -right-20 w-80 h-80 rounded-full bg-blue-400/10 backdrop-blur-sm"
          animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="absolute bottom-10 right-10 opacity-20 rotate-12">
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <TestTube className="w-24 h-24 text-blue-200" />
          </motion.div>
        </div>
        
        <div className="absolute top-20 left-10 opacity-20 -rotate-12">
          <motion.div 
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <BeakerIcon className="w-20 h-20 text-green-200" />
          </motion.div>
        </div>
        
        <div className="absolute top-1/2 right-1/4 opacity-10">
          <motion.div 
            animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Atom className="w-32 h-32 text-purple-200" />
          </motion.div>
        </div>
        
        <Navbar />
        
        <div className="container max-w-md mx-auto px-4 py-12 relative z-10">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-violet-300 via-green-300 to-blue-300"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            SciSphere
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-xl">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center text-white">
                  {activeTab === 'login' ? t('login.title') : t('register.title')}
                </CardTitle>
                <CardDescription className="text-center text-white/80">
                  {activeTab === 'login' ? t('login.description') : t('register.description')}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Tabs 
                  defaultValue="login" 
                  value={activeTab} 
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">
                      <LogIn className="w-4 h-4 mr-2" />
                      {t('login.title')}
                    </TabsTrigger>
                    <TabsTrigger value="register">
                      <UserPlus className="w-4 h-4 mr-2" />
                      {t('register.title')}
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">
                          <div className="flex items-center">
                            <MailIcon className="w-4 h-4 mr-2" />
                            {t('email')}
                          </div>
                        </Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder={t('email.placeholder')}
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                          className="bg-white/20 border-white/10 text-white placeholder:text-white/50"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password" className="text-white">
                            <div className="flex items-center">
                              <LockIcon className="w-4 h-4 mr-2" />
                              {t('password')}
                            </div>
                          </Label>
                          <Link 
                            to="#" 
                            className="text-sm text-blue-300 hover:text-blue-200 hover:underline"
                          >
                            {t('forgot.password')}
                          </Link>
                        </div>
                        <Input 
                          id="password" 
                          type="password" 
                          placeholder={t('password.placeholder')}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                          className="bg-white/20 border-white/10 text-white placeholder:text-white/50"
                        />
                      </div>
                      
                      <Button type="submit" className="w-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 hover:from-green-500 hover:via-blue-600 hover:to-purple-700" disabled={isLoginLoading}>
                        {isLoginLoading ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t('login.button')}...
                          </span>
                        ) : (
                          t('login.button')
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="register">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">
                          <div className="flex items-center">
                            <UserIcon className="w-4 h-4 mr-2" />
                            {t('name')}
                          </div>
                        </Label>
                        <Input 
                          id="name" 
                          type="text" 
                          placeholder={t('name.placeholder')}
                          value={registerName}
                          onChange={(e) => setRegisterName(e.target.value)}
                          required
                          className="bg-white/20 border-white/10 text-white placeholder:text-white/50"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="register-email" className="text-white">
                          <div className="flex items-center">
                            <AtSign className="w-4 h-4 mr-2" />
                            {t('email')}
                          </div>
                        </Label>
                        <Input 
                          id="register-email" 
                          type="email" 
                          placeholder={t('email.placeholder')}
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          required
                          className="bg-white/20 border-white/10 text-white placeholder:text-white/50"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="register-password" className="text-white">
                          <div className="flex items-center">
                            <LockIcon className="w-4 h-4 mr-2" />
                            {t('password')}
                          </div>
                        </Label>
                        <Input 
                          id="register-password" 
                          type="password" 
                          placeholder={t('password.placeholder')}
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          required
                          className="bg-white/20 border-white/10 text-white placeholder:text-white/50"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password" className="text-white">
                          <div className="flex items-center">
                            <LockIcon className="w-4 h-4 mr-2" />
                            {t('confirm.password')}
                          </div>
                        </Label>
                        <Input 
                          id="confirm-password" 
                          type="password" 
                          placeholder={t('confirm.password.placeholder')}
                          value={registerConfirmPassword}
                          onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                          required
                          className="bg-white/20 border-white/10 text-white placeholder:text-white/50"
                        />
                      </div>
                      
                      <Button type="submit" className="w-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 hover:from-green-500 hover:via-blue-600 hover:to-purple-700" disabled={isRegisterLoading}>
                        {isRegisterLoading ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t('register.button')}...
                          </span>
                        ) : (
                          t('register.button')
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="bg-white/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-transparent px-2 text-white/70">
                      {t('or.continue.with')}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" 
                      className="w-4 h-4 mr-2" 
                      alt="Google"
                    />
                    Google
                  </Button>
                  <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" 
                      className="w-4 h-4 mr-2 rounded-full bg-white" 
                      alt="GitHub"
                    />
                    GitHub
                  </Button>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col items-center space-y-4">
                <p className="text-xs text-center text-white/60">
                  {t('terms.message')}
                </p>
                <Link to="/" className="flex items-center text-sm text-blue-300 hover:text-blue-200 hover:underline">
                  <Home className="w-4 h-4 mr-2" />
                  {t('go.to.index', 'Go to Index Page')}
                </Link>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Lab flasks decoration at bottom */}
          <div className="flex justify-center mt-12 space-x-8 opacity-30">
            <motion.div 
              animate={{ rotate: [0, 5, -5, 0] }} 
              transition={{ duration: 5, repeat: Infinity }}
            >
              <TestTube className="w-12 h-12 text-blue-200" />
            </motion.div>
            
            <motion.div 
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 6, repeat: Infinity, delay: 1 }}
            >
              <BeakerIcon className="w-12 h-12 text-green-200" />
            </motion.div>
            
            <motion.div 
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, delay: 0.5 }}
            >
              <TestTube className="w-12 h-12 text-purple-200" />
            </motion.div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default LoginPage;