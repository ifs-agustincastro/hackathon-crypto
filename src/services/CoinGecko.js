
import CoinGecko from "coingecko-api";
const CoinGeckoClient = new CoinGecko();



export async function getTopCoins(limit){
    const response = await CoinGeckoClient.coins.all();
    console.log(response);
    return response.data;
}