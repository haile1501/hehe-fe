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
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "@/redux/store";
import { useState } from "react";
import { Exam } from "@/types/exam";
import { QuestionType } from "@/types/question";
import { updateEdittingExam } from "@/redux/slices/exam";

const uploadToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "harryle"); // Thay bằng preset của bạn

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dfo2moaod/image/upload",
    {
      method: "POST",
      body: formData,
    },
  );
  const data = await res.json();
  return data.secure_url; // Trả về URL ảnh
};

export const Round3Questions = () => {
  const { edittingExam } = useSelector((state) => state.exam);
  const dispatch = useDispatch();

  const [draftQuestions, setDraftQuestions] = useState<QuestionType[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  if (!edittingExam) {
    return <Typography>Không tìm thấy đề thi</Typography>;
  }

  const handleImageChange = async (file: File | null) => {
    if (!file) {
      setDraftQuestions((prev) => [{ ...prev[0], image: "" }]);
      return;
    }
    try {
      const imageUrl = await uploadToCloudinary(file);
      setDraftQuestions((prev) => [{ ...prev[0], image: imageUrl }]);
    } catch (error) {
      alert("Upload ảnh thất bại");
    }
  };

  const currentQuestions = edittingExam.round3?.questions || [];

  // ================= ADD =================
  const handleAddQuestion = () => {
    setEditingIndex(null);
    setDraftQuestions([
      {
        question: "",
        choices: [],
        correctAnswer: "",
        teamAnswers: [],
      },
    ]);
  };

  // ================= EDIT =================
  const handleEditQuestion = (index: number) => {
    const question = currentQuestions[index];
    setEditingIndex(index);
    setDraftQuestions([question]);
  };

  // ================= CHANGE =================
  const handleQuestionChange = (value: string) => {
    setDraftQuestions((prev) => [{ ...prev[0], question: value }]);
  };

  const handleAnswerChange = (value: string) => {
    setDraftQuestions((prev) => [
      {
        ...prev[0],
        choices: [{ label: "", text: value }],
        correctAnswer: value,
      },
    ]);
  };

  // ================= SAVE =================
  const handleSave = () => {
    const question = draftQuestions[0];

    if (!question.question.trim()) {
      alert("Vui lòng nhập nội dung câu hỏi");
      return;
    }

    let updatedQuestions: QuestionType[];

    if (editingIndex !== null) {
      // UPDATE
      updatedQuestions = currentQuestions.map((q, i) =>
        i === editingIndex ? question : q,
      );
    } else {
      // ADD
      updatedQuestions = [...currentQuestions, question];
    }

    const updatedExam: Exam = {
      ...edittingExam,
      round3: {
        ...(edittingExam.round3 || {}),
        questions: updatedQuestions,
      },
    };

    dispatch(updateEdittingExam(updatedExam));

    setDraftQuestions([]);
    setEditingIndex(null);
  };

  // ================= DELETE =================
  const handleDeleteQuestion = (index: number) => {
    const updatedExam: Exam = {
      ...edittingExam,
      round3: {
        ...(edittingExam.round3 || {}),
        questions: currentQuestions.filter((_, i) => i !== index),
      },
    };

    dispatch(updateEdittingExam(updatedExam));
    setDeleteIndex(null);
  };

  return (
    <Stack spacing={3}>
      {/* ===== LIST ===== */}
      <Box>
        <Typography variant="h6">Danh sách câu hỏi</Typography>

        {currentQuestions.length === 0 && (
          <Typography color="text.secondary">Chưa có câu hỏi nào</Typography>
        )}

        {currentQuestions.map((q, idx) => (
          <Box key={idx} sx={{ mb: 2 }}>
            <Box
              sx={{
                p: 2,
                border: "1px solid #ddd",
                borderRadius: 2,
                background: editingIndex === idx ? "#fff8e1" : "transparent",
              }}
            >
              <Stack direction="row" justifyContent="space-between">
                <Typography fontWeight={600} sx={{ whiteSpace: "pre-wrap" }}>
                  Câu {idx + 1}: {q.question}
                </Typography>

                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditQuestion(idx)}
                  >
                    Sửa
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={() => setDeleteIndex(idx)}
                  >
                    Xoá
                  </Button>
                </Stack>
              </Stack>

              {q.image && (
                <Box
                  component="img"
                  src={q.image}
                  sx={{
                    mt: 2,
                    maxWidth: "100%",
                    width: 300,
                    height: "auto",
                    borderRadius: 1,
                    display: "block",
                  }}
                />
              )}

              <Typography mt={1}>
                Đáp án: {q.choices?.[0]?.text || "(chưa có đáp án)"}
              </Typography>
            </Box>

            {/* ===== EDIT FORM (ngay dưới câu hỏi đang edit) ===== */}
            {editingIndex === idx && draftQuestions.length > 0 && (
              <Box
                sx={{ p: 2, mt: 2, border: "1px dashed #aaa", borderRadius: 2 }}
              >
                <TextField
                  fullWidth
                  label="Nội dung câu hỏi"
                  multiline
                  rows={5}
                  value={draftQuestions[0].question}
                  onChange={(e) => handleQuestionChange(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{ mb: 2 }}
                >
                  <Button variant="outlined" component="label">
                    Tải ảnh
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) =>
                        e.target.files && handleImageChange(e.target.files[0])
                      }
                    />
                  </Button>
                  {draftQuestions[0].image && (
                    <Box sx={{ position: "relative" }}>
                      <img
                        src={draftQuestions[0].image}
                        alt="preview"
                        style={{ height: 50, borderRadius: 4 }}
                      />
                      <Button
                        size="small"
                        color="error"
                        sx={{ minWidth: 0, ml: 1 }}
                        onClick={() => handleImageChange(null)}
                      >
                        Xóa
                      </Button>
                    </Box>
                  )}
                </Stack>

                <TextField
                  fullWidth
                  label="Đáp án đúng"
                  value={draftQuestions[0].choices?.[0]?.text || ""}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                  >
                    Cập nhật
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CloseIcon />}
                    onClick={() => {
                      setDraftQuestions([]);
                      setEditingIndex(null);
                    }}
                  >
                    Huỷ
                  </Button>
                </Stack>
              </Box>
            )}
          </Box>
        ))}
      </Box>

      {/* ===== ADD BUTTON ===== */}
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleAddQuestion}
        sx={{ alignSelf: "flex-start" }}
      >
        Thêm câu hỏi
      </Button>

      {/* ===== ADD FORM (cho câu hỏi mới) ===== */}
      {editingIndex === null && draftQuestions.length > 0 && (
        <Box sx={{ p: 2, border: "1px dashed #aaa", borderRadius: 2 }}>
          <TextField
            fullWidth
            label="Nội dung câu hỏi"
            multiline
            rows={5}
            value={draftQuestions[0].question}
            onChange={(e) => handleQuestionChange(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Button variant="outlined" component="label">
              Tải ảnh
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) =>
                  e.target.files && handleImageChange(e.target.files[0])
                }
              />
            </Button>
            {draftQuestions[0].image && (
              <Box sx={{ position: "relative" }}>
                <img
                  src={draftQuestions[0].image}
                  alt="preview"
                  style={{ height: 50, borderRadius: 4 }}
                />
                <Button
                  size="small"
                  color="error"
                  sx={{ minWidth: 0, ml: 1 }}
                  onClick={() => handleImageChange(null)}
                >
                  Xóa
                </Button>
              </Box>
            )}
          </Stack>

          <TextField
            fullWidth
            label="Đáp án đúng"
            value={draftQuestions[0].choices?.[0]?.text || ""}
            onChange={(e) => handleAnswerChange(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
            >
              Lưu
            </Button>

            <Button
              variant="outlined"
              color="error"
              startIcon={<CloseIcon />}
              onClick={() => {
                setDraftQuestions([]);
                setEditingIndex(null);
              }}
            >
              Huỷ
            </Button>
          </Stack>
        </Box>
      )}

      {/* ===== DELETE CONFIRM ===== */}
      <Dialog open={deleteIndex !== null} onClose={() => setDeleteIndex(null)}>
        <DialogTitle>Xác nhận xoá</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xoá câu hỏi này khỏi Round 3?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteIndex(null)}>Huỷ</Button>

          <Button
            color="error"
            onClick={() =>
              deleteIndex !== null && handleDeleteQuestion(deleteIndex)
            }
          >
            Xoá
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};
