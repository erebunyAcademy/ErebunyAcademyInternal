import LogoutIcon from '/public/icons/log-out.svg';
import ProfileIcon from '/public/icons/profile.svg';

export const HOMEPAGE_ROUTE = '/';
export const SIGN_IN_ROUTE = '/signin';
export const SIGN_UP_ROUTE = '/signup';
export const FORGOT_PASSWORD_ROUTE = '/forgot-password';
export const PROFILE_ROUTE = '/profile';

export const ROUTE_USERS = '/users-list';
export const ROUTE_TEACHERS = '/teachers-list';
export const ROUTE_FACULTIES = '/faculty-list';
export const ROUTE_STUDENT_GRADES = '/student-grade-list';
export const ROUTE_STUDENT_GRADE_GROUPS = '/student-grade-group-list';
export const ROUTE_SUBJECTS = '/subject-list';

interface LinkItemProps {
  name: string;
  icon: string;
  id: number;
  href?: string;
}

export const linkItems: Array<LinkItemProps> = [
  { id: 1, name: 'Profile', icon: ProfileIcon, href: PROFILE_ROUTE },
  { id: 9, name: 'Log out', icon: LogoutIcon },
];

export const LOGOUT_ID = 9;
