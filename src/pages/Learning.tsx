import { Navbar } from '@/components/layout/Navbar';
import { PageTransition } from '@/components/layout/PageTransition';
import { LearningHub } from '@/components/dashboard/LearningHub';
import ShootingStars from '@/components/ShootingStars';
import { useAppStore } from '@/lib/store';

export default function Learning() {
  const { settings } = useAppStore();

  return (
    <div className="min-h-screen relative">
      <ShootingStars enabled={settings.particlesEnabled} starCount={6} />
      <Navbar />
      
      <main className="pt-20 pb-8 px-4">
        <PageTransition>
          <div className="container mx-auto max-w-7xl">
            <LearningHub />
          </div>
        </PageTransition>
      </main>
    </div>
  );
}