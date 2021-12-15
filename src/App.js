import { getTopCoins } from './services/CoinGecko';
import { useEffect, useState } from 'react';
import './App.css';
import { MDBDataTableV5 } from 'mdbreact';
import { findTweets } from "./services/TwitterSentiment";
import useAsyncState from './hooks/useAsyncState';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

const tableColumns = [
  {
    label: 'Rank',
    field: 'market_cap_rank',
    width: 15,
    attributes: {
      'aria-controls': 'DataTable',
      'aria-label': 'Name',
    },
  },
  {
    label: '',
    field: 'image',
    width: 30,
    attributes: {
      'aria-controls': 'DataTable',
      'aria-label': 'Name',
    },
  },
  {
    label: 'Asset',
    field: 'asset',
    width: 50,
    attributes: {
      'aria-controls': 'DataTable',
      'aria-label': 'Name',
    },
  },
  {
    label: 'Current Price',
    field: 'current_price',
    width: 30,
    attributes: {
      'aria-controls': 'DataTable',
      'aria-label': 'Name',
    },
  },
  {
    label: '% change 24h',
    field: 'change_percentage',
    width: 30,
    attributes: {
      'aria-controls': 'DataTable',
      'aria-label': 'Name',
    },
  },
  {
    label: 'Twitter Sentiment',
    field: 'twitter_sentiment',
    width: 30,
    attributes: {
      'aria-controls': 'DataTable',
      'aria-label': 'Name',
    },
  }
];


function App() {

  const [coinList, setCoinList] = useAsyncState([]);
  const [tableData, setTableData] = useAsyncState({ columns: tableColumns, rows: [] });


  // useEffect(() => {

  //   const getCoins = async () => {
  //     const coins = await getTopCoins();
  //     await setCoinList(coins);

  //     await setTableData({
  //       columns: tableColumns,
  //       rows: coins.map(x => {
  //         const dailyChange = x.market_data.price_change_percentage_24h;
  //         return {
  //           "market_cap_rank": <span className="rank-label">{x.market_data.market_cap_rank}</span>,
  //           "image": <img src={x.image.small} alt="coin thumb" heigth="20px" width="20px" />,
  //           "asset": x.name,
  //           "current_price": x.market_data.current_price.eur,
  //           "change_percentage": <span className={dailyChange > 0 ? "green-label" : "red-label"}>{dailyChange}</span>,
  //           "twitter_sentiment": ""
  //         }
  //       })
  //     });

  //     for (const coin of coins) {
  //       const sentiment = await findTweets(coin.name);
  //       console.log(sentiment);
  //       const coinRow = tableData['rows'].find(x => x.asset === coin.name);
  //       const rowIndex = tableData['rows'].indexOf(coinRow);
  //       coinRow["twitter_sentiment"] = sentiment.overallSentiment;
  //       tableData['rows'][rowIndex] = coinRow;
  //     }
  //     await setTableData(tableData);

  //   };

  //   getCoins();
  // }, []);



  useEffect(() => {

    const getCoins = async () => {
      const coins = await getTopCoins();
      await setCoinList(coins);


      const rowsBackup = []
      for (const x of coins) {
        const dailyChange = x.market_data.price_change_percentage_24h;
        const sentiment = await findTweets(x.name);
        const row = {
          "market_cap_rank": <span className="rank-label">{x.market_data.market_cap_rank}</span>,
          "image": <img src={x.image.small} alt="coin thumb" heigth="20px" width="20px" />,
          "asset": x.name,
          "current_price": x.market_data.current_price.eur,
          "change_percentage": <span className={dailyChange > 0 ? "green-label" : "red-label"}>{dailyChange}</span>,
          "twitter_sentiment": sentiment.overallSentiment
        };
        rowsBackup.push(row);
        await setTableData({ columns: tableData.columns, rows: [...rowsBackup] })
      }



      // await setTableData({
      //   columns: tableColumns,
      //   rows: coins.map(x => {
      //     const dailyChange = x.market_data.price_change_percentage_24h;
      //     return {
      //       "market_cap_rank": <span className="rank-label">{x.market_data.market_cap_rank}</span>,
      //       "image": <img src={x.image.small} alt="coin thumb" heigth="20px" width="20px" />,
      //       "asset": x.name,
      //       "current_price": x.market_data.current_price.eur,
      //       "change_percentage": <span className={dailyChange > 0 ? "green-label" : "red-label"}>{dailyChange}</span>,
      //       "twitter_sentiment": ""
      //     }
      //   })
      // });

      // for (const coin of coins) {
      //   const sentiment = await findTweets(coin.name);
      //   console.log(sentiment);
      //   const coinRow = tableData['rows'].find(x => x.asset === coin.name);
      //   const rowIndex = tableData['rows'].indexOf(coinRow);
      //   coinRow["twitter_sentiment"] = sentiment.overallSentiment;
      //   tableData['rows'][rowIndex] = coinRow;
      // }
      // await setTableData(tableData);

    };

    getCoins();
  }, []);



  // useEffect(() => {
  //   // GET COIN SENTIMENT
  //   const fetchCoinSentiment = async () => {
  //     for (const coin of coinList[0]) {

  //       const sentiment = await findTweets(coin.name);
  //       // debugger;
  //       const coinRow = tableData['rows'].find(x => x.asset === coin.name);
  //       const rowIndex = tableData['rows'].indexOf(coinRow);
  //       coinRow["twitter_sentiment"] = sentiment.overallSentiment;
  //       tableData['rows'][rowIndex] = coinRow;
  //       setTableData(tableData);
  //       // debugger;
  //       console.log(tableData);
  //     }
  //   };
  //   fetchCoinSentiment();

  // }, [tableData]);


  return (
    <div className="App">

      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <h1>Coin tracker app</h1>
      </div>

      <MDBDataTableV5 hover entriesOptions={[5, 20, 25]} entries={20} pagesAmount={4} data={tableData} />

      <img height="250px" src="https://alternative.me/crypto/fear-and-greed-index.png" alt="Latest Crypto Fear & Greed Index" />
    </div>
  );
}

export default App;
