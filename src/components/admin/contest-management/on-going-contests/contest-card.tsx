import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from "@mui/material";
import QuizIcon from "@mui/icons-material/Quiz";
import { useRouter } from "@/hooks/use-router";

type ContestCardProps = {
  name: string;
  id: string;
  imgUrl: string;
};

export const ContestCard = ({ name, id, imgUrl }: ContestCardProps) => {
  const { push } = useRouter();

  const handleOnClick = () => {
    // leave blank for now
    push(`/admin/contests/control?id=${id}`);
  };

  return (
    <Card
      onClick={handleOnClick}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.2s",
        ":hover": {
          transform: "translateY(-4px)",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CardMedia
          component="img"
          src={"/assets/image-1.png"}
          alt="thumbnail"
        />

        <Chip
          icon={<QuizIcon />}
          label={id}
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            backgroundColor: "white",
            color: "black",
            fontSize: 12,
          }}
        />
      </Box>

      <CardContent sx={{ padding: 1.5 }}>
        <Typography variant="subtitle1" fontWeight={600} noWrap>
          {name}
        </Typography>
      </CardContent>
    </Card>
  );
};
