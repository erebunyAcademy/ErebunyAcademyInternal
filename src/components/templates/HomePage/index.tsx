import { Container } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import WelcomeSection from './WelcomeSection';

const PersonaIntroSection = dynamic(() => import('./PersonaIntroSection'));
const KidsAcademySection = dynamic(() => import('./KidsAcademySection'));
// const OnlineCoursesSection = dynamic(() => import('./OnlineCoursesSection'));
const ArticlesSection = dynamic(() => import('./ArticlesSection'));
const Trainers = dynamic(() => import('./Trainers'));
const ReviewSection = dynamic(() => import('./ReviewSection'));
const HaveAQuestion = dynamic(() => import('./HaveAQuestion'));

const HomePage = () => {
  return (
    <>
      <WelcomeSection />
      <PersonaIntroSection />
      <KidsAcademySection />
      <Container maxW="1200px" margin="0 auto" padding={{ base: '0 16px', xl: '0' }}>
        {/* <OnlineCoursesSection /> */}
        <ArticlesSection />
        <Trainers />
        <ReviewSection />
      </Container>
      <HaveAQuestion />
    </>
  );
};

export default HomePage;
