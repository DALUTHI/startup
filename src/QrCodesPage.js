import React from "react";
import { Container, Typography } from "@mui/material";
import QrCodeGenerator from "./QrCodeGenerator";

function QrCodePage() {
  return (
    <Container sx={{ 
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      py: 4
    }}>
      <Typography variant="h2" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
        QR Codes das Mesas
      </Typography>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", justifyContent: "center" }}>
        <QrCodeGenerator numeroMesa={1} />
        <QrCodeGenerator numeroMesa={2} />
        <QrCodeGenerator numeroMesa={3} />
      </div>
    </Container>
  );
}

export default QrCodePage;
