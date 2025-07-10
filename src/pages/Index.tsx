
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
import { Input } from '@/components/ui/input';
import { Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        return 'Accueil';
      case 'students':
        return 'Gestion des Étudiants';
      case 'courses':
        return 'Les cours';
      case 'grades':
        return 'Notes & Bulletins';
      case 'retakes':
        return 'Catalogues';
      default:
        return 'Accueil';
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 ujeph-header">
            <SidebarTrigger className="-ml-1 text-white hover:bg-white/20" />
            <Separator orientation="vertical" className="mr-2 h-4 bg-white/30" />
            
            <div className="flex-1 flex items-center justify-between">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-medium text-white">
                      {getPageTitle()}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                  <Input 
                    placeholder="Search..." 
                    className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30"
                  />
                </div>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <User className="h-4 w-4 mr-2" />
                  Deshaun Marvin
                </Button>
              </div>
            </div>
          </header>
          
          <main className="flex-1 p-6 bg-gray-50">
            {renderContent()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
