import { useAuth } from "@/contexts/auth-context";
import { useSelector } from "@/redux/store";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import { Socket } from "socket.io-client";

type Round1QuestionProps = {
  socket: Socket | null;
};

export const Round1Question = (props: Round1QuestionProps) => {
  const { contestDetail } = useSelector((state) => state.contest);
  const { username } = useAuth();
  const { socket } = props;
  const [isOutOfTime, setIsOutOfTime] = useState(false);

  if (!contestDetail) return null;

  const round1 = contestDetail.round1;
  const currentQuestion = round1.questions[round1.currentQuestion];

  const isViewer = username === "viewer";

  const maxTime = currentQuestion.time || 0;

  const calcRemainTime = () => {
    const raw = Math.max(
      0,
      Math.floor(
        ((currentQuestion.startedDate || Date.now()) +
          maxTime * 1000 -
          Date.now()) /
          1000,
      ),
    );
    return Math.min(raw, maxTime);
  };

  const remainTime = calcRemainTime();

  // Đếm ngầm cho cả viewer và thí sinh
  useEffect(() => {
    setIsOutOfTime(false); // Reset khi câu hỏi mới

    const checkTime = setInterval(() => {
      if (calcRemainTime() <= 0) {
        setIsOutOfTime(true);
        clearInterval(checkTime);
      }
    }, 500);

    return () => clearInterval(checkTime);
  }, [round1.currentQuestion, currentQuestion.startedDate]);

  // 🔥 check team đã trả lời chưa (reload case)
  const existedAnswer = currentQuestion.teamAnswers?.find(
    (t) => t.teamName === username,
  );

  const [selected, setSelected] = useState<string | null>(
    existedAnswer?.answerLabel || null,
  );

  const isAnswered = !!selected;

  const handleSelect = (label: string) => {
    // Viewer không được chọn đáp án
    if (isViewer) return;
    if (isAnswered || remainTime <= 0) return;

    setSelected(label);

    socket?.emit("submit", {
      contestId: contestDetail._id,
      teamName: username,
      questionIndex: round1.currentQuestion,
      answer: label,
    });
  };

  const showResult = remainTime <= 0 || isOutOfTime;

  return (
    <Stack
      alignItems="center"
      minHeight="100vh"
      pt={3}
      pb={10}
      spacing={8}
      position="relative"
    >
      <Stack direction="row" alignItems="center" spacing={4} width="80%">
        <GreenPanel>
          <Stack spacing={2} width="100%">
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{ whiteSpace: "pre-wrap" }}
            >
              {currentQuestion.question}
            </Typography>
            {currentQuestion.image && (
              <Box
                component="img"
                src={currentQuestion.image}
                sx={{
                  maxWidth: "100%",
                  maxHeight: "400px",
                  objectFit: "contain",
                }}
              />
            )}
          </Stack>
        </GreenPanel>
        {isViewer && (
          <Box position="absolute" right={30} top={40}>
            <Timer
              time={isOutOfTime ? 0 : remainTime}
              setIsOutOfTime={() => setIsOutOfTime(true)}
              delay={1500}
            />
          </Box>
        )}
      </Stack>

      <Grid container rowSpacing={4} columnSpacing={4} width="80vw">
        {currentQuestion.choices.map((choice) => (
          <Grid size={{ xs: 6 }} key={choice.label}>
            <ChoiceItem
              label={choice.label}
              text={choice.text}
              selected={selected === choice.label}
              disabled={isViewer || isAnswered || showResult}
              correctLabel={currentQuestion.correctAnswer || ""}
              showResult={showResult}
              onSelect={() => handleSelect(choice.label)}
            />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

interface GreenPanelProps {
  children: ReactNode;
  height?: number | string;
}

export const GreenPanel = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        // Loại bỏ height cố định, dùng minHeight để đảm bảo không bị quá nhỏ
        minHeight: "200px",
        backgroundColor: "#E6E7E8",
        borderRadius: "0 35px 0 35px",
        // ClipPath giữ nguyên nhưng sẽ tự chạy theo kích thước Box
        clipPath:
          "polygon(35px 0%, 100% 0%, 100% calc(100% - 35px), calc(100% - 35px) 100%, 0% 100%, 0% 35px)",
        display: "flex",
        alignItems: "stretch", // Stretch để Box con bên dưới phủ hết chiều cao
        justifyContent: "center",
        p: "8px", // Khoảng cách để lộ lớp màu xám bên dưới (border giả)
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          backgroundColor: "#A8D59C",
          borderRadius: "0 30px 0 30px",
          clipPath:
            "polygon(30px 0%, 100% 0%, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0% 100%, 0% 30px)",
          display: "flex",
          alignItems: "center",
          // QUAN TRỌNG: Dùng padding để tạo độ cao dựa trên text
          padding: "40px 40px",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export const Timer = ({
  time,
  setIsOutOfTime,
  delay = 0,
}: {
  time: number;
  setIsOutOfTime: () => void;
  delay?: number;
}) => {
  const [currentTime, setCurrentTime] = useState(time);

  useEffect(() => {
    setCurrentTime(time); // reset khi prop thay đổi

    // Delay trước khi bắt đầu đếm
    const delayTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(delayTimeout);
  }, [time, delay]);

  useEffect(() => {
    if (currentTime === 0) {
      setIsOutOfTime();
    }
  }, [currentTime]);

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      bgcolor="#000000"
      borderRadius="50%"
      height="80px"
      width="90px"
      border="10px solid #01BF63"
    >
      <Typography
        sx={{
          fontFamily: "'Digital7', sans-serif",
          fontSize: "3rem",
          color:
            currentTime > 15
              ? "#07FC06"
              : currentTime >= 6
                ? "#FFF812"
                : "#FD1102",
        }}
      >
        {currentTime}
      </Typography>
    </Stack>
  );
};

type ChoiceItemProps = {
  label: string;
  text: string;
  selected: boolean;
  disabled: boolean;
  showResult: boolean;
  correctLabel: string;
  onSelect: () => void;
};

const ChoiceItem = ({
  label,
  text,
  selected,
  disabled,
  showResult,
  correctLabel,
  onSelect,
}: ChoiceItemProps) => {
  const isCorrect = label === correctLabel;

  // 1. Định nghĩa màu sắc cho Main Layer và Shadow Layer
  let mainBg = "#2f846f";
  let shadowBg = "#2CAD9D";

  if (showResult) {
    if (isCorrect) {
      mainBg = "#2ecc71"; // Xanh lá tươi khi đúng
      shadowBg = "#27ae60";
    } else if (selected && !isCorrect) {
      mainBg = "#e74c3c"; // Đỏ khi chọn sai
      shadowBg = "#c0392b";
    } else {
      mainBg = "#555"; // Xám cho các câu khác khi hiện kết quả
      shadowBg = "#333";
    }
  } else if (selected) {
    // Màu khi người dùng click chọn (trước khi hết giờ)
    mainBg = "#38a38a";
    shadowBg = "#2CAD9D";
  }

  return (
    <Box
      onClick={onSelect}
      sx={{
        position: "relative",
        width: "100%",
        height: "110px",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "transform 0.2s ease",
        // Hiệu ứng nhấc lên khi hover (chỉ khi chưa disable)
        "&:hover": {
          transform: disabled ? "none" : "translateY(-6px) scale(1.02)",
        },
        "&:hover .shadow-layer": {
          bottom: disabled ? -8 : -4,
        },
        "&:hover .main-layer": {
          backgroundColor: showResult ? mainBg : "#38a38a",
          boxShadow: disabled ? "none" : "0 8px 20px rgba(0,0,0,0.3)",
        },
        opacity: disabled && !selected && !isCorrect && showResult ? 0.7 : 1,
      }}
    >
      {/* Lớp đổ phía dưới (Shadow Layer) */}
      <Box
        className="shadow-layer"
        sx={{
          position: "absolute",
          bottom: -8,
          left: 0,
          right: 0,
          height: "110px",
          backgroundColor: shadowBg,
          borderRadius: "40px",
          transition: "all 0.2s ease",
        }}
      />

      {/* Panel chính (Main Layer) */}
      <Box
        className="main-layer"
        sx={{
          position: "relative",
          height: "100%",
          backgroundColor: mainBg,
          borderRadius: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingX: 4,
          color: "white",
          fontWeight: 700,
          transition: "all 0.2s ease",
          border: selected ? "3px solid white" : "none", // Viền trắng khi chọn
        }}
      >
        <Typography fontSize="1.25rem" fontWeight={600}>
          {label}. {text}
        </Typography>

        {/* Checkbox Icon */}
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: "6px",
            border: "2px solid white",
            backgroundColor: selected ? "white" : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: mainBg,
            fontWeight: 900,
          }}
        >
          {selected && "✓"}
        </Box>
      </Box>
    </Box>
  );
};
