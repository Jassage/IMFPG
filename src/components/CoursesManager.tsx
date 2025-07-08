
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAcademicStore } from '../store/academicStore';

export const CoursesManager = () => {
  const { ues } = useAcademicStore();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Unités d'Enseignement</h2>
      </div>

      <div className="grid gap-4">
        {ues.map((ue) => (
          <Card key={ue.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{ue.code} - {ue.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {ue.faculty} • {ue.level} • {ue.semester}
                  </p>
                  <div className="flex space-x-2">
                    <Badge variant="outline">{ue.credits} crédits</Badge>
                    <Badge variant={ue.type === 'Obligatoire' ? 'default' : 'secondary'}>
                      {ue.type}
                    </Badge>
                    <Badge variant="outline">Note de passage: {ue.passingGrade}/20</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
