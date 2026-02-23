import { useEffect, useState } from "react";
import {
  Button,
  Grid,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { Exam } from "@/types/exam";
import { ExamCard } from "./exam-card";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "@/redux/store";
import { createExam } from "@/redux/slices/exam";

export const ExamList = () => {
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const { allExam } = useSelector((state) => state.exam);
  const dispatch = useDispatch();

  // Handle tạo đề mới
  const handleCreate = async () => {
    if (!newName.trim()) return;

    const newExam: Partial<Exam> = {
      name: newName,
      round1: { questions: [] },
      round2: { questions: [] },
      round3: { questions: [] },
    };

    await dispatch(createExam(newExam));
    setNewName("");
    setOpen(false);
  };

  return (
    <Stack spacing={4}>
      {/* Nút mở modal */}
      <Button
        variant="contained"
        sx={{ alignSelf: "flex-end" }}
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
      >
        Tạo đề mới
      </Button>

      {/* Danh sách exam */}
      <Grid container spacing={3}>
        {allExam.map((exam) => (
          <Grid size={{ sm: 4, md: 3 }} key={exam._id}>
            <ExamCard name={exam.name} imgUrl={exam.imgSrc} id={exam._id} />
          </Grid>
        ))}
      </Grid>

      {/* Modal tạo đề mới */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Tạo đề mới</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên đề"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleCreate}>
            Tạo
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};
