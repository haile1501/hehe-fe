import { Round1Question } from "@/components/contestant/round-1-question";
import { Round2Question } from "@/components/contestant/round-2-question";
import { Round3Question } from "@/components/contestant/round-3-question";
import { useAuth } from "@/contexts/auth-context";
import { getContestById } from "@/redux/slices/contest";
import { useDispatch, useSelector } from "@/redux/store";
import { Round2Scoreboard } from "@/sections/contest/round-2-score-board";
import { ScoreBoard } from "@/sections/contest/score-board";
import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";

export const ContestantContestPage = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const { contestDetail } = useSelector((state) => state.contest);

  // Chuyển sang useState để component con nhận được sự thay đổi của socket
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(getContestById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (!id || !isAuthenticated) return;

    const socketInstance = io(import.meta.env.VITE_API_URL, {
      transports: ["websocket"],
      query: {
        contestId: id,
      },
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
    });

    socketInstance.on("next-step", async () => {
      dispatch(getContestById(id));
    });

    return () => {
      socketInstance.disconnect();
      socketInstance.off("next-step");
      setSocket(null);
    };
    // Loại bỏ contestDetail khỏi dependency để không bị reconnect mỗi khi data thay đổi
  }, [id, isAuthenticated, dispatch]);

  if (!isAuthenticated) {
    return <Navigate to="/contestant/login" replace />;
  }

  if (!contestDetail) return null;

  if (!contestDetail?.isStarted) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={10}
          sx={{
            padding: 5,
            width: 380,
            borderRadius: 4,
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255,255,255,0.9)",
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            color="#2f846f"
          >
            Cuộc thi sắp bắt đầu
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (contestDetail?.currentState === "score-board") {
    if (contestDetail.currentRound === 2) {
      return <Round2Scoreboard />;
    }

    return <ScoreBoard teams={contestDetail.teams} />;
  }

  if (contestDetail.currentRound === 1) {
    // Truyền trực tiếp state socket
    return <Round1Question socket={socket} />;
  }

  if (contestDetail.currentRound === 2) {
    return <Round2Question />;
  }

  if (contestDetail.currentRound === 3) {
    return <Round3Question socket={socket} />;
  }

  return null;
};
