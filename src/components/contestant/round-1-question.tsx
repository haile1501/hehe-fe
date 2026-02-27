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

  const remainTime = Math.max(
    0,
    Math.floor(
      ((currentQuestion.startedDate || Date.now()) +
        (currentQuestion.time || 0) * 1000 -
        Date.now()) /
        1000,
    ),
  );

  // 🔥 check team đã trả lời chưa (reload case)
  const existedAnswer = currentQuestion.teamAnswers?.find(
    (t) => t.teamName === username,
  );

  const [selected, setSelected] = useState<string | null>(
    existedAnswer?.answerLabel || null,
  );

  const isAnswered = !!selected;

  const handleSelect = (label: string) => {
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
      height="100vh"
      pt={3}
      spacing={8}
      position="relative"
    >
      <Stack direction="row" alignItems="center" spacing={4} width="80%">
        <GreenPanel>
          <Typography variant="h5" fontWeight={700}>
            {currentQuestion.question}
          </Typography>
        </GreenPanel>
        <Box position="absolute" right={30} top={40}>
          <Timer
            time={remainTime}
            setIsOutOfTime={() => setIsOutOfTime(true)}
          />
        </Box>
      </Stack>

      <Grid container rowSpacing={16} columnSpacing={20} width="80vw">
        {currentQuestion.choices.map((choice) => (
          <Grid size={{ xs: 6 }} key={choice.label}>
            <ChoiceItem
              label={choice.label}
              text={choice.text}
              selected={selected === choice.label}
              disabled={isAnswered || showResult}
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

export const GreenPanel = ({ children, height = 220 }: GreenPanelProps) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "285px",
        backgroundColor: "#E6E7E8",
        // 1. Bo tròn góc TRÊN-PHẢI và DƯỚI-TRÁI
        borderRadius: "0 35px 0 35px",
        // 2. Gọt chéo góc TRÊN-TRÁI và DƯỚI-PHẢI
        // Tọa độ polygon:
        // (40px 0%) -> Vết cắt bắt đầu ở cạnh trên (trái)
        // (100% 0%) -> Chạy sang phải (sẽ được borderRadius bo cong)
        // (100% calc(100% - 40px)) -> Vết cắt bắt đầu ở cạnh phải (dưới)
        // (calc(100% - 40px) 100%) -> Vết cắt kết thúc ở cạnh đáy (phải)
        // (0% 100%) -> Chạy sang trái (sẽ được borderRadius bo cong)
        // (0% 40px) -> Quay về cạnh trái để đóng vết cắt trên-trái
        clipPath:
          "polygon(35px 0%, 100% 0%, 100% calc(100% - 35px), calc(100% - 35px) 100%, 0% 100%, 0% 35px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "99%",
          height: "270px",
          backgroundColor: "#A8D59C",
          // 1. Bo tròn góc TRÊN-PHẢI và DƯỚI-TRÁI
          borderRadius: "0 30px 0 30px",
          // 2. Gọt chéo góc TRÊN-TRÁI và DƯỚI-PHẢI
          // Tọa độ polygon:
          // (35px 0%) -> Vết cắt bắt đầu ở cạnh trên (trái)
          // (100% 0%) -> Chạy sang phải (sẽ được borderRadius bo cong)
          // (100% calc(100% - 40px)) -> Vết cắt bắt đầu ở cạnh phải (dưới)
          // (calc(100% - 40px) 100%) -> Vết cắt kết thúc ở cạnh đáy (phải)
          // (0% 100%) -> Chạy sang trái (sẽ được borderRadius bo cong)
          // (0% 40px) -> Quay về cạnh trái để đóng vết cắt trên-trái
          clipPath:
            "polygon(30px 0%, 100% 0%, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0% 100%, 0% 30px)",
          display: "flex",
          alignItems: "center",
          padding: "0 40px",
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
}: {
  time: number;
  setIsOutOfTime: () => void;
}) => {
  const [currentTime, setCurrentTime] = useState(time);

  useEffect(() => {
    setCurrentTime(time); // reset khi prop thay đổi

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
  }, [time]);

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
