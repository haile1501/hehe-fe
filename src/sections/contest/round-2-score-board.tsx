import { useSelector } from "@/redux/store";
import { Box, Typography, Stack, Paper } from "@mui/material";

export const Round2Scoreboard = () => {
  const { contestDetail } = useSelector((state) => state.contest);

  if (!contestDetail) return null;

  // Sắp xếp đội theo điểm và lấy 4 đội đầu bảng
  const sortedTeams = [...(contestDetail?.teams || [])]
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 4);

  // Hàm lấy màu sao theo hạng (Hạng 3 đồng hạng nên dùng chung màu đồng)
  const getStarColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "#FFD700"; // Vàng
      case 2:
        return "#C0C0C0"; // Bạc
      case 3:
        return "#CD7F32"; // Đồng
      default:
        return "#CD7F32";
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: 2,
        pb: 5,
        position: "relative",
      }}
    >
      <Stack
        direction="row"
        alignItems="flex-end"
        spacing={4}
        sx={{ width: "95%", maxWidth: 1200, mt: 20 }}
      >
        {/* Hạng 3 bên trái */}
        {sortedTeams[2] && (
          <PodiumColumn
            team={sortedTeams[2]}
            rank={3}
            height={220}
            color={getStarColor(3)}
          />
        )}

        {/* Hạng 1 (Chính giữa) */}
        {sortedTeams[0] && (
          <PodiumColumn
            team={sortedTeams[0]}
            rank={1}
            height={420}
            color={getStarColor(1)}
          />
        )}

        {/* Hạng 2 */}
        {sortedTeams[1] && (
          <PodiumColumn
            team={sortedTeams[1]}
            rank={2}
            height={320}
            color={getStarColor(2)}
          />
        )}

        {/* Hạng 3 đồng hạng bên phải */}
        {sortedTeams[3] && (
          <PodiumColumn
            team={sortedTeams[3]}
            rank={3}
            height={220}
            color={getStarColor(3)}
          />
        )}
      </Stack>
    </Box>
  );
};

// Component con PodiumColumn
const PodiumColumn = ({ team, rank, height, color }: any) => (
  <Box
    sx={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      animation: "fadeInUp 0.8s ease-out",
      "@keyframes fadeInUp": {
        from: { opacity: 0, transform: "translateY(50px)" },
        to: { opacity: 1, transform: "translateY(0)" },
      },
    }}
  >
    {/* Ngôi sao và Hiệu ứng ánh sáng tỏa tròn (như ban đầu) */}
    <Box
      sx={{
        position: "relative",
        width: 120,
        height: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mb: -2,
        zIndex: 2,
        // Hiệu ứng ánh sáng trắng tỏa ra xung quanh (tròn mềm)
        filter:
          "drop-shadow(0px 0px 25px rgba(255, 255, 255, 0.9)) drop-shadow(0px 0px 45px rgba(255, 255, 255, 0.5))",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          bgcolor: color,
          clipPath:
            "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
        }}
      />
      <Typography
        variant="h3"
        sx={{
          position: "absolute",
          fontWeight: 900,
          color: "#FFF",
          textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
        }}
      >
        {rank}
      </Typography>
    </Box>

    {/* Cột hiển thị: Bo tròn 4 góc, Không viền, Gradient #88D378 -> #C9F6BF */}
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        height: height,
        background: "linear-gradient(180deg, #88D378 0%, #C9F6BF 100%)",
        borderRadius: "24px",
        border: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        px: 2,
        pt: 5,
        textAlign: "center",
        boxShadow: "0px 15px 35px rgba(0,0,0,0.25)",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          color: "#1B4D3E",
          mb: 2,
          wordBreak: "break-word",
          lineHeight: 1.2,
        }}
      >
        {team.name}
      </Typography>

      <Box
        sx={{
          bgcolor: "rgba(27, 77, 62, 0.15)",
          px: 3,
          py: 1,
          borderRadius: "16px",
          mb: 4,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            color: "#FFF",
            textShadow: "2px 2px 4px rgba(27, 77, 62, 0.5)",
          }}
        >
          {team.totalScore}
        </Typography>
      </Box>
    </Paper>
  </Box>
);
