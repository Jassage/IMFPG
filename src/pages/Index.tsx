
import { useState } from 'react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { Dashboard } from '../components/Dashboard';
import { StudentsManager } from '../components/StudentsManager';
import { CoursesManager } from '../components/CoursesManager';
import { GradesManager } from '../components/GradesManager';
import { RetakesManager } from '../components/RetakesManager';
import { useDemoData } from '../hooks/useDemoData';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/components/ui/breadcrumb';

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

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'students':
        return 'Gestion des Étudiants';
      case 'courses':
        return 'Unités d\'Enseignement';
      case 'grades':
        return 'Notes & Bulletins';
      case 'retakes':
        return 'Gestion des Reprises';
      default:
        return 'Dashboard';
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-medium">
                    {getPageTitle()}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          
          <main className="flex-1 p-6">
            {renderContent()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
