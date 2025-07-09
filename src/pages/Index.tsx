
import { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { Dashboard } from '../components/Dashboard';
import { StudentsManager } from '../components/StudentsManager';
import { CoursesManager } from '../components/CoursesManager';
import { GradesManager } from '../components/GradesManager';
import { RetakesManager } from '../components/RetakesManager';
import { useDemoData } from '../hooks/useDemoData';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Initialiser les données de démonstration
  useDemoData();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return <StudentsManager />;
      case 'courses':
        return <CoursesManager />;
      case 'grades':
        return <GradesManager />;
      case 'retakes':
        return <RetakesManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">
            Système de Gestion Universitaire
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestion des étudiants, notes, reprises et documents académiques
          </p>
        </div>
      </header>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
