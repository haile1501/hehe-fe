import { useEffect, useState } from "react";
import { Contest } from "@/types/contest";
import { Grid } from "@mui/material";
import { ContestCard } from "./contest-card";
import { useSelector } from "@/redux/store";

export const OnGoingContest = () => {
  const { allContest } = useSelector((state) => state.contest);

  return (
    <Grid container spacing={3}>
      {allContest.map((contest, index) => (
        <Grid size={{ md: 3 }} key={index}>
          <ContestCard
            name={contest.name}
            id={contest._id}
            imgUrl={contest.imgSrc}
          />
        </Grid>
      ))}
    </Grid>
  );
};
