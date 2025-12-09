import { Navbar } from '@/components/layout/Navbar';
import { PageTransition } from '@/components/layout/PageTransition';
import { LearningHub } from '@/components/dashboard/LearningHub';
import CanvasParticles from '@/components/CanvasParticles';
import { useAppStore } from '@/lib/store';

export default function Learning() {
  const { settings } = useAppStore();

  return (
    <div className="min-h-screen relative">
      <CanvasParticles enabled={settings.particlesEnabled} particleCount={40} />
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
