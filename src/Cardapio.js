import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import InfoIcon from "@mui/icons-material/Info";
import SearchIcon from "@mui/icons-material/Search";

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
};

// Itens do cardápio
const cardapioItens = {
  Comidas: [
    { id: 1, nome: "Pizza de Calabresa", preco: "R$ 35,00" },
    { id: 2, nome: "Hambúrguer Artesanal", preco: "R$ 25,00" },
    { id: 3, nome: "Batata Frita", preco: "R$ 15,00" },
    { id: 4, nome: "Lasanha à Bolonhesa", preco: "R$ 40,00" },
    { id: 5, nome: "Sushi Variado", preco: "R$ 50,00" },
    { id: 6, nome: "Salada Caesar", preco: "R$ 20,00" },
  ],
  Bebidas: [
    { id: 7, nome: "Refrigerante", preco: "R$ 7,00" },
    { id: 8, nome: "Suco Natural", preco: "R$ 10,00" },
    { id: 9, nome: "Água Mineral", preco: "R$ 5,00" },
    { id: 10, nome: "Cerveja Artesanal", preco: "R$ 15,00" },
    { id: 11, nome: "Vinho Tinto", preco: "R$ 30,00" },
  ],
};

const Cardapio = ({ adicionarAoCarrinho }) => {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Comidas");
  const [detalhesAberto, setDetalhesAberto] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [termoPesquisa, setTermoPesquisa] = useState("");

  // Função para filtrar os itens com base no termo de pesquisa
  const filtrarItens = (itens) => {
    return itens.filter((item) =>
      item.nome.toLowerCase().includes(termoPesquisa.toLowerCase())
    );
  };

  const abrirDetalhes = (item) => {
    setItemSelecionado(item);
    setDetalhesAberto(true);
  };

  const fecharDetalhes = () => {
    setDetalhesAberto(false);
    setItemSelecionado(null);
  };

  return (
    <div>
      {/* Abas de navegação */}
      <Tabs
        value={categoriaSelecionada}
        onChange={(e, novaCategoria) => setCategoriaSelecionada(novaCategoria)}
        centered
        textColor="secondary"
        indicatorColor="secondary"
      >
        {Object.keys(cardapioItens).map((categoria) => (
          <Tab key={categoria} label={categoria} value={categoria} />
        ))}
      </Tabs>

      {/* Barra de pesquisa com ícone de lupa */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Pesquisar itens..."
        value={termoPesquisa}
        onChange={(e) => setTermoPesquisa(e.target.value)}
        sx={{ mt: 2, mb: 2 }}
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
        {filtrarItens(cardapioItens[categoriaSelecionada]).map((item) => (
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
                  {item.preco}
                </Typography>
              </Box>

              {/* Botões na parte inferior */}
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  paddingBottom: "8px !important",
                  zIndex: 1,
                }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<AddShoppingCartIcon />}
                  sx={{
                    mt: 1,
                    height: { xs: 40, md: 35 },
                    fontSize: { xs: "0.9rem", md: "0.8rem" },
                    padding: { xs: "8px 16px", md: "6px 12px" },
                    whiteSpace: "nowrap",
                    minWidth: { xs: "150px", md: "130px" },
                  }}
                  onClick={() => adicionarAoCarrinho(item)}
                >
                  Adicionar ao Pedido
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<InfoIcon />}
                  sx={{
                    mt: 1,
                    height: { xs: 40, md: 35 },
                    fontSize: { xs: "0.9rem", md: "0.8rem" },
                    padding: { xs: "8px 16px", md: "6px 12px" },
                    whiteSpace: "nowrap",
                    minWidth: { xs: "150px", md: "130px" },
                  }}
                  onClick={() => abrirDetalhes(item)}
                >
                  Detalhes
                </Button>
              </CardContent>
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDetalhes} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Cardapio;