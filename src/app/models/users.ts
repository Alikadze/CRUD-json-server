export interface User {
  id: string;
  name?: string | null;
  lastName?: string | null | undefined;
  birthDate?: string | null;
  number?: number | null;
  address?: {
    city: string | null | undefined;
    street: string | null | undefined;
  };
  skills?: string[] |  null | undefined;
  experience?: string[];
}
