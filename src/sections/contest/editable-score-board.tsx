import { Team } from "@/types/contest";
import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useDispatch } from "@/redux/store";
import { updateTeams } from "@/redux/slices/contest";

type Props = {
  teams: Team[];
  contestId: string;
};

export const EditableScoreBoard = ({ teams, contestId }: Props) => {
  const dispatch = useDispatch();

  // Local state lưu trữ điểm số tạm thời để Admin nhập liệu mượt mà
  const [localScores, setLocalScores] = useState<{ [key: string]: number }>({});

  // Đồng bộ lại localScores khi dữ liệu teams từ Redux thay đổi
  useEffect(() => {
    const scoresMap = teams.reduce(
      (acc, team) => {
        acc[team.name] = team.totalScore;
        return acc;
      },
      {} as { [key: string]: number },
    );
    setLocalScores(scoresMap);
  }, [teams]);

  // Luôn sắp xếp theo điểm từ cao xuống thấp
  const sortedTeams = [...teams].sort((a, b) => b.totalScore - a.totalScore);

  const handleScoreChange = (teamName: string, value: string) => {
    setLocalScores((prev) => ({
      ...prev,
      [teamName]: parseInt(value) || 0,
    }));
  };

  const handleSave = () => {
    // Chuyển đổi object scores thành mảng Partial<Team>[] để gửi API
    const teamsUpdate = teams.map((team) => ({
      name: team.name,
      totalScore: localScores[team.name] ?? team.totalScore,
      password: team.password,
    }));

    dispatch(updateTeams(contestId, teamsUpdate));
  };

  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="subtitle1" fontWeight={700} color="#2f846f">
          BẢNG ĐIỂM CHỈNH SỬA
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          sx={{ bgcolor: "#2f846f", "&:hover": { bgcolor: "#246656" } }}
        >
          Lưu điểm số
        </Button>
      </Stack>

      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: "#f8f9fa" }}>
            <TableRow>
              <TableCell align="center" width="15%">
                Hạng
              </TableCell>
              <TableCell width="50%">Đội thi</TableCell>
              <TableCell align="right" width="35%">
                Điểm số
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTeams.map((team, index) => (
              <TableRow key={team.name} hover>
                <TableCell align="center" sx={{ fontWeight: 700 }}>
                  #{index + 1}
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{team.name}</TableCell>
                <TableCell align="right">
                  <TextField
                    type="number"
                    variant="standard"
                    value={localScores[team.name] ?? team.totalScore}
                    onChange={(e) =>
                      handleScoreChange(team.name, e.target.value)
                    }
                    sx={{ width: 80 }}
                    inputProps={{
                      style: {
                        textAlign: "right",
                        fontWeight: 800,
                        color: "#2f846f",
                      },
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
