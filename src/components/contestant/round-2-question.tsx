import { useSelector } from "@/redux/store";
import { useState } from "react";
import { Box, Typography, IconButton, Grid, Stack } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const Round2Question = () => {
  const { contestDetail } = useSelector((state) => state.contest);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<
    number | null
  >(null);

  if (!contestDetail) return null;
  const round2 = contestDetail.round2;
  const allQuestions = round2.questions || [];

  // Logic chia hàng cho ngôi sao:
  // Giả sử: nếu có 5 câu thì chia 3-2, nếu có 3 câu thì chia 2-1, nếu có 10 câu thì chia 5-5...
  const midIndex = Math.ceil(allQuestions.length / 2);
  const firstRow = allQuestions.slice(0, midIndex);
  const secondRow = allQuestions.slice(midIndex);

  if (selectedQuestionIndex !== null) {
    const currentQuestion = allQuestions[selectedQuestionIndex];
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        height="100vh"
        spacing={4}
      >
        <Box sx={{ width: "80%", position: "relative" }}>
          <IconButton
            onClick={() => setSelectedQuestionIndex(null)}
            sx={{
              position: "absolute",
              top: -60,
              left: 0,
              color: "white",
              bgcolor: "rgba(255,255,255,0.2)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          <GreenPanel>
            <Typography fontSize="1.75rem" textAlign="center" fontWeight={700}>
              {currentQuestion.question}
            </Typography>
          </GreenPanel>
        </Box>
      </Stack>
    );
  }

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      {/* Hàng 1 */}
      <Stack
        direction="row"
        spacing={10}
        justifyContent="center"
        flexWrap="wrap"
      >
        {firstRow.map((_, idx) => (
          <StarItem
            key={idx}
            number={idx + 1}
            onClick={() => setSelectedQuestionIndex(idx)}
          />
        ))}
      </Stack>

      {/* Hàng 2 */}
      {secondRow.length > 0 && (
        <Stack
          direction="row"
          spacing={10}
          justifyContent="center"
          flexWrap="wrap"
        >
          {secondRow.map((_, idx) => {
            const realIndex = midIndex + idx;
            return (
              <StarItem
                key={realIndex}
                number={realIndex + 1}
                onClick={() => setSelectedQuestionIndex(realIndex)}
              />
            );
          })}
        </Stack>
      )}
    </Box>
  );
};

const StarItem = ({
  number,
  onClick,
}: {
  number: number;
  onClick: () => void;
}) => (
  <Box
    onClick={onClick}
    sx={{
      cursor: "pointer",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "scale(1.15) translateY(-10px)",
        filter: "drop-shadow(0px 10px 20px rgba(0,0,0,0.5))",
      },
      position: "relative",
      width: { xs: 250, md: 250 },
      height: { xs: 250, md: 250 },
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Box
      component="img"
      src="/assets/star.png" // Thay đường dẫn ảnh của bạn ở đây
      sx={{
        width: "100%",
        height: "100%",
        position: "absolute",
        objectFit: "contain",
      }}
    />
    <Typography
      variant="h3"
      sx={{
        zIndex: 1,
        fontWeight: 900,
        color: "#444",
        mt: 1,
        textShadow: "1px 1px 2px rgba(255,255,255,0.8)",
      }}
    >
      {number}
    </Typography>
  </Box>
);

const GreenPanel = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      position: "relative",
      width: "100%",
      height: "380px",
      bgcolor: "#E6E7E8",
      borderRadius: "0 40px 0 40px",
      clipPath:
        "polygon(40px 0%, 100% 0%, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0% 100%, 0% 40px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Box
      sx={{
        width: "98%",
        height: "360px",
        bgcolor: "#A8D59C",
        borderRadius: "0 35px 0 35px",
        clipPath:
          "polygon(35px 0%, 100% 0%, 100% calc(100% - 35px), calc(100% - 35px) 100%, 0% 100%, 0% 35px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 4,
      }}
    >
      {children}
    </Box>
  </Box>
);
