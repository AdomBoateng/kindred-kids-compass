import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { Church } from "@/types";
import { getChurchById, getClassesByChurchId, getStudentsByChurchId, getUsersByChurchId } from "@/lib/mock-data";

function getActiveChurchFromStorage(churchId?: string): Church | undefined {
  if (!churchId) return undefined;

  const rawActiveChurch = localStorage.getItem("activeChurch");
  if (!rawActiveChurch) return undefined;

  try {
    const activeChurch = JSON.parse(rawActiveChurch) as Church;
    return activeChurch.id === churchId ? activeChurch : undefined;
  } catch {
    return undefined;
  }
}

export function useChurchScope() {
  const { user } = useAuth();
  const churchId = user?.churchId;

  return useMemo(() => {
    const users = getUsersByChurchId(churchId);

    return {
      churchId,
      church: getChurchById(churchId) || getActiveChurchFromStorage(churchId),
      users,
      classes: getClassesByChurchId(churchId),
      students: getStudentsByChurchId(churchId),
      teachers: users.filter((scopeUser) => scopeUser.role === "teacher"),
    };
  }, [churchId]);
}
