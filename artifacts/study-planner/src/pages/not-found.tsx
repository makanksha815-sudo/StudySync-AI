import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard, CardContent } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <GlassCard className="border-destructive/30">
          <CardContent className="flex flex-col items-center text-center p-8 space-y-6">
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">404</h1>
              <p className="text-muted-foreground">The page you are looking for doesn't exist or has been moved.</p>
            </div>
            
            <Link href="/dashboard">
              <Button size="lg" className="w-full mt-4">
                Return to Dashboard
              </Button>
            </Link>
          </CardContent>
        </GlassCard>
      </motion.div>
    </div>
  );
}
