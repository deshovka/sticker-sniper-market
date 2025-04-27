
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

// This is a temporary password, in real scenario it should be verified against a database
const TEMP_PASSWORD = 'admin123';

const Login: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (password === TEMP_PASSWORD) {
        // Store authentication state (in a real app, use a proper auth token)
        localStorage.setItem('isAuthenticated', 'true');
        toast({
          title: "Login successful",
          description: "Redirecting to dashboard",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Authentication failed",
          description: "Invalid password",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">CSGO Skin Sniper</CardTitle>
          <CardDescription>Enter password to access the tool</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-secondary"
                  autoComplete="current-password"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? "Authenticating..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
