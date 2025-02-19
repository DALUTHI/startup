import React, { useState } from "react";
import { Tabs, Tab, Typography, Grid, Card, CardContent, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

// Importação manual das imagens
import pizza from "./png/pizza.jpeg";
import hamburguer from "./png/hamburguer.jpeg";
import fritas from "./png/fritas.jpeg";

// Mapeamento dos itens com suas imagens correspondentes
const imagensItens = {
  "Pizza de Calabresa": pizza,
  "Hambúrguer Artesanal": hamburguer,
  "Batata Frita": fritas,
};

const detalhesItens = {
  "Pizza de Calabresa": "Deliciosa pizza de calabresa com queijo derretido e molho especial.",
  "Hambúrguer Artesanal": "Hambúrguer artesanal feito com carne selecionada, queijo e molhos especiais.",
  "Batata Frita": "Porção de batatas fritas crocantes e bem temperadas.",
  "Refrigerante": "Refrigerante gelado de diversos sabores.",
  "Suco Natural": "Suco natural feito com frutas frescas.",
  "Água Mineral": "Água mineral natural e refrescante.",
};

const cardapioItens = {
  Comidas: [
    { id: 1, nome: "Pizza de Calabresa", preco: "R$ 35,00" },
    { id: 2, nome: "Hambúrguer Artesanal", preco: "R$ 25,00" },
    { id: 3, nome: "Batata Frita", preco: "R$ 15,00" },
  ],
  Bebidas: [
    { id: 4, nome: "Refrigerante", preco: "R$ 7,00" },
    { id: 5, nome: "Suco Natural", preco: "R$ 10,00" },
    { id: 6, nome: "Água Mineral", preco: "R$ 5,00" },
  ],
};

const Cardapio = ({ adicionarAoCarrinho }) => {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Comidas");
  const [detalhesAberto, setDetalhesAberto] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState(null);

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

      {/* Exibir apenas os itens da categoria selecionada */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {cardapioItens[categoriaSelecionada].map((item) => (
          <Grid item xs={12} sm={4} md={6} key={item.id}>
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
              }}
            >
              {/* Nome e Preço sobre a imagem */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  padding: "8px",
                  boxShadow: "0px 20px 17px rgba(0, 0, 0, 0.5)",
                }}
              >
                <Typography variant="h6" color="white" align="center">
                  {item.nome}
                </Typography>
                <Typography variant="body2" color="white" align="center">
                  {item.preco}
                </Typography>
              </Box>

              {/* Botões na parte inferior */}
              <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: "8px !important" }}>
                <Button variant="contained" color="secondary" sx={{ mt: 1, height: 30, fontSize: "0.8rem" }} onClick={() => adicionarAoCarrinho(item)}>
                  Adicionar ao Pedido
                </Button>
                <Button variant="contained" color="secondary" sx={{ mt: 1, height: 20, fontSize: "0.8rem" ,  width: "70%"}} onClick={() => abrirDetalhes(item)}>
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
          <Typography>{detalhesItens[itemSelecionado?.nome]}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDetalhes} color="primary">Fechar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Cardapio;