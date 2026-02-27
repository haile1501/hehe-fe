import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import PaletteIcon from "@mui/icons-material/Palette";

import { dispatch, useSelector } from "@/redux/store";
import { useEffect, useState } from "react";
import { updateTeams } from "@/redux/slices/contest";

interface Team {
  name: string;
  password: string;
  totalScore: number;
  color: string;
}

export const TeamManagement = () => {
  const { contestDetail } = useSelector((state) => state.contest);

  const [draftTeams, setDraftTeams] = useState<Team[]>([]);
  const [draftTeam, setDraftTeam] = useState<Team | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const isStarted = contestDetail?.isStarted || false;

  useEffect(() => {
    if (contestDetail?.teams) {
      // Đảm bảo các team cũ nếu chưa có màu sẽ có màu mặc định
      const teamsWithColor = contestDetail.teams.map((t: Team) => ({
        ...t,
        color: t.color || "#3f51b5",
      }));
      setDraftTeams(teamsWithColor);
    }
  }, [contestDetail]);

  if (!contestDetail) {
    return <Typography>Không tìm thấy contest</Typography>;
  }

  const handleAddTeam = () => {
    if (isStarted) return;
    setEditingIndex(null);
    // Khởi tạo team mới với màu mặc định
    setDraftTeam({ name: "", password: "", totalScore: 0, color: "#3f51b5" });
  };

  const handleEditTeam = (index: number) => {
    if (isStarted) return;
    setEditingIndex(index);
    setDraftTeam(draftTeams[index]);
  };

  const handleSaveDraft = () => {
    if (!draftTeam || isStarted) return;

    if (!draftTeam.name.trim()) {
      alert("Vui lòng nhập tên đội");
      return;
    }

    if (!draftTeam.password.trim()) {
      alert("Vui lòng nhập mật khẩu");
      return;
    }

    let updatedTeams;
    if (editingIndex !== null) {
      updatedTeams = draftTeams.map((team, i) =>
        i === editingIndex ? draftTeam : team,
      );
    } else {
      updatedTeams = [...draftTeams, draftTeam];
    }

    setDraftTeams(updatedTeams);
    setDraftTeam(null);
    setEditingIndex(null);
  };

  const handleDeleteDraft = (index: number) => {
    if (isStarted) return;
    setDraftTeams((prev) => prev.filter((_, i) => i !== index));
    setDeleteIndex(null);
  };

  const handleSaveToServer = async () => {
    try {
      setLoading(true);
      await dispatch(updateTeams(contestDetail._id, draftTeams));
      alert("Lưu đội thành công 🎉");
    } catch (error: any) {
      alert(error.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3} mt={4}>
      <Typography variant="h5">Quản lý đội thi</Typography>

      {/* ===== LIST TEAM ===== */}
      {draftTeams.map((team, idx) => (
        <Box
          key={idx}
          sx={{
            p: 2,
            border: "1px solid #ddd",
            borderRadius: 2,
            borderLeft: `6px solid ${team.color || "#ccc"}`, // Hiển thị màu ở viền trái cho đẹp
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    backgroundColor: team.color,
                  }}
                />
                <Typography fontWeight={600}>{team.name}</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Password: {team.password}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => handleEditTeam(idx)}
                disabled={isStarted}
              >
                Sửa
              </Button>

              <Button
                size="small"
                color="error"
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteIndex(idx)}
                disabled={isStarted}
              >
                Xoá
              </Button>
            </Stack>
          </Stack>
        </Box>
      ))}

      {/* ===== ADD BUTTON ===== */}
      {!draftTeam && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddTeam}
          disabled={isStarted}
          sx={{ alignSelf: "flex-start" }}
        >
          Thêm đội
        </Button>
      )}

      {/* ===== FORM ADD / EDIT ===== */}
      {draftTeam && (
        <Box
          sx={{
            p: 3,
            border: "1px dashed #aaa",
            borderRadius: 2,
            bgcolor: "#f9f9f9",
          }}
        >
          <Typography variant="subtitle1" fontWeight={700} mb={2}>
            {editingIndex !== null ? "Chỉnh sửa đội" : "Tạo đội mới"}
          </Typography>

          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Tên đội"
              disabled={isStarted}
              value={draftTeam.name}
              onChange={(e) =>
                setDraftTeam({ ...draftTeam, name: e.target.value })
              }
            />

            <TextField
              fullWidth
              label="Password"
              disabled={isStarted}
              value={draftTeam.password}
              onChange={(e) =>
                setDraftTeam({ ...draftTeam, password: e.target.value })
              }
            />

            {/* Color Picker Field */}
            <TextField
              fullWidth
              label="Màu sắc đại diện"
              type="color"
              disabled={isStarted}
              value={draftTeam.color}
              onChange={(e) =>
                setDraftTeam({ ...draftTeam, color: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PaletteIcon />
                  </InputAdornment>
                ),
              }}
              helperText="Chọn màu sắc để phân biệt đội trên bảng xếp hạng"
            />

            <Stack direction="row" spacing={2} pt={1}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveDraft}
                disabled={isStarted}
              >
                Xác nhận
              </Button>

              <Button
                variant="outlined"
                color="error"
                startIcon={<CloseIcon />}
                onClick={() => {
                  setDraftTeam(null);
                  setEditingIndex(null);
                }}
              >
                Huỷ bỏ
              </Button>
            </Stack>
          </Stack>
        </Box>
      )}

      <hr style={{ border: "0.5px solid #eee", width: "100%" }} />

      {/* ===== SAVE TO SERVER BUTTON ===== */}
      <Button
        variant="contained"
        color="success"
        size="large"
        onClick={handleSaveToServer}
        disabled={loading || isStarted || draftTeams.length === 0}
        sx={{ fontWeight: "bold" }}
      >
        {loading ? "Đang xử lý..." : "Lưu tất cả thay đổi lên hệ thống"}
      </Button>

      {/* ===== DELETE CONFIRM ===== */}
      <Dialog open={deleteIndex !== null} onClose={() => setDeleteIndex(null)}>
        <DialogTitle>Xác nhận xoá đội</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Hành động này sẽ xoá đội{" "}
            <b>{deleteIndex !== null && draftTeams[deleteIndex]?.name}</b> khỏi
            danh sách tạm thời. Bạn vẫn cần nhấn "Lưu tất cả" để hoàn tất.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteIndex(null)}>Hủy</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() =>
              deleteIndex !== null && handleDeleteDraft(deleteIndex)
            }
          >
            Đồng ý xoá
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};
