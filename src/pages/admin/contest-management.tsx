import { useState, useEffect } from "react";
import {
  Container,
  Tabs,
  Tab,
  Box,
  Divider,
  Stack,
  CircularProgress,
} from "@mui/material";
import { OnGoingContest } from "@/components/admin/contest-management/on-going-contests";
import { ExamList } from "@/components/admin/contest-management/exams";
import { TabPanel } from "@/components/tab-panel";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "@/redux/store";
import { getAllExam } from "@/redux/slices/exam";
import { getAllContest } from "@/redux/slices/contest";

export const ContestManagementPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = parseInt(searchParams.get("tab") || "0", 10);
  const [tab, setTab] = useState(tabFromUrl);
  const dispatch = useDispatch();
  const { loading: examLoading } = useSelector((state) => state.exam);
  const { loading: contestLoading } = useSelector((state) => state.contest);

  useEffect(() => {
    setTab(tabFromUrl);
  }, [tabFromUrl]);

  useEffect(() => {
    if (tab === 1) {
      dispatch(getAllExam());
    } else if (tab === 0) {
      dispatch(getAllContest());
    }
  }, [tab]);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    setSearchParams({ tab: newValue.toString() });
  };

  return (
    <Container maxWidth="lg">
      <Stack spacing={3}>
        <Stack>
          <Tabs
            value={tab}
            onChange={handleChange}
            aria-label="contest management tabs"
          >
            <Tab label="Cuộc thi đã tạo" />
            <Tab label="Đề thi" />
          </Tabs>
          <Divider />
        </Stack>

        <TabPanel value={tab} index={0}>
          <Box>
            {contestLoading ? (
              <Stack
                width="100%"
                height="100%"
                alignItems="center"
                justifyContent="center"
              >
                <CircularProgress size={120} />
              </Stack>
            ) : (
              <OnGoingContest />
            )}
          </Box>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          {examLoading ? (
            <Stack
              width="100%"
              height="100%"
              alignItems="center"
              justifyContent="center"
            >
              <CircularProgress size={120} />
            </Stack>
          ) : (
            <ExamList />
          )}
        </TabPanel>
      </Stack>
    </Container>
  );
};
