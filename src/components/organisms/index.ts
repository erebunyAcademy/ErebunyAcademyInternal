'use client';
import dynamic from 'next/dynamic';
import AuthWrapper from './AuthWrapper';
import Header from './Header';
import SimpleSidebar from './ProfileSidebar';

const TeacherSignUp = dynamic(() => import('./TeacherSignup'));
const StudentSignUp = dynamic(() => import('./StudentSignup'));
const Footer = dynamic(() => import('./Footer'));

export { AuthWrapper, Header, Footer, SimpleSidebar, TeacherSignUp, StudentSignUp };
