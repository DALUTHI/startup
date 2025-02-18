import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Container, Paper, Typography, Button, List, ListItem, ListItemText, Snackbar, TextField } from "@mui/material";
import Cardapio from "./Cardapio";
import './App.css'; // Importe o arquivo CSS

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#021E40" },
    secondary: { main: "#003366" },
    background: { default: "#121212", paper: "#1e1e1e" },
    text: { primary: "#FFFFFF", secondary: "#FFFFFF" },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: "12px" } } },
    MuiPaper: { styleOverrides: { root: { borderRadius: "16px" } } },
  },
});

function App() {
  const [carrinho, setCarrinho] = useState([]);
  const [pedidoConfirmado, setPedidoConfirmado] = useState(false);
  const [ingrediente, setIngrediente] = useState(""); // Estado para o chat

  const adicionarAoCarrinho = (item) => {
    setCarrinho((prevCarrinho) => [...prevCarrinho, { ...item, ingrediente }]); // Adiciona ingredientes
  };

  const removerDoCarrinho = (index) => {
    setCarrinho((prevCarrinho) => prevCarrinho.filter((_, i) => i !== index));
  };

  const finalizarPedido = () => {
    setCarrinho([]); // Limpa o carrinho
    setPedidoConfirmado(true); // Exibe a mensagem de confirmação
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="sm" className="container-background">
        <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography 
            variant="h4" 
            gutterBottom 
            sx={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '35px',
              fontWeight: 'bold',
              color: '#333',
              textShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)'
            }}
          >
            Cardápio Online
          </Typography>
          <Typography 
            variant="body1" 
            paragraph
            sx={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '17px',
              color: '#555',
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.2)'
            }}
          >
            Escolha seu pedido e envie diretamente para a cozinha!
          </Typography>


          <Cardapio adicionarAoCarrinho={adicionarAoCarrinho} />

          {/* Exibir Carrinho */}
          <Typography 
            variant="h5" 
            sx={{
              mt: 3, 
              fontFamily: 'Poppins, sans-serif',
              fontSize: '22px',
              fontWeight: '600',
              color: '#222',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
            }}
          >
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
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => removerDoCarrinho(index)}
                  >
                    Remover
                  </Button>
                </ListItem>
              ))}
            </List>
          )}

          {/* Chat para remover ingredientes */}
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

      {/* Mensagem de confirmação do pedido */}
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
