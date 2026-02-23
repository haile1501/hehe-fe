import {
  Stepper,
  Step,
  StepLabel,
  Box,
  styled,
  Typography,
} from "@mui/material";

// Tùy chỉnh CSS để Stepper trông hiện đại hơn
const StyledStepper = styled(Stepper)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(4),
}));

export const ContestStepper = ({ contest }: { contest: any }) => {
  const { currentRound, round1, round2, round3 } = contest;

  // Xác định các bước dựa trên Round hiện tại
  const getSteps = () => {
    if (currentRound === 1) {
      // Vòng 1: Hiển thị từng câu hỏi
      return round1.questions.map(
        (_: any, index: number) => `Câu ${index + 1}`,
      );
    }

    if (currentRound === 2) {
      // Vòng 2: Chỉ hiện một đường thẳng (hoặc 1 bước duy nhất)
      return ["Vòng 2: Tự do"];
    }

    if (currentRound === 3) {
      // Vòng 3: Hiển thị từng câu hỏi
      return round3.questions.map(
        (_: any, index: number) => `Câu ${index + 1}`,
      );
    }

    return [];
  };

  // Xác định vị trí bước hiện tại
  const getActiveStep = () => {
    if (currentRound === 1) return round1.currentQuestion;
    if (currentRound === 2) return 0; // Luôn ở vị trí duy nhất
    if (currentRound === 3) return round3.currentQuestion;
    return 0;
  };

  const steps = getSteps();
  const activeStep = getActiveStep();

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Typography
        variant="caption"
        sx={{
          mb: 1,
          display: "block",
          fontWeight: "bold",
          color: "primary.main",
        }}
      >
        TIẾN ĐỘ VÒNG {currentRound}
      </Typography>
      <StyledStepper
        activeStep={activeStep}
        alternativeLabel={currentRound !== 2} // Vòng 2 không cần label phức tạp
      >
        {steps.map((label: string, index: number) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </StyledStepper>
    </Box>
  );
};
