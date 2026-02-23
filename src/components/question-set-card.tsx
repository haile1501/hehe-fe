import { QuestionSet } from "@/types/question-set";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from "@mui/material";
import QuizIcon from "@mui/icons-material/Quiz";
import { useNavigate } from "react-router-dom";

type QuestionSetCardProps = {
  questionSet: QuestionSet;
};

export const QuestionSetCard = ({ questionSet }: QuestionSetCardProps) => {
  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate(`/quiz/${questionSet.id}/pre-start`);
  };

  return (
    <Card
      onClick={handleOnClick}
      sx={{
        width: 200,
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
          label={`${questionSet.numOfQuestion} Qs`}
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
        <Chip
          label={`${questionSet.playCount} lượt chơi`}
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "#ede9fe",
            color: "#6b21a8",
            fontSize: 12,
          }}
        />
      </Box>

      <CardContent sx={{ padding: 1.5 }}>
        <Typography variant="subtitle1" fontWeight={600} noWrap>
          {questionSet.name}
        </Typography>
      </CardContent>
    </Card>
  );
};
