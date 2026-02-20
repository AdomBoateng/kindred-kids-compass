import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { Church } from "@/types";
import { getChurchById, getClassesByChurchId, getStudentsByChurchId, getUsersByChurchId } from "@/lib/mock-data";
import { sanitizeText } from "@/lib/security";

function getActiveChurchFromStorage(churchId?: string): Church | undefined {
  if (!churchId) return undefined;

  const rawActiveChurch = localStorage.getItem("activeChurch");
  if (!rawActiveChurch) return undefined;

  try {
    const activeChurch = JSON.parse(rawActiveChurch) as Church;
    if (activeChurch.id !== churchId) return undefined;

    return {
      ...activeChurch,
      id: sanitizeText(activeChurch.id),
      name: sanitizeText(activeChurch.name),
      branchName: sanitizeText(activeChurch.branchName),
      location: sanitizeText(activeChurch.location),
      region: activeChurch.region ? sanitizeText(activeChurch.region) : undefined,
      district: activeChurch.district ? sanitizeText(activeChurch.district) : undefined,
      area: activeChurch.area ? sanitizeText(activeChurch.area) : undefined,
    };
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
