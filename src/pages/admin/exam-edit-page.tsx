// ExamEditPage.tsx
import { TabPanel } from "@/components/tab-panel";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDispatch, useSelector } from "@/redux/store";
import { createContest, getExamById, updateExam } from "@/redux/slices/exam";
import { Round1Questions } from "@/components/admin/contest-management/exams/round-1-questions";
import { Round3Questions } from "@/components/admin/contest-management/exams/round-3-questions";
import { useRouter } from "@/hooks/use-router";
import { Round2Questions } from "@/components/admin/contest-management/exams/round-2-questions";

export const ExamEditPage = () => {
  const [tab, setTab] = useState(0);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const dispatch = useDispatch();
  const { push } = useRouter();
  const { edittingExam } = useSelector((state) => state.exam);

  // dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [contestName, setContestName] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(getExamById(id));
    }
  }, [id, dispatch]);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleSaveExam = async () => {
    if (edittingExam) {
      try {
        await dispatch(updateExam(edittingExam._id, edittingExam));
        alert("Đã lưu đề thi thành công!");
      } catch (error) {
        console.error("Error saving exam:", error);
        alert("Có lỗi xảy ra khi lưu đề thi!");
      }
    } else {
      alert("Không có dữ liệu để lưu!");
    }
  };

  const handleSaveContest = () => {
    if (!edittingExam) {
      alert("Không có đề thi để tạo cuộc thi!");
      return;
    }
    if (!contestName.trim()) {
      alert("Vui lòng nhập tên cuộc thi!");
      return;
    }

    try {
      dispatch(createContest(edittingExam._id, contestName));

      alert("Tạo cuộc thi thành công!");
      setOpenDialog(false);
      setContestName("");
    } catch (error) {
      console.error("Error saving contest:", error);
      alert("Có lỗi xảy ra khi tạo cuộc thi!");
    }
  };

  return (
    <Container maxWidth="lg">
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => push("/admin/contests?tab=1")}
      >
        Quay lại
      </Button>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mt={2}
      >
        <Typography variant="h4">{edittingExam?.name}</Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => {
            setContestName(edittingExam?.name || "");
            setOpenDialog(true);
          }}
        >
          Tạo cuộc thi
        </Button>
      </Stack>

      <Stack spacing={3} mt={1}>
        <Stack>
          <Tabs value={tab} onChange={handleChange} aria-label="exam edit tabs">
            <Tab label="Vòng 1" />
            <Tab label="Vòng 2" />
            <Tab label="Vòng 3" />
          </Tabs>
          <Divider sx={{ width: "100%" }} />
        </Stack>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSaveExam}
          sx={{ alignSelf: "flex-end" }}
        >
          Lưu đề thi
        </Button>
        <TabPanel value={tab} index={0}>
          <Round1Questions />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <Box>
            <Round2Questions />
          </Box>
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <Box>
            <Round3Questions />
          </Box>
        </TabPanel>
      </Stack>

      {/* Dialog tạo contest */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>Tạo cuộc thi</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Tên cuộc thi"
              value={contestName}
              onChange={(e) => setContestName(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Huỷ</Button>
          <Button variant="contained" onClick={handleSaveContest}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
