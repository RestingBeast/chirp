export type User = {
  _id: string;
  email: string;
  name: string;
  role: "member" | "admin";
  teamId?: {
    _id: string;
    name: string;
  };
  createdAt: string;
};
