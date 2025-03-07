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
    mode: "light",
    primary: { main: "#d84315" }, // Laranja vibrante
    secondary: { main: "#ffb74d" }, // Laranja claro
    background: { default: "#fff3e0", paper: "#ffe0b2" }, // Tons quentes
    text: { primary: "#4e342e", secondary: "#6d4c41" },
    error: { main: "#d32f2f" }, // Vermelho
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
    h4: { fontWeight: "bold", textShadow: "1px 1px 2px rgba(0,0,0,0.1)" },
    h5: { fontWeight: "600", color: "#4e342e" },
    body1: { color: "#6d4c41" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          fontWeight: "bold",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": { transform: "scale(1.05)", boxShadow: "0 4px 15px rgba(0,0,0,0.2)" },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "20px",
          padding: "24px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          background: "linear-gradient(145deg, #ffe0b2, #fff3e0)",
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

    newSocket.onopen = () => {
      console.log("Conexão WebSocket estabelecida com sucesso!");
    };

    newSocket.onerror = (error) => {
      console.error("Erro na conexão WebSocket:", error);
    };

    newSocket.onmessage = (event) => {
      console.log("Mensagem recebida do servidor:", event.data);
    };

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const adicionarAoCarrinho = (item) => {
    setCarrinho((prevCarrinho) => [...prevCarrinho, { ...item, ingrediente }]);
    setIngrediente("");
  };

  const removerDoCarrinho = (index) => {
    setCarrinho((prevCarrinho) => prevCarrinho.filter((_, i) => i !== index));
  };

  const finalizarPedido = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const pedido = {
        itens: carrinho.map((item) => ({
          nome: item.nome,
          preco: item.preco,
          ingrediente: item.ingrediente || "Nenhuma alteração",
        })),
        mesa: 1, // Número da mesa (pode ser dinâmico)
      };

      console.log("Enviando pedido:", pedido);
      socket.send(JSON.stringify(pedido));
      console.log("Pedido enviado com sucesso!");
    } else {
      console.error("WebSocket não está conectado.");
    }

    setCarrinho([]);
    setPedidoConfirmado(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {/* Removido o AppBar (header laranja) */}
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
                  justifyContent: "space-between",
                  backgroundColor: "#fff3e0",
                }}
              >
                <Paper elevation={3} sx={{ padding: "24px", flexGrow: 1 }}>
                  <Typography variant="h4" gutterBottom align="center">
                    🍴 Cardápio Online
                  </Typography>
                  <Typography variant="body1" paragraph align="center">
                    Escolha seu pedido e envie diretamente para a cozinha!
                  </Typography>
                  <Cardapio adicionarAoCarrinho={adicionarAoCarrinho} />
                  <Typography variant="h5" sx={{ mt: 3, textAlign: "center" }}>
                    🛒 Itens do Pedido
                  </Typography>
                  {carrinho.length === 0 ? (
                    <Typography variant="body1" color="text.secondary" align="center">
                      Seu carrinho está vazio.
                    </Typography>
                  ) : (
                    <List>
                      {carrinho.map((item, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={`${item.nome} - ${item.preco}`}
                            secondary={
                              item.ingrediente && (
                                <Chip
                                  label={`Sem ${item.ingrediente}`}
                                  size="small"
                                  sx={{ mt: 1, backgroundColor: "#ffcc80" }}
                                />
                              )
                            }
                          />
                          <IconButton
                            color="error"
                            onClick={() => removerDoCarrinho(index)}
                            sx={{ "&:hover": { transform: "scale(1.1)" } }}
                          >
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
                    sx={{ mt: 2 }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2, width: "100%", py: 1.5 }}
                    disabled={carrinho.length === 0}
                    onClick={finalizarPedido}
                  >
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
        <Typography variant="body1" sx={{ color: "#000" }}> 
          <CheckCircleIcon sx={{ mr: 1, verticalAlign: "middle" }} />
           Pedido enviado para a cozinha!
        </Typography>
      }
        sx={{
          "& .MuiSnackbarContent-root": { backgroundColor: "#4caf50" },
        }}
      />
    </ThemeProvider>
  );
}

export default App;
