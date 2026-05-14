export const SUPER_ADMIN_EMAIL = 'test@test.com';

export function isSuperAdminEmail(email) {
  return typeof email === 'string' && email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
}
