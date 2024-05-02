export const QUERY_KEY = {
  allUsers: (search: string, page: number) => [search ? `users/${search}` : 'users', page],
};
