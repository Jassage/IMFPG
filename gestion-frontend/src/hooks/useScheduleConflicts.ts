import { useState, useCallback } from "react";
import { useScheduleStore } from "@/store/scheduleStore";

interface UseScheduleConflictsReturn {
  checkForConflicts: (scheduleData: any) => Promise<boolean>;
  conflicts: any[];
  clearConflicts: () => void;
  hasConflicts: boolean;
}

export const useScheduleConflicts = (): UseScheduleConflictsReturn => {
  const [localConflicts, setLocalConflicts] = useState<any[]>([]);
  const { checkConflicts } = useScheduleStore();

  const checkForConflicts = useCallback(
    async (scheduleData: any) => {
      const conflicts = await checkConflicts(scheduleData);
      setLocalConflicts(conflicts);
      return conflicts.length > 0;
    },
    [checkConflicts]
  );

  const clearConflicts = useCallback(() => {
    setLocalConflicts([]);
  }, []);

  return {
    checkForConflicts,
    conflicts: localConflicts,
    clearConflicts,
    hasConflicts: localConflicts.length > 0,
  };
};
