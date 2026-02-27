import { useSelector } from "@/redux/store";
import { Box, Stack, Typography } from "@mui/material";
import { Timer } from "./round-1-question";
import { Socket } from "socket.io-client";
import { ReactNode, useEffect, useState } from "react";

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
    <Stack width="100vw" alignItems="center" pt={5} spacing={4}>
      <Stack direction="row" spacing={4} width="95%">
        <Stack position="relative" width="100%">
          {/* Viền đen trang trí */}
          <Stack
            width="100%"
            height="55vh"
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
            height="55vh"
            bgcolor="#A8D59C"
            zIndex={2}
            px={4}
            pt={2}
            border="5px solid #000000"
          >
            <Typography fontSize="1.5rem" fontWeight={700} color="#000" mb={2}>
              CÂU HỎI {contestDetail.round3.currentQuestion + 1}:
            </Typography>
            <Typography fontSize="1.5rem" fontWeight={600}>
              {currentQuestion.question}
            </Typography>
          </Stack>
          {/* Bóng đen đổ phía sau */}
          <Stack
            width="100%"
            height="55vh"
            bgcolor="#000000"
            position="absolute"
            zIndex={1}
            top={15}
            left={15}
          />
        </Stack>

        {/* Truyền giá trị timeLeft vào component Timer */}
        <Timer time={timeLeft} setIsOutOfTime={() => {}} />
      </Stack>

      <Stack width="80%">
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

interface GreenPanelProps {
  children: ReactNode;
  height?: number | string;
}

const GreenPanel = ({ children, height = 220 }: GreenPanelProps) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "33vh",
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
          height: "31.5vh",
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
