import SignIn from '@/components/pages/SignIn';

const Signin = ({ searchParams }: { searchParams: { [key: string]: string } }) => {
  return <SignIn searchParams={searchParams} />;
};

export default Signin;
