import React, { useState, useRef, useEffect } from "react";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useTheme } from '@mui/material/styles';
import {
  Typography,
  Grid,
  Card,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// Importação manual das imagens
import pizza from "./png/pizza.jpeg";
import hamburguer from "./png/hamburguer.jpeg";
import fritas from "./png/fritas.jpeg";
import lasanha from "./png/lasanha.jpg";
import sushi from "./png/sushi.jpg";
import salada from "./png/salada.jpeg";
import refrigerante from "./png/refrigerante.jpg";
import suco from "./png/suco.jpg";
import agua from "./png/agua.jpg";
import cerveja from "./png/cerveja.jpg";
import vinho from "./png/vinho.png";
import bruschetta from "./png/bruschetta.jpg";
import bolinho from "./png/bolinho.jpg";
import sorvete from "./png/sorvete.jpg";
import brownie from "./png/brownie.jpg";


// Mapeamento dos itens com suas imagens correspondentes
const imagensItens = {
  "Pizza de Calabresa": pizza,
  "Hambúrguer Artesanal": hamburguer,
  "Batata Frita": fritas,
  "Lasanha à Bolonhesa": lasanha,
  "Sushi Variado": sushi,
  "Salada Caesar": salada,
  Refrigerante: refrigerante,
  "Suco Natural": suco,
  "Água Mineral": agua,
  "Cerveja Artesanal": cerveja,
  "Vinho Tinto": vinho,
  Bruschetta: bruschetta,
  "Bolinho de Bacalhau": bolinho,
  Sorvete: sorvete,
  Brownie: brownie,
};

// Descrições dos itens
const detalhesItens = {
  "Pizza de Calabresa": "Deliciosa pizza de calabresa com queijo derretido e molho especial.",
  "Hambúrguer Artesanal": "Hambúrguer artesanal feito com carne selecionada, queijo e molhos especiais.",
  "Batata Frita": "Porção de batatas fritas crocantes e bem temperadas.",
  "Lasanha à Bolonhesa": "Lasanha com molho bolonhesa, queijo derretido e massa fresca.",
  "Sushi Variado": "Sushi fresco com peixes selecionados e arroz temperado.",
  "Salada Caesar": "Salada com alface romana, croutons, queijo parmesão e molho Caesar.",
  Refrigerante: "Refrigerante gelado de diversos sabores.",
  "Suco Natural": "Suco natural feito com frutas frescas.",
  "Água Mineral": "Água mineral natural e refrescante.",
  "Cerveja Artesanal": "Cerveja artesanal com sabor único e refrescante.",
  "Vinho Tinto": "Vinho tinto seco, perfeito para acompanhar carnes e queijos.",
  Bruschetta: "Bruschetta com tomate fresco, manjericão e azeite.",
  "Bolinho de Bacalhau": "Bolinho de bacalhau crocante por fora e macio por dentro.",
  Sorvete: "Sorvete cremoso com opções de chocolate, baunilha e morango.",
  Brownie: "Brownie de chocolate com nozes e sorvete de baunilha.",
};

// Tempo de preparo dos itens (em minutos)
const tempoPreparo = {
  "Pizza de Calabresa": 25,
  "Hambúrguer Artesanal": 15,
  "Batata Frita": 10,
  "Lasanha à Bolonhesa": 30,
  "Sushi Variado": 20,
  "Salada Caesar": 5,
  Refrigerante: 1,
  "Suco Natural": 2,
  "Água Mineral": 1,
  "Cerveja Artesanal": 1,
  "Vinho Tinto": 1,
  Bruschetta: 10,
  "Bolinho de Bacalhau": 15,
  Sorvete: 5,
  Brownie: 10,
};

// Adicionais disponíveis para cada item
const adicionaisItens = {
  "Pizza de Calabresa": [
    { nome: "Queijo Extra", valor: 5.0 },
    { nome: "Calabresa Extra", valor: 7.0 },
    { nome: "Pimentão", valor: 3.0 },
  ],
  "Hambúrguer Artesanal": [
    { nome: "Alface", valor: 1.0 },
    { nome: "Tomate", valor: 1.5 },
    { nome: "Bacon", valor: 4.0 },
    { nome: "Queijo Extra", valor: 3.0 },
  ],
  "Lasanha à Bolonhesa": [
    { nome: "Queijo Extra", valor: 6.0 },
    { nome: "Molho Extra", valor: 4.0 },
  ],
  "Salada Caesar": [
    { nome: "Croutons Extra", valor: 2.0 },
    { nome: "Queijo Extra", valor: 3.0 },
  ],
};

// Itens do cardápio separados por categorias
const cardapioItens = {
  Entradas: [
    { id: 1, nome: "Bruschetta", preco: 12.0 },
    { id: 2, nome: "Bolinho de Bacalhau", preco: 18.0 },
  ],
  "Pratos Principais": [
    { id: 3, nome: "Pizza de Calabresa", preco: 35.0 },
    { id: 4, nome: "Hambúrguer Artesanal", preco: 25.0 },
    { id: 5, nome: "Lasanha à Bolonhesa", preco: 40.0 },
    { id: 6, nome: "Sushi Variado", preco: 50.0 },
    { id: 7, nome: "Salada Caesar", preco: 20.0 },
  ],
  Sobremesas: [
    { id: 8, nome: "Sorvete", preco: 10.0 },
    { id: 9, nome: "Brownie", preco: 15.0 },
  ],
  Bebidas: [
    { id: 10, nome: "Refrigerante", preco: 7.0 },
    { id: 11, nome: "Suco Natural", preco: 10.0 },
    { id: 12, nome: "Água Mineral", preco: 5.0 },
    { id: 13, nome: "Cerveja Artesanal", preco: 15.0 },
    { id: 14, nome: "Vinho Tinto", preco: 30.0 },
  ],
};

const Cardapio = ({ adicionarAoCarrinho }) => {
  const theme = useTheme();
const darkMode = theme.palette.mode === 'dark';
  const categorias = Object.keys(cardapioItens);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(categorias[0]);
  const [detalhesAberto, setDetalhesAberto] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [adicionais, setAdicionais] = useState({});
  const [precoTotal, setPrecoTotal] = useState(0);
  
  // Referências e estados para o carrossel
  const carouselRef = useRef(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Verificar se deve mostrar as setas baseado na posição de scroll
  useEffect(() => {
    if (carouselRef.current) {
      const element = carouselRef.current;
      setShowLeftArrow(element.scrollLeft > 0);
      setShowRightArrow(
        element.scrollLeft < element.scrollWidth - element.clientWidth - 10
      );
    }
  }, [scrollPosition]);

  // Função para lidar com o scroll do carrossel
  const handleCarouselScroll = () => {
    if (carouselRef.current) {
      setScrollPosition(carouselRef.current.scrollLeft);
    }
  };

  // Adicionar evento de scroll ao carrossel
  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("scroll", handleCarouselScroll);
      // Verificar inicialmente se as setas devem ser mostradas
      handleCarouselScroll();
    }
    return () => {
      if (carousel) {
        carousel.removeEventListener("scroll", handleCarouselScroll);
      }
    };
  }, []);

  // Funções para navegação do carrossel com botões
  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -150 : 150;
      carouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Funções para controle de toque
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    setTouchEnd(e.targetTouches[0].clientX);
    
    // Calcula a diferença e faz scroll em tempo real
    const diff = touchStart - e.targetTouches[0].clientX;
    if (carouselRef.current) {
      carouselRef.current.scrollLeft += diff / 5; // Dividido por 5 para suavizar o movimento
    }
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    // Se houve um swipe mais longo, podemos navegar para a próxima/anterior categoria
    if (touchStart - touchEnd > 100) {
      // Swipe para esquerda - próxima categoria
      const currentIndex = categorias.indexOf(categoriaSelecionada);
      if (currentIndex < categorias.length - 1) {
        setCategoriaSelecionada(categorias[currentIndex + 1]);
        scrollToCategory(currentIndex + 1);
      }
    } else if (touchEnd - touchStart > 100) {
      // Swipe para direita - categoria anterior
      const currentIndex = categorias.indexOf(categoriaSelecionada);
      if (currentIndex > 0) {
        setCategoriaSelecionada(categorias[currentIndex - 1]);
        scrollToCategory(currentIndex - 1);
      }
    }
  };

  // Função para rolar até uma categoria específica
  const scrollToCategory = (index) => {
    if (carouselRef.current) {
      const categoryButtons = carouselRef.current.querySelectorAll(".category-button");
      if (categoryButtons[index]) {
        const buttonLeft = categoryButtons[index].offsetLeft;
        const containerWidth = carouselRef.current.clientWidth;
        const buttonWidth = categoryButtons[index].clientWidth;
        
        // Centraliza o botão na viewport
        carouselRef.current.scrollTo({
          left: buttonLeft - containerWidth / 2 + buttonWidth / 2,
          behavior: "smooth",
        });
      }
    }
  };

  // Selecionar categoria
  const handleCategoriaClick = (categoria, index) => {
    setCategoriaSelecionada(categoria);
    scrollToCategory(index);
  };

  const abrirDetalhes = (item) => {
    setItemSelecionado(item);
    setQuantidade(1);
    setAdicionais({});
    setPrecoTotal(item.preco);
    setDetalhesAberto(true);
  };

  const fecharDetalhes = () => {
    setDetalhesAberto(false);
    setItemSelecionado(null);
  };

  // Calcular preço total do item considerando adicionais
  const calcularPrecoTotal = (item, qtd, adics) => {
    if (!item) return 0;
    
    // Preço base
    let total = item.preco * qtd;
    
    // Adicionar preço dos adicionais
    if (adicionaisItens[item.nome]) {
      Object.keys(adics).forEach((adicionalNome) => {
        const adicionalQtd = adics[adicionalNome];
        const adicionalItem = adicionaisItens[item.nome].find(
          (a) => a.nome === adicionalNome
        );
        
        if (adicionalItem && adicionalQtd > 0) {
          total += adicionalItem.valor * adicionalQtd;
        }
      });
    }
    
    return total;
  };

  // Atualizar preço total quando quantidade ou adicionais mudam
  React.useEffect(() => {
    if (itemSelecionado) {
      const novoPreco = calcularPrecoTotal(itemSelecionado, quantidade, adicionais);
      setPrecoTotal(novoPreco);
    }
  }, [quantidade, adicionais, itemSelecionado]);

  const handleAdicionarAoCarrinho = () => {
    const adicionaisFiltrados = Object.keys(adicionais)
      .filter((adicional) => adicionais[adicional] > 0)
      .map((adicional) => ({
        nome: adicional,
        quantidade: adicionais[adicional],
      }));

    const itemPersonalizado = {
      ...itemSelecionado,
      quantidade,
      adicionais: adicionaisFiltrados,
      tempoPreparo: tempoPreparo[itemSelecionado.nome],
      precoTotal: precoTotal,
    };
    
    adicionarAoCarrinho(itemPersonalizado);
    fecharDetalhes();
  };

  const atualizarAdicional = (adicional, valor) => {
    setAdicionais((prev) => ({
      ...prev,
      [adicional]: Math.max(0, (prev[adicional] || 0) + valor),
    }));
  };

  return (
    <div>
      {/* Carrossel de categorias com botões de navegação */}
      <Box sx={{ position: "relative", mb: 2 }}>
        {showLeftArrow && (
          <IconButton
            onClick={() => scrollCarousel("left")}
            sx={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              backgroundColor: "rgba(0,0,0,0.1)",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.2)" },
            }}
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
        )}
        
        <Box
          ref={carouselRef}
          sx={{
            display: "flex",
            overflowX: "scroll",
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch", // Para melhor comportamento no iOS
            msOverflowStyle: "none", // IE e Edge
            scrollbarWidth: "none", // Firefox
            "&::-webkit-scrollbar": { display: "none" }, // Chrome e Safari
            px: 5, // Espaço para os botões de navegação
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {categorias.map((categoria, index) => (
            <Button
              key={categoria}
              className="category-button"
              onClick={() => handleCategoriaClick(categoria, index)}
              variant={categoria === categoriaSelecionada ? "contained" : "outlined"}
              color="secondary"
               sx={{
              mx: 0.5,
              my: 1,
              whiteSpace: "nowrap",
              background: darkMode ? "#DCDCDC" : "#1C1C1C",
              color: darkMode ? "#1C1C1C" : "#DCDCDC", // <-- Agora está dentro do sx!
              transition: "transform 0.2s",
              transform: categoria === categoriaSelecionada ? "scale(1.05)" : "scale(1)",
              minWidth: "120px",
            }}
            >
              {categoria}
            </Button>
          ))}
        </Box>
        
        {showRightArrow && (
          <IconButton
            onClick={() => scrollCarousel("right")}
            sx={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              backgroundColor: "rgba(0,0,0,0.1)",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.2)" },
            }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Barra de pesquisa com ícone de lupa */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Pesquisar itens..."
        value={termoPesquisa}
        onChange={(e) => setTermoPesquisa(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Exibir apenas os itens da categoria selecionada e filtrados */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {cardapioItens[categoriaSelecionada]
          .filter((item) =>
            item.nome.toLowerCase().includes(termoPesquisa.toLowerCase())
          )
          .map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card
                sx={{
                  borderRadius: "16px",
                  backgroundImage: `url(${imagensItens[item.nome]})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  color: "#FFFFFF",
                  height: 180,
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  overflow: "hidden",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
                  },
                }}
                onClick={() => abrirDetalhes(item)}
              >
                {/* Overlay escuro para melhorar a legibilidade */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                  }}
                />

                {/* Nome e Preço sobre a imagem */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    padding: "8px",
                    textAlign: "center",
                    zIndex: 1,
                  }}
                >
                  <Typography variant="h6" color="white" sx={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
                    {item.nome}
                  </Typography>
                  <Typography variant="body2" color="white" sx={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
                    R$ {item.preco.toFixed(2)}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
      </Grid>

      {/* Modal de detalhes do pedido */}
      <Dialog open={detalhesAberto} onClose={fecharDetalhes}>
        <DialogTitle>{itemSelecionado?.nome}</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <img
              src={imagensItens[itemSelecionado?.nome]}
              alt={itemSelecionado?.nome}
              style={{ width: "100%", borderRadius: "8px" }}
            />
            <Typography>{detalhesItens[itemSelecionado?.nome]}</Typography>

            {/* Seção de quantidade */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton onClick={() => setQuantidade((prev) => Math.max(1, prev - 1))}>
                <RemoveIcon />
              </IconButton>
              <Typography>{quantidade}</Typography>
              <IconButton onClick={() => setQuantidade((prev) => prev + 1)}>
                <AddIcon />
              </IconButton>
            </Box>

            {/* Seção de adicionais */}
            {adicionaisItens[itemSelecionado?.nome] && (
              <Box sx={{ width: "100%" }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Adicionais:
                </Typography>
                {adicionaisItens[itemSelecionado.nome].map((adicional) => (
                  <Box
                    key={adicional.nome}
                    sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
                  >
                    <Typography>{adicional.nome} (R$ {adicional.valor.toFixed(2)})</Typography>
                    <IconButton onClick={() => atualizarAdicional(adicional.nome, -1)}>
                      <RemoveIcon />
                    </IconButton>
                    <Typography>{adicionais[adicional.nome] || 0}</Typography>
                    <IconButton onClick={() => atualizarAdicional(adicional.nome, 1)}>
                      <AddIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}

            {/* Tempo de preparo */}
            <Typography variant="body2" sx={{ mt: 2 }}>
              Tempo de preparo: {tempoPreparo[itemSelecionado?.nome]} minutos
            </Typography>
            
            {/* Mostrar preço total do item */}
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#333', borderRadius: '8px', width: '100%' }}>
            <Typography variant="h6" align="center" color="white">
            Total: R$ {precoTotal.toFixed(2)}
           </Typography>

            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDetalhes} color="red">
            Cancelar
          </Button>
          <Button
            onClick={handleAdicionarAoCarrinho}
            variant="contained"
            color="secondary"
            startIcon={<AddShoppingCartIcon />}
          >
            Adicionar ao Carrinho
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Cardapio;
