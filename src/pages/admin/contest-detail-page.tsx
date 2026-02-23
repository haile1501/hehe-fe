import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
  Stack,
  IconButton,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "@/redux/store";
import { getContestById } from "@/redux/slices/contest";
import { TeamManagement } from "@/sections/contest/team-management";
import { io, Socket } from "socket.io-client";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import { EditableScoreBoard } from "@/sections/contest/editable-score-board";

export const ContestDetailPage = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { contestDetail: contest } = useSelector((state) => state.contest);
  const dispatch = useDispatch();
  const socketRef = useRef<Socket | null>(null);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) dispatch(getContestById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (!id) return;
    const socket = io(import.meta.env.VITE_API_URL, {
      transports: ["websocket"],
      query: { contestId: id },
    });
    socketRef.current = socket;

    socket.on("next-step", () => {
      dispatch(getContestById(id));
    });

    return () => {
      socket.disconnect();
    };
  }, [id, dispatch]);

  if (!contest) return null;

  // --- LOGIC TÍNH TOÁN DỮ LIỆU ---
  const getActiveStepFromRedux = () => {
    const { currentRound, currentState } = contest;
    if (currentRound === 2) return 0;

    const roundData = currentRound === 1 ? contest.round1 : contest.round3;
    const qIdx =
      roundData.currentQuestion === -1 ? 0 : roundData.currentQuestion;

    if (currentRound === 1) {
      let step = qIdx * 2;
      if (currentState === "score-board") step += 1;
      return step;
    }

    if (currentRound === 3) {
      let step = qIdx * 3;
      if (currentState === "show-answer") step += 1;
      if (currentState === "score-board") step += 2;
      return step;
    }

    return 0;
  };

  const activeStep = getActiveStepFromRedux();

  const getStepsConfig = () => {
    const { currentRound } = contest;
    let steps: { label: string; index: number }[] = [];

    if (currentRound === 1) {
      contest.round1.questions.forEach((_, i) => {
        steps.push({ label: `Câu ${i + 1}`, index: i * 2 });
        steps.push({ label: `BXH`, index: i * 2 + 1 });
      });
    } else if (currentRound === 3) {
      contest.round3.questions.forEach((_, i) => {
        steps.push({ label: `Câu ${i + 1}`, index: i * 3 });
        steps.push({ label: `Đáp án`, index: i * 3 + 1 });
        steps.push({ label: `BXH`, index: i * 3 + 2 });
      });
    } else {
      steps.push({ label: "Vòng 2: Chọn sao", index: 0 });
    }
    return steps;
  };

  // KIỂM TRA XEM CÓ PHẢI LÀ KẾT THÚC VÒNG 3 KHÔNG
  const isFinalStep =
    contest.currentRound === 3 &&
    contest.currentState === "score-board" &&
    contest.round3.currentQuestion === contest.round3.questions.length - 1;

  const handleAction = () => {
    if (isFinalStep) return; // Chặn bấm nếu là cuối cùng
    socketRef.current?.emit("next", { contestId: id });
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(contest._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getButtonConfig = () => {
    if (!contest.isStarted)
      return { text: "BẮT ĐẦU CUỘC THI", color: "#2f846f" };

    switch (contest.currentState) {
      case "question":
        return {
          text: contest.currentRound === 3 ? "SHOW ĐÁP ÁN" : "SHOW BẢNG ĐIỂM",
          color: "#2f846f",
        };
      case "show-answer":
        return { text: "SHOW BẢNG ĐIỂM", color: "#0288d1" };
      case "score-board":
        return { text: "CÂU TIẾP THEO", color: "#ed6c02" };
      default:
        return { text: "NEXT", color: "#2f846f" };
    }
  };

  const btnConfig = getButtonConfig();
  const allSteps = getStepsConfig();
  const windowSize = 9;
  const start = Math.max(
    0,
    Math.min(activeStep - 4, Math.max(0, allSteps.length - windowSize)),
  );
  const visibleSteps = allSteps.slice(start, start + windowSize);

  const handleStartTimer = () => {
    socketRef.current?.emit("start-timer-admin", { contestId: id });
  };

  // Điều kiện để hiển thị nút đếm ngược: Vòng 3 và đang ở trạng thái câu hỏi
  const showTimerButton =
    contest.isStarted &&
    contest.currentRound === 3 &&
    contest.currentState === "question";

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* PANEL 1: INFO */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h4" fontWeight={800} color="#2f846f">
              {contest.name}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1} mt={1}>
              <Typography variant="body2" color="text.secondary">
                ID: <strong>{contest._id}</strong>
              </Typography>
              <IconButton size="small" onClick={handleCopyId}>
                {copied ? (
                  <CheckIcon fontSize="inherit" color="success" />
                ) : (
                  <ContentCopyIcon fontSize="inherit" />
                )}
              </IconButton>
              <Typography
                variant="body2"
                color="#ed6c02"
                fontWeight="bold"
                sx={{ ml: 2 }}
              >
                VÒNG {contest.currentRound} |{" "}
                {contest.isStarted ? "ĐANG DIỄN RA" : "CHỜ BẮT ĐẦU"}
              </Typography>
            </Stack>
          </Box>
          <Typography variant="h6" fontWeight={700} color="secondary">
            {isFinalStep
              ? "KẾT THÚC CUỘC THI"
              : contest.currentState === "score-board"
                ? "BẢNG XẾP HẠNG"
                : contest.currentState === "show-answer"
                  ? "ĐÁP ÁN"
                  : "ĐANG TRẢ LỜI"}
          </Typography>
        </Stack>
        <Divider sx={{ my: 3 }} />
        <TeamManagement />
      </Paper>

      {/* PANEL 2: CONTROL */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" fontWeight={700} mb={3}>
            Bảng Điều Khiển Tiến Độ
          </Typography>
          {showTimerButton && (
            <Button
              variant="contained"
              color="error" // Dùng màu đỏ để nổi bật nút hành động khẩn cấp
              onClick={handleStartTimer}
              sx={{ fontWeight: "bold" }}
            >
              Bắt đầu đếm ngược (15s)
            </Button>
          )}
        </Stack>

        {contest.isStarted && (
          <Box sx={{ mb: 4 }}>
            <Stepper activeStep={activeStep - start} alternativeLabel>
              {visibleSteps.map((step) => (
                <Step key={step.index} completed={step.index < activeStep}>
                  <StepLabel
                    sx={{ "& .MuiStepLabel-label": { fontSize: "0.7rem" } }}
                  >
                    {step.label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        )}

        {(contest.currentRound === 2 ||
          (contest.currentRound === 3 &&
            contest.currentState === "question")) && (
          <EditableScoreBoard teams={contest.teams} contestId={contest._id} />
        )}

        {/* ẨN NÚT HOẶC HIỂN THỊ NÚT DỰA TRÊN ĐIỀU KIỆN KẾT THÚC */}
        {!isFinalStep ? (
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleAction}
            sx={{
              height: 70,
              fontSize: "1.2rem",
              fontWeight: "bold",
              borderRadius: 4,
              backgroundColor: btnConfig.color,
              "&:hover": { opacity: 0.9, backgroundColor: btnConfig.color },
              textTransform: "uppercase",
            }}
          >
            {btnConfig.text}
          </Button>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              py: 2,
              bgcolor: "#f0f4f1",
              borderRadius: 2,
            }}
          >
            <Typography variant="h5" color="#2f846f" fontWeight={800}>
              🏆 CUỘC THI ĐÃ KẾT THÚC
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};
