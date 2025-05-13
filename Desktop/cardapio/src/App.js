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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Cardapio from "./Cardapio";
import Cozinha from "./Cozinha";
import "./App.css";
import logoImage from './png/logolifebox.png';
import storeImage from './png/lifebox.png';

function App() {
  const queryParams = new URLSearchParams(window.location.search);
  const mesa = parseInt(queryParams.get('mesa')) || 1;
  const [carrinho, setCarrinho] = useState([]);
  const [pedidoConfirmado, setPedidoConfirmado] = useState(false);
  const [ingrediente, setIngrediente] = useState("");
  const [socket, setSocket] = useState(null);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [observacoes, setObservacoes] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [enderecoAberto, setEnderecoAberto] = useState(false);
  const [horarioAberto, setHorarioAberto] = useState(false);
  const [etapaPedido, setEtapaPedido] = useState('carrinho');
  const [dadosCliente, setDadosCliente] = useState({
    nome: '',
    telefone: '',
    rua: '',
    numero: '',
    complemento: '',
    setor: ''
  });

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: darkMode ? "#121212" : "#FFFFFF" },
      secondary: { main: darkMode ? "#212121" : "#F5F5F5" },
      background: { 
        default: darkMode ? "#000000" : "#FFFFFF", 
        paper: darkMode ? "#0A0A0A" : "#FFFFFF" 
      },
      text: { 
        primary: darkMode ? "#FFFFFF" : "#000000", 
        secondary: darkMode ? "#E0E0E0" : "#424242" 
      },
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
            background: darkMode 
              ? "linear-gradient(45deg, #121212 30%, #212121 90%)"
              : "linear-gradient(45deg, #FFFFFF 30%, #F5F5F5 90%)",
            color: darkMode ? "#FFFFFF" : "#000000",
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
            background: darkMode 
              ? "linear-gradient(145deg, #0A0A0A 0%, #121212 100%)"
              : "linear-gradient(145deg, #FFFFFF 0%, #FAFAFA 100%)",
            borderRadius: "16px",
          }
        }
      },
    },
  });

  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:3001");
    newSocket.onopen = () => console.log("Conexão WebSocket estabelecida!");
    newSocket.onerror = (error) => console.error("Erro WebSocket:", error);
    newSocket.onmessage = (event) => console.log("Recebido:", event.data);
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  const adicionarAoCarrinho = (item) => {
    const itemIndex = carrinho.findIndex(
      (carrinhoItem) => 
        carrinhoItem.id === item.id && 
        carrinhoItem.ingrediente === (ingrediente || "") &&
        JSON.stringify(carrinhoItem.adicionais || []) === JSON.stringify(item.adicionais || [])
    );

    if (itemIndex >= 0) {
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
      const novoItem = { 
        ...item, 
        ingrediente: ingrediente || "",
        precoTotal: item.precoTotal || item.preco * item.quantidade
      };
      setCarrinho((prev) => [...prev, novoItem]);
    }
    
    setIngrediente("");
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

  const handleDadosClienteChange = (e) => {
    const { name, value } = e.target;
    setDadosCliente(prev => ({
      ...prev,
      [name]: value
    }));
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
        timestamp: new Date().toISOString(),
        cliente: dadosCliente
      };

      socket.send(JSON.stringify(pedido));
      setEtapaPedido('confirmacao');
      setTimeout(() => {
        setCarrinho([]);
        setCarrinhoAberto(false);
        setPedidoConfirmado(true);
        setObservacoes("");
        setEtapaPedido('carrinho');
        setDadosCliente({
          nome: '',
          telefone: '',
          rua: '',
          numero: '',
          complemento: '',
          setor: ''
        });
      }, 3000);
    } else {
      console.error("WebSocket desconectado.");
    }
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => {
      return total + (item.precoTotal || (item.preco * item.quantidade));
    }, 0);
  };

  const toggleCarrinho = () => {
    setCarrinhoAberto(!carrinhoAberto);
    if (!carrinhoAberto) {
      setEtapaPedido('carrinho');
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
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
                <AppBar position="fixed" sx={{ 
                  background: darkMode 
                    ? "linear-gradient(90deg, #000000 0%, #121212 100%)"
                    : "linear-gradient(90deg, #FFFFFF 0%, #F5F5F5 100%)",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                  top: "10px",
                  width: "94%",
                  left: "3%",
                  right: "3%",
                  borderRadius: "12px"
                }}>
                  <Toolbar>
                    <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
                      <RestaurantIcon sx={{ mr: 1 }} />
                      <Typography variant="h6" noWrap>
                        LIFEBOX MENU
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <IconButton 
                        color="inherit" 
                        onClick={toggleTheme}
                        sx={{ mr: 2 }}
                      >
                        {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                      </IconButton>
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

                <Box 
                  sx={{ 
                    pt: 8, 
                    pb: 2, 
                    minHeight: "100vh",
                    background: darkMode 
                      ? "linear-gradient(135deg, #000000 0%, #0A0A0A 100%)"
                      : "linear-gradient(135deg, #FFFFFF 0%, #F8F8F8 100%)",
                  }}
                >
                  <Container maxWidth="md" sx={{ pt: 2, pb: 0 }}>
                    <Box 
                      sx={{ 
                        position: "relative",
                        height: 180,
                        mb: 4,
                        borderRadius: "16px",
                        overflow: "hidden",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: "100%",
                          height: "100%",
                          backgroundColor: "#000000",
                          backgroundImage: `url(${storeImage})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          filter: "brightness(0.7)"
                        }}
                      />
                      
                      <Box 
                        sx={{ 
                          position: "absolute",
                          bottom: 20,
                          left: "13%",
                          transform: "translateX(-50%)",
                          width: 80,
                          height: 80,
                          borderRadius: "50%",
                          backgroundColor: darkMode ? "#0A0A0A" : "#FFFFFF",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                          border: `3px solid ${darkMode ? "#0A0A0A" : "#FFFFFF"}`,
                          overflow: "hidden"
                        }}
                      >
                        <img 
                          src={logoImage}
                          alt="Company Logo"
                          style={{ 
                            width: "100%", 
                            height: "100%", 
                            objectFit: "cover" 
                          }} 
                        />  
                      </Box>
                      
                      <Box 
                        sx={{ 
                          position: "absolute",
                          bottom: 20,
                          right: 20,
                          display: "flex",
                          gap: 1
                        }}
                      >
                        <IconButton 
                          sx={{ 
                            backgroundColor: "rgba(255,255,255,0.8)", 
                            color: "#000000",
                            "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" }
                          }}
                          onClick={() => window.open("tel:+550000000000")}
                        >
                          <PhoneIcon />
                        </IconButton>
                        <IconButton 
                          sx={{ 
                            backgroundColor: "rgba(255,255,255,0.8)", 
                            color: "#25D366",
                            "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" }
                          }}
                          onClick={() => window.open("https://wa.me/550000000000")}
                        >
                          <WhatsAppIcon />
                        </IconButton>
                        <IconButton 
                          sx={{ 
                            backgroundColor: "rgba(255,255,255,0.8)", 
                            color: "#FF4136",
                            "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" }
                          }}
                          onClick={() => setEnderecoAberto(true)}
                        >
                          <LocationOnIcon />
                        </IconButton>
                        <IconButton 
                          sx={{ 
                            backgroundColor: "rgba(255,255,255,0.8)", 
                            color: "#0074D9",
                            "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" }
                          }}
                          onClick={() => setHorarioAberto(true)}
                        >
                          <AccessTimeIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </Container>

                  <Container maxWidth="md" sx={{ py: 2 }}>
                    <Card elevation={3} sx={{ mb: 2, position: "relative", overflow: "visible" }}>
                      <Box 
                        sx={{ 
                          position: "absolute", 
                          top: -15, 
                          left: "50%", 
                          transform: "translateX(-50%)",
                          backgroundColor: "#ED8936",
                          color: "#000000",
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
                        <Typography variant="h4" gutterBottom align="center" sx={{ color: darkMode ? "#FFFFFF" : "#000000" }}>
                          Cardápio Digital
                        </Typography>
                        <Typography variant="body1" paragraph align="center" sx={{ color: darkMode ? "#E0E0E0" : "#424242", mb: 3 }}>
                          Escolha seus pratos e envie seu pedido diretamente para a cozinha!
                        </Typography>
                        <Cardapio adicionarAoCarrinho={adicionarAoCarrinho} />
                      </CardContent>
                    </Card>
                  </Container>
                </Box>

                <Drawer
                  anchor="right"
                  open={carrinhoAberto}
                  onClose={() => {
                    setCarrinhoAberto(false);
                    setEtapaPedido('carrinho');
                  }}
                  sx={{
                    '& .MuiDrawer-paper': { 
                      width: { xs: "100%", sm: "400px" }, 
                      background: darkMode 
                        ? "linear-gradient(135deg, #000000 0%, #0A0A0A 100%)"
                        : "linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)",
                      p: 2
                    },
                  }}
                >
                  {etapaPedido === 'carrinho' && (
                    <>
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
                          <Avatar sx={{ 
                            width: 80, 
                            height: 80, 
                            mb: 2, 
                            backgroundColor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" 
                          }}>
                            <ShoppingCartIcon sx={{ 
                              width: 40, 
                              height: 40, 
                              color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" 
                            }} />
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
                                          color: darkMode ? "#FFFFFF" : "#000000",
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
                                              color: darkMode ? "#FFFFFF" : "#000000",
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
                                        sx={{ backgroundColor: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}
                                      >
                                        <RemoveIcon fontSize="small" />
                                      </IconButton>
                                      <Typography sx={{ mx: 1 }}>
                                        {item.quantidade}
                                      </Typography>
                                      <IconButton 
                                        size="small"
                                        onClick={() => alterarQuantidade(index, 1)}
                                        sx={{ backgroundColor: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}
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
                              label="Observações para o pedido"
                              variant="outlined"
                              fullWidth
                              multiline
                              rows={2}
                              value={observacoes}
                              onChange={(e) => setObservacoes(e.target.value)}
                              sx={{ mb: 2 }}
                            />
                            
                            <Box 
                              sx={{ 
                                p: 2, 
                                backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
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
                              onClick={() => setEtapaPedido('dados-cliente')}
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
                    </>
                  )}

                  {etapaPedido === 'dados-cliente' && (
                    <Box sx={{ overflowY: 'auto', height: '100%' }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <IconButton onClick={() => setEtapaPedido('carrinho')} sx={{ mr: 1 }}>
                          <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h5" sx={{ flexGrow: 1 }}>
                          Seus Dados
                        </Typography>
                      </Box>
                      
                      <Divider sx={{ mb: 2 }} />
                      
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                          Informações Pessoais
                        </Typography>
                        
                        <TextField
                          label="Nome"
                          variant="outlined"
                          fullWidth
                          name="nome"
                          value={dadosCliente.nome}
                          onChange={handleDadosClienteChange}
                          sx={{ mb: 2 }}
                        />
                        
                        <TextField
  label="Telefone"
  variant="outlined"
  fullWidth
  name="telefone"
  value={dadosCliente.telefone}
  onChange={handleDadosClienteChange}
  error={dadosCliente.telefone !== "" && !/^\(\d{2}\)\s?\d{5}-\d{4}$/.test(dadosCliente.telefone)}
  helperText={
    dadosCliente.telefone !== "" && !/^\(\d{2}\)\s?\d{5}-\d{4}$/.test(dadosCliente.telefone)
      ? "Digite no formato (DD) 91234-5678"
      : ""
  }
/>

                      </Box>
                      
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                          Endereço de Entrega
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                          <TextField
                            label="Rua"
                            variant="outlined"
                            fullWidth
                            name="rua"
                            value={dadosCliente.rua}
                            onChange={handleDadosClienteChange}
                          />
                          
                          <TextField
                            label="Número"
                            variant="outlined"
                            fullWidth
                            name="numero"
                            value={dadosCliente.numero}
                            onChange={handleDadosClienteChange}
                            sx={{ maxWidth: '100px' }}
                          />
                        </Box>
                        
                        <TextField
                          label="Complemento"
                          variant="outlined"
                          fullWidth
                          name="complemento"
                          value={dadosCliente.complemento}
                          onChange={handleDadosClienteChange}
                          sx={{ mb: 2 }}
                        />
                        
                        <TextField
                          label="Setor/Bairro"
                          variant="outlined"
                          fullWidth
                          name="setor"
                          value={dadosCliente.setor}
                          onChange={handleDadosClienteChange}
                          sx={{ mb: 2 }}
                        />
                      </Box>
                      
                      <Button 
                        variant="contained" 
                        fullWidth 
                        size="large"
                        onClick={finalizarPedido}
                        disabled={
                       !dadosCliente.nome ||
                       !dadosCliente.telefone ||
                       !/^\(\d{2}\)\s?\d{5}-\d{4}$/.test(dadosCliente.telefone) ||  // <- validação de formato
                       !dadosCliente.rua ||
                       !dadosCliente.numero ||
                       !dadosCliente.setor
                        }
                        sx={{ 
                          py: 1.5,
                          background: "linear-gradient(45deg, #48BB78 30%, #38A169 90%)",
                          "&:hover": {
                            background: "linear-gradient(45deg, #38A169 30%, #2F855A 90%)",
                          }
                        }}
                      >
                        Confirmar Pedido
                      </Button>
                    </Box>
                  )}

                  {etapaPedido === 'confirmacao' && (
                    <Box sx={{ textAlign: 'center', p: 4 }}>
                      <CheckCircleIcon sx={{ fontSize: 80, color: '#48BB78', mb: 2 }} />
                      <Typography variant="h5" sx={{ mb: 2 }}>
                        Pedido Confirmado!
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 3 }}>
                        Seu pedido foi enviado para a cozinha. Obrigado!
                      </Typography>
                    </Box>
                  )}
                </Drawer>

                <Dialog
                  open={enderecoAberto}
                  onClose={() => setEnderecoAberto(false)}
                  PaperProps={{
                    sx: {
                      borderRadius: "16px",
                      p: 2,
                      background: darkMode ? "#121212" : "#FFFFFF"
                    }
                  }}
                >
                  <DialogTitle>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <LocationOnIcon sx={{ mr: 1, color: "#FF4136" }} />
                      <Typography variant="h6">Nosso Endereço</Typography>
                    </Box>
                  </DialogTitle>
                  <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      Rua Exemplo, 123 - Centro
                    </Typography>
                    <Typography variant="body1">
                      Cidade - Estado, CEP 12345-678
                    </Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button 
                      onClick={() => setEnderecoAberto(false)}
                      sx={{ 
                        background: darkMode ? "#212121" : "#F5F5F5",
                        color: darkMode ? "#FFFFFF" : "#000000"
                      }}
                    >
                      Fechar
                    </Button>
                    <Button 
                      onClick={() => window.open("https://maps.google.com/?q=Rua+Exemplo+123")}
                      sx={{ 
                        background: "linear-gradient(45deg, #FF4136 30%, #FF851B 90%)",
                        color: "#FFFFFF"
                      }}
                    >
                      Ver no Mapa
                    </Button>
                  </DialogActions>
                </Dialog>

                <Dialog
                  open={horarioAberto}
                  onClose={() => setHorarioAberto(false)}
                  PaperProps={{
                    sx: {
                      borderRadius: "16px",
                      p: 2,
                      background: darkMode ? "#121212" : "#FFFFFF"
                    }
                  }}
                >
                  <DialogTitle>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <AccessTimeIcon sx={{ mr: 1, color: "#0074D9" }} />
                      <Typography variant="h6">Horário de Funcionamento</Typography>
                    </Box>
                  </DialogTitle>
                  <DialogContent>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Segunda a Sexta:</strong> 10:00 - 22:00
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Sábados:</strong> 10:00 - 23:00
                    </Typography>
                    <Typography variant="body1">
                      <strong>Domingos e Feriados:</strong> 11:00 - 20:00
                    </Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button 
                      onClick={() => setHorarioAberto(false)}
                      sx={{ 
                        background: darkMode ? "#212121" : "#F5F5F5",
                        color: darkMode ? "#FFFFFF" : "#000000"
                      }}
                    >
                      Fechar
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            }
          />
          <Route path="/cozinha123" element={<Cozinha />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
