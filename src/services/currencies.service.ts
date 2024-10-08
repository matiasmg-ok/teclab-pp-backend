/**
* Returns USD cotization (Dólar MEP) in PESO ARGENTINO
*/
export async function getUsdCotization() {

  const cotization = await fetch("https://dolarapi.com/v1/dolares/bolsa");
  const data = await cotization.json();
  return {
    price: data.compra,
    updatedAt: data.fechaActualizacion
  };
}