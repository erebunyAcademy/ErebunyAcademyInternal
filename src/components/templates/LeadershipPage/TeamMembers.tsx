import React, { FC } from 'react';
import { Grid, TabPanel } from '@chakra-ui/react';
import TeamCard from '@/components/molecules/TeamCard';
import { MemberType } from '@/types/member';

type TeamMembersProps = {
  data: MemberType[];
};

const TeamMembers: FC<TeamMembersProps> = ({ data }) => {
  return (
    <TabPanel padding={0}>
      <Grid
        display="grid"
        justifyContent="center"
        alignItems="center"
        templateColumns={{
          base: 'repeat(auto-fit,350px)',
        }}
        gridGap={{ base: '16px', sm: '20px' }}>
        {data.map((teamMember, i: number) => (
          <TeamCard {...teamMember} key={i} />
        ))}
      </Grid>
    </TabPanel>
  );
};

export default TeamMembers;
