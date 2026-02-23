import { useSelector } from "@/redux/store";
import { Box, Stack, Typography } from "@mui/material";
import { GreenPanel, Timer } from "./round-1-question";
import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";

type Round3QuestionProps = {
  socket: Socket | null;
};

export const Round3Question = (props: Round3QuestionProps) => {
  const { socket } = props;
  const { contestDetail } = useSelector((state) => state.contest);

  // State quản lý thời gian hiển thị trên Timer
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (socket) {
      // Lắng nghe sự kiện để kích hoạt bộ đếm giờ
      socket.on("start-timer", () => {
        setTimeLeft(15); // Set về 15 giây khi nhận tín hiệu
      });

      // Lắng nghe sự kiện để reset hoặc dừng timer khi cần (ví dụ chuyển câu)
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

  // Logic tự động đếm ngược ở phía Client (nếu bạn muốn Client tự chạy)
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
    <Stack width="100vw" alignItems="center" pt={8} spacing={4}>
      <Stack direction="row" spacing={4} width="60%">
        <Stack position="relative" width="100%">
          {/* Viền đen trang trí */}
          <Stack
            width="100%"
            height="500px"
            position="absolute"
            zIndex={3}
            bottom={15}
            right={15}
            border="5px solid #000000"
            sx={{ pointerEvents: "none" }} // Để không chặn click vào nội dung
          />
          {/* Panel nội dung câu hỏi */}
          <Stack
            width="100%"
            height="500px"
            bgcolor="#A8D59C"
            zIndex={2}
            p={4}
            border="5px solid #000000"
          >
            <Typography fontSize="1.5rem" fontWeight={700} color="#000" mb={2}>
              CÂU HỎI {contestDetail.round3.currentQuestion + 1}:
            </Typography>
            <Typography fontSize="1.25rem" fontWeight={600}>
              {currentQuestion.question}
            </Typography>
          </Stack>
          {/* Bóng đen đổ phía sau */}
          <Stack
            width="100%"
            height="500px"
            bgcolor="#000000"
            position="absolute"
            zIndex={1}
            top={15}
            left={15}
          />
        </Stack>

        {/* Truyền giá trị timeLeft vào component Timer */}
        <Timer time={timeLeft} />
      </Stack>

      <Stack width="50%">
        {contestDetail?.currentState === "show-answer" && (
          <GreenPanel>
            <Stack alignItems="center">
              <Typography
                fontSize="1.1rem"
                fontWeight={700}
                color="#2f846f"
                mb={1}
              >
                ĐÁP ÁN CHÍNH XÁC:
              </Typography>
              <Typography fontSize="1.5rem" fontWeight={800} color="#000">
                {currentQuestion.correctAnswer}
              </Typography>
            </Stack>
          </GreenPanel>
        )}
      </Stack>
    </Stack>
  );
};
