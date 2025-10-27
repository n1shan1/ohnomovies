export enum Role {
  USER = 'ROLE_USER',
  ADMIN = 'ROLE_ADMIN',
  STAFF = 'ROLE_STAFF',
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}
