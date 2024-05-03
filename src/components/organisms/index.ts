'use client';
import dynamic from 'next/dynamic';
import AuthWrapper from './AuthWrapper';
import Header from './Header';

const TeacherSignUp = dynamic(() => import('./TeacherSignup'));
const StudentSignUp = dynamic(() => import('./StudentSignup'));

export { AuthWrapper, Header, TeacherSignUp, StudentSignUp };
