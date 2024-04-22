import React, { FC } from 'react';
import { Container } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { Job } from '@/models/careers.model';

const IntroForJob = dynamic(() => import('./IntroForJob'));
const DescriptionSection = dynamic(() => import('./DescriptionSection'));
const ApplicationForm = dynamic(() => import('./ApplicationForm'));

type Props = {
  job: Job;
};

const CareersJobPage: FC<Props> = ({ job }) => {
  return (
    <Container maxW="1200px" padding={{ base: '0 16px', xl: '0' }}>
      <IntroForJob job={job} />
      <DescriptionSection job={job} />
      <ApplicationForm jobId={job.id} />
    </Container>
  );
};

export default CareersJobPage;
