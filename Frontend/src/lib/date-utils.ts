
// Format date as "Month Day, Year"
export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

// Format date as "Month Day" (no year)
export function formatBirthday(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
  }).format(date);
}

// Calculate age from birthdate
export function calculateAge(birthdate: string): number {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

// Check if date is today
export function isToday(date: Date | string): boolean {
  const today = new Date();
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

// Get upcoming birthday for this year (or next year if already passed)
export function getUpcomingBirthday(birthdate: string): Date {
  const today = new Date();
  const birthDate = new Date(birthdate);
  
  // Set the birth date to this year
  const birthdayThisYear = new Date(
    today.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate()
  );
  
  // If the birthday has passed this year, set it to next year
  if (birthdayThisYear < today) {
    birthdayThisYear.setFullYear(today.getFullYear() + 1);
  }
  
  return birthdayThisYear;
}

// Check if birthday is within the next X days
export function isBirthdaySoon(birthdate: string, days = 30): boolean {
  const today = new Date();
  const upcomingBirthday = getUpcomingBirthday(birthdate);
  
  const diffTime = Math.abs(upcomingBirthday.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays <= days;
}
