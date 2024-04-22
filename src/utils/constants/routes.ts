import CoursesIcon from "/public/icons/courses.svg";
import LogoutIcon from "/public/icons/log-out.svg";
import ProfileIcon from "/public/icons/profile.svg";
import PaymentsIcon from "/public/icons/payments_icon.svg";

export const HOMEPAGE_ROUTE = "/";
export const SIGN_IN_ROUTE = "/signin";
export const SIGN_UP_ROUTE = "/signup";
export const FORGOT_PASSWORD_ROUTE = "/forgot-password";
export const PROFILE_ROUTE = "/profile";
export const COURSES_ROUTE = `${PROFILE_ROUTE}/courses`;
export const ACHIEVEMENTS_ROUTE = `${PROFILE_ROUTE}/achievements`;
export const SUBSCRIPTION_ROUTE = `${PROFILE_ROUTE}/subscription`;
export const WISHLIST_ROUTE = `${PROFILE_ROUTE}/wishlist`;
export const PBA_CREDIT_ROUTE = `${PROFILE_ROUTE}/pba-credit`;
export const PAYMENTS_ROUTE = `${PROFILE_ROUTE}/payments`;
export const HELP_ROUTE = `${PROFILE_ROUTE}/help`;
export const PRICING_ROUTE = "/pricing";
export const ABOUT_ROUTE = "/about";
export const CONTACT_US_ROUTE = "/contact-us";
export const TERMS_AND_CONDITIONS_ROUTE = "/terms-and-conditions";
export const LEADERSHIP_ROUTE = "/leadership";
export const CAREERS_ROUTE = "/careers";
export const ONLINE_COURSES_ROUTE = "/online-courses";
export const OFFLINE_COURSES_ROUTE = "/offline-courses";
export const FOR_KIDS_ROUTE = "/for-kids";
export const ARTICLES_ROUTE = "/articles";

interface LinkItemProps {
  name: string;
  icon: string;
  id: number;
  href?: string;
}

export const linkItems: Array<LinkItemProps> = [
  { id: 1, name: "Profile", icon: ProfileIcon, href: PROFILE_ROUTE },
  { id: 2, name: "Courses", icon: CoursesIcon, href: COURSES_ROUTE },
  // { id: 3, name: 'Achievements', icon: AchievementsIcon, href: ACHIEVEMENTS_ROUTE },
  // { id: 4, name: 'Subscription', icon: SubscriptionIcon, href: SUBSCRIPTION_ROUTE },
  // { id: 5, name: 'Wishlist', icon: WishlistIcon, href: WISHLIST_ROUTE },
  // { id: 6, name: 'PBA credit', icon: PbaCreditIcon, href: PBA_CREDIT_ROUTE },
  { id: 7, name: "Payments", icon: PaymentsIcon, href: PAYMENTS_ROUTE },
  // { id: 8, name: 'Help', icon: HelpIcon, href: HELP_ROUTE },
  { id: 9, name: "Log out", icon: LogoutIcon },
];

export const LOGOUT_ID = 9;
