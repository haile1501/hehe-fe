import { useRouter } from "@/hooks/use-router";
import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";

type ExamCardProps = {
  id: string;
  name: string;
  imgUrl: string;
};

export const ExamCard = ({ id, name, imgUrl }: ExamCardProps) => {
  const { push } = useRouter();

  const handleOnClick = () => {
    push(`/admin/contests/edit-exam?id=${id}`);
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
      </Box>

      <CardContent sx={{ padding: 1.5 }}>
        <Typography variant="subtitle1" fontWeight={600} noWrap>
          {name}
        </Typography>
      </CardContent>
    </Card>
  );
};
