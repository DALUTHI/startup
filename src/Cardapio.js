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
import frangoGrelhado from "./png/frango.jpeg";
import risotoCogumelos from "./png/risoto.png"; 
import macarraoCarbonara from "./png/carbonara.jpg"; 
import strogonoff from "./png/strogonoff.jpg";
import taco from "./png/tacos.jpg";
import feijoada from "./png/feijoada.jpg"; 
import camarao from "./png/camarao.jpg";
import fileMignon from "./png/filemignon.jpg";
import pizzaMargherita from "./png/margherita.jpg";
import caipirinha from "./png/caipirinha.jpg";
import mojito from "./png/mojito.jpg";
import chaGelado from "./png/cha.jpg";
import cafeExpresso from "./png/expresso.jpg"; 
import milkshake from "./png/milkshake.jpg";
import aguaComGas from "./png/aguacomgas.jpg";
import energetico from "./png/energetico.jpg";
import coquetel from "./png/coquetel.jpg";
import smoothie from "./png/smoothie.jpg";

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
  "Frango Grelhado": frangoGrelhado,
  "Risoto de Cogumelos": risotoCogumelos,
  "Macarrão Carbonara": macarraoCarbonara,
  "Strogonoff de Carne": strogonoff,
  "Taco Mexicano": taco,
  "Feijoada Completa": feijoada,
  "Camarão ao Alho e Óleo": camarao,
  "Filé Mignon": fileMignon,
  "Pizza Margherita": pizzaMargherita,
  Caipirinha: caipirinha,
  Mojito: mojito,
  "Chá Gelado": chaGelado,
  "Café Expresso": cafeExpresso,
  Milkshake: milkshake,
  "Água com Gás": aguaComGas,
  Energético: energetico,
  "Coquetel Sem Álcool": coquetel,
  "Smoothie de Frutas": smoothie,
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
  "Frango Grelhado": "Frango grelhado suculento, servido com legumes frescos.",
  "Risoto de Cogumelos": "Risoto cremoso com cogumelos frescos e queijo parmesão.",
  "Macarrão Carbonara": "Macarrão com molho carbonara cremoso e bacon crocante.",
  "Strogonoff de Carne": "Strogonoff de carne com arroz branco e batata palha.",
  "Taco Mexicano": "Taco recheado com carne moída, queijo, alface e molho especial.",
  "Feijoada Completa": "Feijoada completa com arroz, couve, farofa e laranja.",
  "Camarão ao Alho e Óleo": "Camarão refogado ao alho e óleo, servido com arroz.",
  "Filé Mignon": "Filé mignon grelhado, servido com batatas rústicas.",
  "Pizza Margherita": "Pizza com molho de tomate, mussarela e manjericão fresco.",
  Caipirinha: "Caipirinha tradicional com limão, açúcar e cachaça.",
  Mojito: "Mojito refrescante com limão, hortelã e rum.",
  "Chá Gelado": "Chá gelado com sabor de pêssego.",
  "Café Expresso": "Café expresso forte e encorpado.",
  Milkshake: "Milkshake cremoso de chocolate, morango ou baunilha.",
  "Água com Gás": "Água mineral com gás e limão.",
  Energético: "Energético para dar aquela disposição extra.",
  "Coquetel Sem Álcool": "Coquetel refrescante sem álcool, perfeito para todos.",
  "Smoothie de Frutas": "Smoothie cremoso feito com frutas frescas.",
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
    { id: 12, nome: "Frango Grelhado", preco: "R$ 30,00" },
    { id: 13, nome: "Risoto de Cogumelos", preco: "R$ 45,00" },
    { id: 14, nome: "Macarrão Carbonara", preco: "R$ 38,00" },
    { id: 15, nome: "Strogonoff de Carne", preco: "R$ 42,00" },
    { id: 16, nome: "Taco Mexicano", preco: "R$ 28,00" },
    { id: 17, nome: "Feijoada Completa", preco: "R$ 55,00" },
    { id: 18, nome: "Camarão ao Alho e Óleo", preco: "R$ 60,00" },
    { id: 19, nome: "Filé Mignon", preco: "R$ 70,00" },
    { id: 20, nome: "Pizza Margherita", preco: "R$ 32,00" },
  ],
  Bebidas: [
    { id: 7, nome: "Refrigerante", preco: "R$ 7,00" },
    { id: 8, nome: "Suco Natural", preco: "R$ 10,00" },
    { id: 9, nome: "Água Mineral", preco: "R$ 5,00" },
    { id: 10, nome: "Cerveja Artesanal", preco: "R$ 15,00" },
    { id: 11, nome: "Vinho Tinto", preco: "R$ 30,00" },
    { id: 21, nome: "Caipirinha", preco: "R$ 18,00" },
    { id: 22, nome: "Mojito", preco: "R$ 20,00" },
    { id: 23, nome: "Chá Gelado", preco: "R$ 12,00" },
    { id: 24, nome: "Café Expresso", preco: "R$ 8,00" },
    { id: 25, nome: "Milkshake", preco: "R$ 22,00" },
    { id: 26, nome: "Água com Gás", preco: "R$ 6,00" },
    { id: 27, nome: "Energético", preco: "R$ 14,00" },
    { id: 28, nome: "Coquetel Sem Álcool", preco: "R$ 16,00" },
    { id: 29, nome: "Smoothie de Frutas", preco: "R$ 24,00" },
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
                    height: 40,
                    fontSize: "0.9rem",
                    padding: "8px 16px",
                    whiteSpace: "nowrap",
                    minWidth: "150px",
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
                    height: 40,
                    fontSize: "0.9rem",
                    padding: "8px 16px",
                    whiteSpace: "nowrap",
                    minWidth: "150px",
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