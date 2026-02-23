import { useEffect, useRef, useState } from "react";
import { Button, Box } from "@mui/material";
import { keyframes } from "@emotion/react";

const shrinkOverlay = keyframes`
  from { width: 100%; }
  to { width: 0%; }
`;

export default function TimeCounterButton({
  onTimeEnd,
  onTick,
  keyTrigger,
}: {
  onTimeEnd?: () => void;
  onTick?: (remaining: number) => void;
  keyTrigger: any;
}) {
  const [startShrink, setStartShrink] = useState(false);
  const [remaining, setRemaining] = useState(30);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setStartShrink(false);
    setRemaining(30);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1;
        if (onTick) onTick(next);
        if (next <= 0) {
          clearInterval(timerRef.current!);
          onTimeEnd?.();
        }
        return next;
      });
    }, 1000);

    setTimeout(() => setStartShrink(true), 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [keyTrigger]);

  return (
    <Button
      variant="contained"
      disableElevation
      sx={{
        position: "relative",
        px: 2,
        py: 0.5,
        borderRadius: "10px",
        fontWeight: "bold",
        fontSize: "16px",
        backgroundColor: "#68274e",
        color: "#fff",
        overflow: "hidden",
        textTransform: "none",
        fontFamily: "inherit",
        width: "120px",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.3)",
          width: "100%",
          animation: startShrink
            ? `${shrinkOverlay} 30s linear forwards`
            : "none",
          zIndex: 1,
        }}
      />
      <Box sx={{ position: "relative", zIndex: 2 }}>Thưởng</Box>
    </Button>
  );
}
