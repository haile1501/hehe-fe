import { useSelector } from "@/redux/store";
import { Box, Typography, Stack, Paper } from "@mui/material";

export const Round2Scoreboard = () => {
  const { contestDetail } = useSelector((state) => state.contest);

  if (!contestDetail) return null;

  const sortedTeams = [...(contestDetail?.teams || [])]
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 4);

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
            starColor={getStarColor(3)}
          />
        )}

        {/* Hạng 1 (Chính giữa) */}
        {sortedTeams[0] && (
          <PodiumColumn
            team={sortedTeams[0]}
            rank={1}
            height={420}
            starColor={getStarColor(1)}
          />
        )}

        {/* Hạng 2 */}
        {sortedTeams[1] && (
          <PodiumColumn
            team={sortedTeams[1]}
            rank={2}
            height={320}
            starColor={getStarColor(2)}
          />
        )}

        {/* Hạng 3 đồng hạng bên phải */}
        {sortedTeams[3] && (
          <PodiumColumn
            team={sortedTeams[3]}
            rank={3}
            height={220}
            starColor={getStarColor(3)}
          />
        )}
      </Stack>
    </Box>
  );
};

// Hàm tính toán màu chữ tương phản (Black/White) dựa trên màu nền
const getContrastColor = (hexcolor: string) => {
  if (!hexcolor) return "#000";
  const hex = hexcolor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#1B4D3E" : "#FFF"; // Trả về màu tối hoặc màu trắng
};

const PodiumColumn = ({ team, rank, height, starColor }: any) => {
  const teamColor = team.color || "#88D378";
  const textColor = getContrastColor(teamColor);

  return (
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
      {/* Ngôi sao hạng */}
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
          filter: "drop-shadow(0px 0px 20px rgba(255, 255, 255, 0.6))",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            bgcolor: starColor,
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

      {/* Cột Podium: Màu của team */}
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          height: height,
          backgroundColor: teamColor, // Sử dụng màu đội thi
          borderRadius: "24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: 2,
          pt: 5,
          textAlign: "center",
          boxShadow: "0px 15px 35px rgba(0,0,0,0.25)",
          // Thêm một chút gradient nhẹ để tạo chiều sâu cho cột
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.1) 100%)",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: textColor, // Chuyển sang màu tương phản
            mb: 2,
            wordBreak: "break-word",
            lineHeight: 1.2,
          }}
        >
          {team.name}
        </Typography>

        <Box
          sx={{
            bgcolor:
              textColor === "#FFF"
                ? "rgba(255, 255, 255, 0.2)"
                : "rgba(0, 0, 0, 0.1)",
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
              color: textColor, // Chuyển sang màu tương phản
              textShadow:
                textColor === "#FFF" ? "1px 1px 4px rgba(0,0,0,0.2)" : "none",
            }}
          >
            {team.totalScore}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};
