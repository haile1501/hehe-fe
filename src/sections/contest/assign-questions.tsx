import { useDispatch, useSelector } from "@/redux/store";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Paper,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { updateTeams } from "@/redux/slices/contest";

export const AssignQuestions = () => {
  const { contestDetail } = useSelector((state) => state.contest);
  const dispatch = useDispatch();

  const [assignments, setAssignments] = useState<{
    [teamName: string]: number | null | undefined;
  }>({});

  useEffect(() => {
    if (contestDetail?.teams) {
      const initialAssignments: {
        [teamName: string]: number | null | undefined;
      } = {};
      contestDetail.teams.forEach((team) => {
        initialAssignments[team.name] = team.assignedRound2Question ?? null;
      });
      setAssignments(initialAssignments);
    }
  }, [contestDetail]);

  if (!contestDetail) return null;

  // Lấy danh sách tất cả ID câu hỏi đã bị chiếm dụng
  const allAssignedIndices = Object.values(assignments).filter(
    (idx) => idx !== null && idx !== undefined,
  ) as number[];

  const handleAssign = (teamName: string, questionIndex: number | null) => {
    setAssignments((prev) => ({
      ...prev,
      [teamName]: questionIndex,
    }));
  };

  const handleSave = () => {
    const updatedTeams = contestDetail.teams.map((team) => ({
      ...team,
      assignedRound2Question: assignments[team.name] as number,
    }));
    dispatch(updateTeams(contestDetail._id, updatedTeams));
  };

  const allAssigned = contestDetail.teams.every(
    (team) => assignments[team.name] != null,
  );

  return (
    <Box mb={2}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontWeight: "bold", color: "primary.main" }}
      >
        Phân phối câu hỏi vòng 2
      </Typography>

      <Stack spacing={3}>
        {contestDetail.teams.map((team) => {
          const currentSelectedIdx = assignments[team.name];

          return (
            <Paper
              key={team.name}
              sx={{
                p: 3,
                borderLeft: "5px solid",
                borderColor: "primary.light",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, fontWeight: "bold" }}
              >
                Đội: {team.name}
              </Typography>

              <FormControl fullWidth>
                <InputLabel id={`label-${team.name}`}>Chọn câu hỏi</InputLabel>
                <Select
                  labelId={`label-${team.name}`}
                  // Đảm bảo value là string để Select của MUI hoạt động mượt mà
                  value={
                    currentSelectedIdx !== null &&
                    currentSelectedIdx !== undefined
                      ? currentSelectedIdx
                      : ""
                  }
                  onChange={(e) =>
                    handleAssign(
                      team.name,
                      (e.target.value as any) !== ""
                        ? Number(e.target.value)
                        : null,
                    )
                  }
                  label="Chọn câu hỏi"
                >
                  <MenuItem value="">
                    <em>Bỏ chọn</em>
                  </MenuItem>

                  {contestDetail.round2.questions.map((q, idx) => {
                    // Logic lọc: Hiển thị nếu câu hỏi chưa bị ai chọn HOẶC chính đội này đang chọn nó
                    const isDisabled =
                      allAssignedIndices.includes(idx) &&
                      currentSelectedIdx !== idx;

                    if (isDisabled) return null; // Hoặc dùng disabled={true} trong MenuItem nếu muốn hiện nhưng không cho bấm

                    return (
                      <MenuItem key={idx} value={idx}>
                        {`Câu ${idx + 1}: ${q.question}`}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Paper>
          );
        })}
      </Stack>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSave}
          disabled={!allAssigned}
          sx={{ px: 5 }}
        >
          Lưu phân bổ
        </Button>
      </Box>
    </Box>
  );
};
