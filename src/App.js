import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  CssBaseline,
  Container,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  Snackbar,
  Chip,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Cardapio from "./Cardapio";
import Cozinha from "./Cozinha";
import "./App.css";
 
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#212121" }, // Cinza escuro
    secondary: { main: "#757575" }, // Cinza médio
    background: { default: "#121212", paper: "#1E1E1E" }, // Fundo escuro
    text: { primary: "#E0E0E0", secondary: "#BDBDBD" }, // Texto claro
    error: { main: "#D32F2F" },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
    h4: { fontWeight: "bold", color: "#E0E0E0" },
    h5: { fontWeight: "600", color: "#BDBDBD" },
    body1: { color: "#BDBDBD" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          fontWeight: "bold",
          transition: "transform 0.2s, box-shadow 0.2s",
          backgroundColor: "#333333",
          color: "#E0E0E0",
          "&:hover": {
            backgroundColor: "#444444",
            transform: "scale(1.05)",
            boxShadow: "0 4px 10px rgba(255,255,255,0.1)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          padding: "20px",
          background: "#1E1E1E",
          boxShadow: "0 2px 5px rgba(255,255,255,0.1)",
        },
      },
    },
  },
});
 
function App() {
  const [carrinho, setCarrinho] = useState([]);
  const [pedidoConfirmado, setPedidoConfirmado] = useState(false);
  const [ingrediente, setIngrediente] = useState("");
  const [socket, setSocket] = useState(null);
 
  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:3001");
 
    newSocket.onopen = () => console.log("Conexão WebSocket estabelecida!");
    newSocket.onerror = (error) => console.error("Erro WebSocket:", error);
    newSocket.onmessage = (event) => console.log("Recebido:", event.data);
 
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);
 
  const adicionarAoCarrinho = (item) => {
    setCarrinho((prev) => [...prev, { ...item, ingrediente }]);
    setIngrediente("");
  };
 
  const removerDoCarrinho = (index) => {
    setCarrinho((prev) => prev.filter((_, i) => i !== index));
  };
 
  const finalizarPedido = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const pedido = {
        itens: carrinho.map((item) => ({
          nome: item.nome,
          preco: item.preco,
          ingrediente: item.ingrediente || "Nenhuma alteração",
        })),
        mesa: 1,
      };
 
      socket.send(JSON.stringify(pedido));
      console.log("Pedido enviado:", pedido);
    } else {
      console.error("WebSocket desconectado.");
    }
 
    setCarrinho([]);
    setPedidoConfirmado(true);
  };
 
  return (
<ThemeProvider theme={theme}>
<CssBaseline />
<Router>
<Routes>
<Route
            path="/"
            element={
<Container
                maxWidth="sm"
                sx={{
                  padding: "20px",
                  minHeight: "100vh",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  backgroundColor: "background.default",
                }}
>
<Paper elevation={3} sx={{ padding: "24px", flexGrow: 1 }}>
<Typography variant="h4" gutterBottom align="center">
                    LIFEBOX MENU
</Typography>
<Typography variant="body1" paragraph align="center">
                    Escolha e envie seu pedido diretamente para a cozinha!
</Typography>
<Cardapio adicionarAoCarrinho={adicionarAoCarrinho} />
<Typography variant="h5" sx={{ mt: 3, textAlign: "center" }}>
                    🛒 Seu Pedido
</Typography>
                  {carrinho.length === 0 ? (
<Typography variant="body1" align="center">
                      Carrinho vazio.
</Typography>
                  ) : (
<List>
                      {carrinho.map((item, index) => (
<ListItem key={index}>
<ListItemText
                            primary={`${item.nome} - R$${item.preco}`}
                            secondary={
                              item.ingrediente && (
<Chip label={`Sem ${item.ingrediente}`} size="small" sx={{ mt: 1, backgroundColor: "#757575", color: "#E0E0E0" }} />
                              )
                            }
                          />
<IconButton color="error" onClick={() => removerDoCarrinho(index)}>
<DeleteIcon />
</IconButton>
</ListItem>
                      ))}
</List>
                  )}
<TextField
                    label="Remover ingrediente? (ex: cebola, tomate)"
                    variant="outlined"
                    fullWidth
                    value={ingrediente}
                    onChange={(e) => setIngrediente(e.target.value)}
                    sx={{ mt: 2, backgroundColor: "#333", borderRadius: "8px" }}
                    InputProps={{ style: { color: "#E0E0E0" } }}
                  />
<Button variant="contained" sx={{ mt: 2, width: "100%", py: 1.5 }} disabled={carrinho.length === 0} onClick={finalizarPedido}>
                    Confirmar Pedido
</Button>
</Paper>
</Container>
            }
          />
<Route path="/cozinha" element={<Cozinha />} />
</Routes>
</Router>
<Snackbar
        open={pedidoConfirmado}
        autoHideDuration={3000}
        onClose={() => setPedidoConfirmado(false)}
        message={
<Typography variant="body1">
<CheckCircleIcon sx={{ mr: 1, verticalAlign: "middle" }} /> Pedido enviado!
</Typography>
        }
        sx={{
          "& .MuiSnackbarContent-root": { backgroundColor: "#4CAF50", color: "#FFF" },
        }}
      />
</ThemeProvider>
  );
}
 
export default App;