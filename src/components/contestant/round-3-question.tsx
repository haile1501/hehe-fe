import { useSelector } from "@/redux/store";
import { Box, Stack, Typography } from "@mui/material";
import { TimerDisplay } from "./round-1-question";
import { Socket } from "socket.io-client";
import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";

type Round3QuestionProps = {
  socket: Socket | null;
};

export const Round3Question = (props: Round3QuestionProps) => {
  const { socket } = props;
  const { contestDetail } = useSelector((state) => state.contest);
  const { username } = useAuth();

  const isViewer = username === "viewer";

  // State quản lý thời gian
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (socket) {
      socket.on("start-timer", () => {
        setTimeLeft(15);
      });
      socket.on("stop-timer", () => {
        setTimeLeft(0);
      });

      return () => {
        socket.off("start-timer");
        socket.off("stop-timer");
      };
    }
  }, [socket]);

  useEffect(() => {
    setTimeLeft(0);
  }, [contestDetail]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  if (!contestDetail) return null;

  const currentQuestion =
    contestDetail.round3.questions[contestDetail.round3.currentQuestion];

  return (
    <Stack
      width="100vw"
      height="100vh"
      direction="row"
      spacing={4}
      px={4}
      py={8}
      boxSizing="border-box"
    >
      {/* CỘT TRÁI: PANEL CÂU HỎI (ARTICLE STYLE) */}
      <Stack position="relative" flex={1} height="100%">
        <Stack
          width="100%"
          height="100%"
          position="absolute"
          zIndex={3}
          bottom={15}
          right={15}
          border="5px solid #000000"
          sx={{ pointerEvents: "none" }}
        />

        <Stack
          width="100%"
          height="100%"
          bgcolor="#A8D59C"
          zIndex={2}
          px={3}
          py={3}
          border="5px solid #000000"
          boxSizing="border-box"
        >
          <Typography fontSize="1.5rem" fontWeight={700} color="#000" mb={3}>
            CÂU HỎI {contestDetail.round3.currentQuestion + 1}:
          </Typography>

          {/* Container chính bọc nội dung như một bài báo */}
          <Stack
            direction="column" // Chuyển về column để text và ảnh xếp theo dòng chảy tự nhiên
            spacing={3}
            flex={1}
            sx={{ overflowY: "auto" }} // Cho phép cuộn nếu nội dung quá dài
            justifyContent="flex-start"
          >
            <Typography
              fontSize="1.5rem" // Tăng nhẹ size chữ cho dễ đọc kiểu article
              lineHeight={1.6}
              sx={{
                whiteSpace: "pre-wrap",
                textAlign: "justify", // Căn đều hai bên cho giống bài báo
                flex: 1,
              }}
            >
              {currentQuestion.question}
            </Typography>
            {currentQuestion.image && (
              <Box
                component="img"
                src={currentQuestion.image}
                sx={{
                  alignSelf: "center", // Ảnh nằm giữa article
                  width: "auto",
                  maxWidth: "60%",
                  maxHeight: "350px", // Giới hạn chiều cao ảnh để nhường chỗ cho text
                  objectFit: "contain",
                  bgcolor: "#fff",
                  mb: 2,
                }}
              />
            )}
          </Stack>
        </Stack>

        <Stack
          width="100%"
          height="100%"
          bgcolor="#000000"
          position="absolute"
          zIndex={1}
          top={15}
          left={15}
        />
      </Stack>

      {/* CỘT PHẢI: TIMER VÀ ĐÁP ÁN (Giữ nguyên cấu trúc của bạn) */}
      <Stack
        width="23%"
        height="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        {isViewer && (
          <Stack width="100%" alignItems="center">
            <TimerDisplay time={timeLeft} />
          </Stack>
        )}

        <Box width="100%" height="40%">
          {contestDetail?.currentState === "show-answer" && (
            <GreenPanel>
              <Stack alignItems="center" textAlign="center" spacing={1}>
                <Typography
                  fontSize="1.1rem"
                  fontWeight={700}
                  color="#2f846f"
                  sx={{ textTransform: "uppercase" }}
                >
                  Đáp án
                </Typography>
                <Typography fontSize="1.4rem" color="#000">
                  {currentQuestion.correctAnswer}
                </Typography>
              </Stack>
            </GreenPanel>
          )}
        </Box>
      </Stack>
    </Stack>
  );
};

// Component Panel Đáp án với Clip-path tùy chỉnh
const GreenPanel = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: "#000", // Màu viền ngoài đen
        borderRadius: "0 35px 0 35px",
        clipPath:
          "polygon(35px 0%, 100% 0%, 100% calc(100% - 35px), calc(100% - 35px) 100%, 0% 100%, 0% 35px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: "5px", // Tạo độ dày cho viền đen
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          backgroundColor: "#A8D59C",
          borderRadius: "0 30px 0 30px",
          clipPath:
            "polygon(30px 0%, 100% 0%, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0% 100%, 0% 30px)",
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
};
