import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Container, Paper, Typography, Button, List, ListItem, ListItemText, TextField, Snackbar } from "@mui/material";
import Cardapio from "./Cardapio";
import Cozinha from "./Cozinha"; // Tela da cozinha
import "./App.css";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#021E40" },
    secondary: { main: "#003366" },
    background: { default: "#121212", paper: "#1e1e1e" },
    text: { primary: "#FFFFFF", secondary: "#FFFFFF" },
  },
  typography: { fontFamily: "Poppins, sans-serif" },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: "12px" } } },
    MuiPaper: { styleOverrides: { root: { borderRadius: "16px" } } },
  },
});

function App() {
  const [carrinho, setCarrinho] = useState([]);
  const [pedidoConfirmado, setPedidoConfirmado] = useState(false);
  const [ingrediente, setIngrediente] = useState("");
  const [socket, setSocket] = useState(null);

  // Conectar ao WebSocket ao iniciar
  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:3001"); // Substitua pela URL correta
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  // Adicionar item ao carrinho
  const adicionarAoCarrinho = (item) => {
    setCarrinho((prevCarrinho) => [...prevCarrinho, { ...item, ingrediente }]);
    setIngrediente(""); // Limpar campo de ingrediente
  };

  // Remover item do carrinho
  const removerDoCarrinho = (index) => {
    setCarrinho((prevCarrinho) => prevCarrinho.filter((_, i) => i !== index));
  };

  // Finalizar pedido e enviar para a cozinha
  const finalizarPedido = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const pedido = {
        
        itens: carrinho.map((item) => ({
          nome: item.nome,
          preco: item.preco,
          ingrediente: item.ingrediente || "Nenhuma alteração",
        })),
      };
      socket.send(JSON.stringify(pedido));
      console.log("Pedido enviado:", pedido);
    }
    setCarrinho([]);
    setPedidoConfirmado(true);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Container maxWidth="sm" className="container-background">
                <Paper elevation={3} sx={{ padding: 3 }}>
                  <Typography variant="h4" gutterBottom>
                    Cardápio Online
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Escolha seu pedido e envie diretamente para a cozinha!
                  </Typography>
                  <Cardapio adicionarAoCarrinho={adicionarAoCarrinho} />
                  <Typography variant="h5" sx={{ mt: 3 }}>
                    Carrinho de Compras
                  </Typography>
                  {carrinho.length === 0 ? (
                    <Typography variant="body1" color="text.secondary">
                      Seu carrinho está vazio.
                    </Typography>
                  ) : (
                    <List>
                      {carrinho.map((item, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={`${item.nome} - ${item.preco}`}
                            secondary={item.ingrediente ? `Ingrediente: ${item.ingrediente}` : "Sem alterações"}
                          />
                          <Button variant="outlined" color="secondary" onClick={() => removerDoCarrinho(index)}>
                            Remover
                          </Button>
                        </ListItem>
                      ))}
                    </List>
                  )}
                  <TextField
                    label="Quer remover algum ingrediente?"
                    variant="outlined"
                    fullWidth
                    value={ingrediente}
                    onChange={(e) => setIngrediente(e.target.value)}
                    sx={{ mt: 2 }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
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
        message="✅ Pedido enviado para a cozinha!"
      />
    </ThemeProvider>
  );
}

export default App;
