import React, { useState } from "react";
import { Tabs, Tab, Typography, Grid, Card, CardContent, Button } from "@mui/material";

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
                height: 150, // 🔥 Altura fixa para todos os cards
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end", // 🔥 Garante que o conteúdo fique na parte de baixo
              }}
            >
              <CardContent sx={{ backgroundColor: "rgba(0, 0, 0, 0)", borderRadius: "16px" }}>
                <Typography variant="h6" color="text.primary">
                  {item.nome}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.preco}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ marginTop: 1 }}
                  onClick={() => adicionarAoCarrinho(item)}
                >
                  Adicionar ao Pedido
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Cardapio;
