export type Team = {
  _id: string;
  name: string;
  adminId: {
    _id: string;
    email: string;
    name: string;
  };
  createdAt: string;
  memberCount?: number;
};
