import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  Paper,
} from "@mui/material";
import { useAuth } from "@/contexts/auth-context";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { baseApi } from "@/config";
import { useRouter } from "@/hooks/use-router";

export const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get("id");

  const { login } = useAuth();
  const router = useRouter();

  const [contestId, setContestId] = useState(queryId || "");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!contestId) {
      setError("Vui lòng nhập mã cuộc thi");
      return;
    }

    try {
      const res = await axios.post(`${baseApi}/contest/contestant/login`, {
        teamName: username,
        password,
        contestId,
      });

      if (!res.data) {
        setError("Sai thông tin");
        return;
      }

      login({
        username: res.data.username,
        role: res.data.role,
      });

      router.push(`/contestant/play?id=${contestId}`);
    } catch (err) {
      setError("Sai thông tin");
    }
  };

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
        <Stack spacing={3}>
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            color="#2f846f"
          >
            Đăng nhập
          </Typography>

          <TextField
            label="Mã cuộc thi"
            value={contestId}
            onChange={(e) => setContestId(e.target.value)}
            autoComplete="off"
            fullWidth
          />

          <TextField
            label="Tên đội"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="off"
            inputProps={{ autoComplete: "new-username" }}
            fullWidth
          />

          <TextField
            label="Mật khẩu"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            fullWidth
          />

          {error && (
            <Typography color="error" fontSize={14}>
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            fullWidth
            onClick={handleLogin}
            sx={{
              backgroundColor: "#2f846f",
              fontWeight: 600,
              paddingY: 1.2,
              "&:hover": {
                backgroundColor: "#256d5c",
              },
            }}
          >
            Vào
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};
