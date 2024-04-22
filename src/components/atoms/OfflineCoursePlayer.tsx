import { FC, memo, useState } from 'react';
import { Box, IconButton, useBreakpointValue } from '@chakra-ui/react';
import { OfflineCourseVideo } from '@prisma/client';
import Image from 'next/image';
import PlayIcon from '/public/icons/course_video_play.svg';
import ReactPlayer from 'react-player';
import { generateAWSUrl } from '@/utils/helpers/common';

interface Props {
  video: OfflineCourseVideo;
}

const OfflineCoursePlayer: FC<Props> = ({ video }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const w = useBreakpointValue({ base: '100%', md: '80%' }, { ssr: false });
  const h = useBreakpointValue({ base: '100%', md: '100%' }, { ssr: false });
  const borderRadius = useBreakpointValue({ base: 20, md: 20 }, { ssr: false });

  return (
    <Box
      w={w}
      h={h}
      borderRadius={borderRadius}
      overflow={'hidden'}
      margin={'0 auto'}
      position="relative">
      {video.thumbnail && !isPlaying ? (
        <>
          <IconButton
            isRound
            position={'absolute'}
            w={'unset'}
            h={'unset'}
            icon={<PlayIcon />}
            aria-label="PlayIcon"
            top={0}
            zIndex={50}
            left={'50%'}
            transform={'translate(-50%)'}
            onClick={() => setIsPlaying(true)}
          />
          <Image
            fill
            src={generateAWSUrl(video.thumbnail)}
            alt={'thumbnail'}
            objectFit="cover"
            style={{ position: 'absolute', top: 48, borderRadius }}
          />
        </>
      ) : (
        <ReactPlayer
          controls
          playing={isPlaying}
          url={generateAWSUrl(video.key)}
          width="100%"
          height="100%"
        />
      )}
    </Box>
  );
};

export default memo(OfflineCoursePlayer);
