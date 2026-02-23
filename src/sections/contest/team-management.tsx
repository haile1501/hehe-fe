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
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

import { dispatch, useSelector } from "@/redux/store";
import { useEffect, useState } from "react";
import { updateTeams } from "@/redux/slices/contest";

interface Team {
  name: string;
  password: string;
  totalScore: number;
}

export const TeamManagement = () => {
  const { contestDetail } = useSelector((state) => state.contest);

  const [draftTeams, setDraftTeams] = useState<Team[]>([]);
  const [draftTeam, setDraftTeam] = useState<Team | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Lấy trạng thái từ contestDetail
  const isStarted = contestDetail?.isStarted || false;

  useEffect(() => {
    if (contestDetail?.teams) {
      setDraftTeams(contestDetail.teams);
    }
  }, [contestDetail]);

  if (!contestDetail) {
    return <Typography>Không tìm thấy contest</Typography>;
  }

  const handleAddTeam = () => {
    if (isStarted) return; // Bảo vệ logic
    setEditingIndex(null);
    setDraftTeam({ name: "", password: "", totalScore: 0 });
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
        <Box key={idx} sx={{ p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
          <Stack direction="row" justifyContent="space-between">
            <Box>
              <Typography fontWeight={600}>{team.name}</Typography>
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
                disabled={isStarted} // Disable nút sửa
              >
                Sửa
              </Button>

              <Button
                size="small"
                color="error"
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteIndex(idx)}
                disabled={isStarted} // Disable nút xóa
              >
                Xoá
              </Button>
            </Stack>
          </Stack>
        </Box>
      ))}

      {/* ===== ADD BUTTON ===== */}
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleAddTeam}
        disabled={isStarted} // Disable nút thêm
        sx={{ alignSelf: "flex-start" }}
      >
        Thêm đội
      </Button>

      {/* ===== FORM ADD / EDIT ===== */}
      {draftTeam && (
        <Box sx={{ p: 3, border: "1px dashed #aaa", borderRadius: 2 }}>
          <Typography mb={2}>
            {editingIndex !== null ? "Sửa đội" : "Thêm đội"}
          </Typography>

          <TextField
            fullWidth
            label="Tên đội"
            disabled={isStarted} // Khóa input
            value={draftTeam.name}
            onChange={(e) =>
              setDraftTeam({ ...draftTeam, name: e.target.value })
            }
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Password"
            disabled={isStarted} // Khóa input
            value={draftTeam.password}
            onChange={(e) =>
              setDraftTeam({ ...draftTeam, password: e.target.value })
            }
            sx={{ mb: 2 }}
          />

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveDraft}
              disabled={isStarted} // Disable nút lưu nháp
            >
              Lưu
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
              Huỷ
            </Button>
          </Stack>
        </Box>
      )}

      {/* ===== SAVE TO SERVER BUTTON ===== */}
      <Button
        variant="contained"
        color="success"
        onClick={handleSaveToServer}
        disabled={loading || isStarted} // Disable nút lưu server
      >
        {loading ? "Đang lưu..." : "Lưu đội"}
      </Button>

      {/* ===== DELETE CONFIRM ===== */}
      <Dialog open={deleteIndex !== null} onClose={() => setDeleteIndex(null)}>
        <DialogTitle>Xác nhận xoá</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xoá đội này?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteIndex(null)}>Huỷ</Button>
          <Button
            color="error"
            onClick={() =>
              deleteIndex !== null && handleDeleteDraft(deleteIndex)
            }
          >
            Xoá
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};
