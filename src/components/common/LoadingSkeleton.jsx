/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import { Box, Skeleton } from '@mui/material';

export const multipleSkeletons = () => {
  return (
    <Box
      sx={{ height: "max-content" }}
    >
      {[...Array(7)].map((_, index) => {
        if (index % 2) {
          return <LoadingSkeleton key={index} variant="rounded" animation="wave" width={600} height={20} />
        } else {
          return <LoadingSkeleton key={index} variant="rounded" animation="wave" width={500} height={20} />
        };
      })
      }
    </Box>
  );
};

export const LoadingSkeleton = ({ variant, animation, height, width }) => {
  return (
    <Skeleton variant={variant} animation={animation} width={width} height={height} sx={{ my: 3, mx: 1 }} />
  );
};
