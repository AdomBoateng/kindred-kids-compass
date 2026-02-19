import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { getChurchById, getClassesByChurchId, getStudentsByChurchId, getUsersByChurchId } from "@/lib/mock-data";

export function useChurchScope() {
  const { user } = useAuth();

  return useMemo(() => {
    const churchId = user?.churchId;

    return {
      churchId,
      church: getChurchById(churchId),
      users: getUsersByChurchId(churchId),
      classes: getClassesByChurchId(churchId),
      students: getStudentsByChurchId(churchId),
      teachers: getUsersByChurchId(churchId).filter((scopeUser) => scopeUser.role === "teacher"),
    };
  }, [user]);
}
