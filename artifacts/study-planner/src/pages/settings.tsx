import { useState, useRef } from 'react';
import { Camera, Moon, Sun, Check, User, Target, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlassCard, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAppContext } from '@/context/app-context';
import { useToast } from '@/hooks/use-toast';

const COLORS = [
  { name: 'purple', label: 'Neon Purple', color: 'bg-[#9333ea]' },
  { name: 'blue', label: 'Ocean Blue', color: 'bg-[#3b82f6]' },
  { name: 'cyan', label: 'Cyber Cyan', color: 'bg-[#06b6d4]' },
  { name: 'emerald', label: 'Matrix Green', color: 'bg-[#10b981]' },
  { name: 'orange', label: 'Sunset Orange', color: 'bg-[#f97316]' },
];

export default function Settings() {
  const { profile, setProfile } = useAppContext();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: profile.name,
    studyGoal: profile.studyGoal,
    dailyHoursTarget: profile.dailyHoursTarget,
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setProfile({
      ...profile,
      name: formData.name,
      studyGoal: formData.studyGoal,
      dailyHoursTarget: formData.dailyHoursTarget,
    });
    toast({
      title: 'Settings Saved',
      description: 'Your profile has been updated successfully.',
    });
  };

  const updateTheme = (theme: 'dark' | 'light') => {
    setProfile({ ...profile, theme });
  };

  const updateAccent = (color: string) => {
    setProfile({ ...profile, accentColor: color });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfile({ ...profile, avatar: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Profile Info */}
        <div className="md:col-span-2 space-y-6">
          <GlassCard>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="flex items-center gap-6">
                <div 
                  onClick={handleAvatarClick}
                  className="w-24 h-24 rounded-full bg-secondary border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden group relative"
                >
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                <div>
                  <h3 className="font-semibold text-lg">Avatar</h3>
                  <p className="text-sm text-muted-foreground">Click to upload a custom picture.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input 
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Main Study Goal</label>
                  <div className="relative">
                    <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      className="pl-9"
                      value={formData.studyGoal} 
                      onChange={e => setFormData({ ...formData, studyGoal: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Daily Hours Target ({formData.dailyHoursTarget}h)</label>
                  <div className="flex items-center gap-4">
                    <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                    <input 
                      type="range" 
                      min="1" max="16" step="1"
                      value={formData.dailyHoursTarget}
                      onChange={e => setFormData({ ...formData, dailyHoursTarget: parseInt(e.target.value) })}
                      className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSave} className="w-full">Save Changes</Button>
            </CardContent>
          </GlassCard>
        </div>

        {/* Appearance */}
        <div className="space-y-6">
          <GlassCard>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-3">
                <label className="text-sm font-medium">Theme</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant={profile.theme === 'light' ? 'default' : 'outline'} 
                    onClick={() => updateTheme('light')}
                    className="w-full justify-start"
                  >
                    <Sun className="w-4 h-4 mr-2" /> Light
                  </Button>
                  <Button 
                    variant={profile.theme === 'dark' ? 'default' : 'outline'} 
                    onClick={() => updateTheme('dark')}
                    className="w-full justify-start"
                  >
                    <Moon className="w-4 h-4 mr-2" /> Dark
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Accent Color</label>
                <div className="grid grid-cols-5 gap-2">
                  {COLORS.map(c => (
                    <div
                      key={c.name}
                      onClick={() => updateAccent(c.name)}
                      className={`w-10 h-10 rounded-full cursor-pointer flex items-center justify-center transition-transform hover:scale-110 ${c.color} ${profile.accentColor === c.name ? 'ring-2 ring-offset-2 ring-offset-background ring-foreground' : ''}`}
                      title={c.label}
                    >
                      {profile.accentColor === c.name && <Check className="w-5 h-5 text-white" />}
                    </div>
                  ))}
                </div>
              </div>

            </CardContent>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}
