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
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Divider,
  Badge,
  Avatar,
  Card,
  CardContent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Cardapio from "./Cardapio";
import Cozinha from "./Cozinha";
import "./App.css";

// Create theme with enhanced dark mode styling
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#2D3748" }, // Dark blue-gray
    secondary: { main: "#4A5568" }, // Medium blue-gray
    background: { default: "#121212", paper: "#1A202C" }, // Darker background
    text: { primary: "#F7FAFC", secondary: "#E2E8F0" }, // Lighter text
    error: { main: "#F56565" },
    success: { main: "#48BB78" },
    info: { main: "#4299E1" },
    warning: { main: "#ED8936" },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
    h3: { fontWeight: "700", letterSpacing: "-0.5px" },
    h4: { fontWeight: "700", letterSpacing: "-0.5px" },
    h5: { fontWeight: "600", letterSpacing: "-0.3px" },
    h6: { fontWeight: "600", letterSpacing: "-0.3px" },
    button: { fontWeight: "600", textTransform: "none" },
    body1: { lineHeight: 1.6 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          padding: "10px 20px",
          transition: "transform 0.2s, box-shadow 0.2s",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 10px rgba(0,0,0,0.2)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(45deg, #2D3748 30%, #4A5568 90%)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          overflow: "hidden",
          background: "linear-gradient(145deg, #1E212B 0%, #171923 100%)",
          borderRadius: "16px",
        }
      }
    },
    MuiList: {
      styleOverrides: {
        root: {
          padding: 0,
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          marginBottom: "8px",
          transition: "background-color 0.2s",
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.05)",
          },
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
          }
        }
      }
    },
  },
});

function App() {
  const [carrinho, setCarrinho] = useState([]);
  const [pedidoConfirmado, setPedidoConfirmado] = useState(false);
  const [ingrediente, setIngrediente] = useState("");
  const [socket, setSocket] = useState(null);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [observacoes, setObservacoes] = useState("");
  const [mesa, setMesa] = useState(1);

  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:3001");

    newSocket.onopen = () => console.log("Conexão WebSocket estabelecida!");
    newSocket.onerror = (error) => console.error("Erro WebSocket:", error);
    newSocket.onmessage = (event) => console.log("Recebido:", event.data);

    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  const adicionarAoCarrinho = (item) => {
    // Check if item with same ID and customization exists
    const itemIndex = carrinho.findIndex(
      (carrinhoItem) => 
        carrinhoItem.id === item.id && 
        carrinhoItem.ingrediente === (ingrediente || "") &&
        JSON.stringify(carrinhoItem.adicionais || []) === JSON.stringify(item.adicionais || [])
    );

    if (itemIndex >= 0) {
      // If exists, update quantity only
      setCarrinho(carrinho.map((carrinhoItem, index) => 
        index === itemIndex 
          ? { 
              ...carrinhoItem, 
              quantidade: carrinhoItem.quantidade + item.quantidade,
              precoTotal: (carrinhoItem.precoTotal / carrinhoItem.quantidade) * 
                         (carrinhoItem.quantidade + item.quantidade)
            }
          : carrinhoItem
      ));
    } else {
      // If new, add with current ingrediente
      const novoItem = { 
        ...item, 
        ingrediente: ingrediente || "",
        precoTotal: item.precoTotal || item.preco * item.quantidade
      };
      setCarrinho((prev) => [...prev, novoItem]);
    }
    
    setIngrediente("");
    // Automatically open cart when adding first item
    if (carrinho.length === 0) {
      setCarrinhoAberto(true);
    }
  };

  const removerDoCarrinho = (index) => {
    setCarrinho((prev) => prev.filter((_, i) => i !== index));
  };

  const alterarQuantidade = (index, delta) => {
    setCarrinho((prev) => 
      prev.map((item, i) => {
        if (i === index) {
          const novaQuantidade = Math.max(1, item.quantidade + delta);
          const precoUnitario = item.precoTotal / item.quantidade;
          return {
            ...item,
            quantidade: novaQuantidade,
            precoTotal: precoUnitario * novaQuantidade
          };
        }
        return item;
      })
    );
  };

  const finalizarPedido = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const pedido = {
        itens: carrinho.map((item) => ({
          nome: item.nome,
          preco: item.preco,
          quantidade: item.quantidade,
          ingrediente: item.ingrediente || "Nenhuma alteração",
          adicionais: item.adicionais || [],
          precoTotal: item.precoTotal
        })),
        mesa: mesa,
        observacoes: observacoes,
        valorTotal: calcularTotal(),
        timestamp: new Date().toISOString()
      };

      socket.send(JSON.stringify(pedido));
      console.log("Pedido enviado:", pedido);
    } else {
      console.error("WebSocket desconectado.");
    }

    setCarrinho([]);
    setCarrinhoAberto(false);
    setPedidoConfirmado(true);
    setObservacoes("");
  };

  // Calcular o valor total do carrinho
  const calcularTotal = () => {
    return carrinho.reduce((total, item) => {
      return total + (item.precoTotal || (item.preco * item.quantidade));
    }, 0);
  };

  const toggleCarrinho = () => {
    setCarrinhoAberto(!carrinhoAberto);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                {/* AppBar */}
                <AppBar position="fixed" sx={{ 
                  background: "linear-gradient(90deg, #1A202C 0%, #2D3748 100%)",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                }}>
                  <Toolbar>
                    <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
                      <RestaurantIcon sx={{ mr: 1 }} />
                      <Typography variant="h6" noWrap>
                        LIFEBOX MENU
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Badge badgeContent={carrinho.length} color="error">
                        <IconButton 
                          color="inherit" 
                          onClick={toggleCarrinho}
                          sx={{ 
                            backgroundColor: carrinhoAberto ? "rgba(255,255,255,0.1)" : "transparent",
                            transition: "background-color 0.2s"
                          }}
                        >
                          <ShoppingCartIcon />
                        </IconButton>
                      </Badge>
                    </Box>
                  </Toolbar>
                </AppBar>

                {/* Main Content */}
                <Box 
                  sx={{ 
                    pt: 8, 
                    pb: 2, 
                    minHeight: "100vh",
                    background: "linear-gradient(135deg, #121212 0%, #1A202C 100%)",
                  }}
                >
                  <Container maxWidth="md" sx={{ py: 2 }}>
                    <Card elevation={3} sx={{ mb: 2, position: "relative", overflow: "visible" }}>
                      <Box 
                        sx={{ 
                          position: "absolute", 
                          top: -15, 
                          left: "50%", 
                          transform: "translateX(-50%)",
                          backgroundColor: "#ED8936",
                          color: "#1A202C",
                          px: 2,
                          py: 0.5,
                          borderRadius: "8px",
                          fontWeight: "bold",
                          fontSize: "0.9rem",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                        }}
                      >
                        Mesa #{mesa}
                      </Box>
                      <CardContent sx={{ pt: 4 }}>
                        <Typography variant="h4" gutterBottom align="center" sx={{ color: "#F7FAFC" }}>
                          Cardápio Digital
                        </Typography>
                        <Typography variant="body1" paragraph align="center" sx={{ color: "#E2E8F0", mb: 3 }}>
                          Escolha seus pratos e envie seu pedido diretamente para a cozinha!
                        </Typography>
                        <Cardapio adicionarAoCarrinho={adicionarAoCarrinho} />
                      </CardContent>
                    </Card>
                  </Container>
                </Box>

                {/* Cart Drawer */}
                <Drawer
                  anchor="right"
                  open={carrinhoAberto}
                  onClose={() => setCarrinhoAberto(false)}
                  sx={{
                    '& .MuiDrawer-paper': { 
                      width: { xs: "100%", sm: "400px" }, 
                      background: "linear-gradient(135deg, #1A202C 0%, #161B25 100%)",
                      p: 2
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <IconButton onClick={() => setCarrinhoAberto(false)} sx={{ mr: 1 }}>
                      <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h5" sx={{ flexGrow: 1 }}>
                      Seu Pedido
                    </Typography>
                    <Badge badgeContent={carrinho.length} color="error">
                      <ShoppingCartIcon />
                    </Badge>
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  {carrinho.length === 0 ? (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 4 }}>
                      <Avatar sx={{ width: 80, height: 80, mb: 2, backgroundColor: "rgba(255,255,255,0.1)" }}>
                        <ShoppingCartIcon sx={{ width: 40, height: 40, color: "rgba(255,255,255,0.5)" }} />
                      </Avatar>
                      <Typography variant="h6" gutterBottom>
                        Seu carrinho está vazio
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                        Adicione itens do cardápio para começar seu pedido
                      </Typography>
                      <Button 
                        variant="outlined" 
                        onClick={() => setCarrinhoAberto(false)}
                        sx={{ mt: 2 }}
                      >
                        Explorar Cardápio
                      </Button>
                    </Box>
                  ) : (
                    <>
                      <List sx={{ mb: 2, maxHeight: "calc(100vh - 300px)", overflowY: "auto" }}>
                        {carrinho.map((item, index) => (
                          <Card key={index} sx={{ mb: 2, p: 1 }}>
                            <CardContent sx={{ p: 1 }}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {item.nome}
                                </Typography>
                                <IconButton 
                                  size="small" 
                                  color="error" 
                                  onClick={() => removerDoCarrinho(index)}
                                  sx={{ backgroundColor: "rgba(244, 67, 54, 0.1)" }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                              
                              <Box sx={{ mb: 1 }}>
                                {item.ingrediente && (
                                  <Chip 
                                    label={`Sem ${item.ingrediente}`} 
                                    size="small" 
                                    sx={{ 
                                      mr: 1, 
                                      mb: 1, 
                                      backgroundColor: "rgba(244, 67, 54, 0.2)", 
                                      color: "#fff",
                                      fontSize: "0.7rem"
                                    }} 
                                  />
                                )}
                                
                                {item.adicionais && item.adicionais.length > 0 && (
                                  <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                                    {item.adicionais.map((adicional, idx) => (
                                      <Chip 
                                        key={idx}
                                        label={`${adicional.nome} (${adicional.quantidade}x)`} 
                                        size="small" 
                                        sx={{ 
                                          mr: 1, 
                                          mb: 1, 
                                          backgroundColor: "rgba(66, 153, 225, 0.2)", 
                                          color: "#fff",
                                          fontSize: "0.7rem"
                                        }} 
                                      />
                                    ))}
                                  </Box>
                                )}
                              </Box>
                              
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  <IconButton 
                                    size="small" 
                                    onClick={() => alterarQuantidade(index, -1)}
                                    sx={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                                  >
                                    <RemoveIcon fontSize="small" />
                                  </IconButton>
                                  <Typography sx={{ mx: 1 }}>
                                    {item.quantidade}
                                  </Typography>
                                  <IconButton 
                                    size="small"
                                    onClick={() => alterarQuantidade(index, 1)}
                                    sx={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                                  >
                                    <AddIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                                <Typography variant="subtitle1" fontWeight="bold" color="info.main">
                                  R$ {(item.precoTotal || (item.preco * item.quantidade)).toFixed(2)}
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        ))}
                      </List>

                      <Box sx={{ mt: "auto" }}>
                        <TextField
                          label="Mesa"
                          type="number"
                          variant="outlined"
                          fullWidth
                          value={mesa}
                          onChange={(e) => setMesa(Math.max(1, parseInt(e.target.value) || 1))}
                          sx={{ mb: 2 }}
                          InputProps={{ 
                            inputProps: { min: 1 },
                            style: { color: "#E2E8F0" } 
                          }}
                        />
                        
                        <TextField
                          label="Observações para o pedido"
                          variant="outlined"
                          fullWidth
                          multiline
                          rows={2}
                          value={observacoes}
                          onChange={(e) => setObservacoes(e.target.value)}
                          sx={{ mb: 2 }}
                          InputProps={{ style: { color: "#E2E8F0" } }}
                        />
                        
                        <Box 
                          sx={{ 
                            p: 2, 
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            borderRadius: '10px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 2
                          }}
                        >
                          <Typography variant="h6">Total:</Typography>
                          <Typography variant="h6" color="success.main">
                            R$ {calcularTotal().toFixed(2)}
                          </Typography>
                        </Box>
                        
                        <Button 
                          variant="contained" 
                          fullWidth 
                          size="large"
                          onClick={finalizarPedido}
                          sx={{ 
                            py: 1.5,
                            background: "linear-gradient(45deg, #48BB78 30%, #38A169 90%)",
                            "&:hover": {
                              background: "linear-gradient(45deg, #38A169 30%, #2F855A 90%)",
                            }
                          }}
                        >
                          Finalizar Pedido
                        </Button>
                      </Box>
                    </>
                  )}
                </Drawer>
              </>
            }
          />
          <Route path="/cozinha" element={<Cozinha />} />
        </Routes>
      </Router>
      <Snackbar
        open={pedidoConfirmado}
        autoHideDuration={4000}
        onClose={() => setPedidoConfirmado(false)}
        message={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CheckCircleIcon sx={{ mr: 1, color: "#48BB78" }} />
            <Typography>Pedido enviado com sucesso!</Typography>
          </Box>
        }
        sx={{
          "& .MuiSnackbarContent-root": { 
            backgroundColor: "#1A202C", 
            borderLeft: "4px solid #48BB78",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
          },
        }}
      />
    </ThemeProvider>
  );
}

export default App;