
import Sentiment from "sentiment";
import axios from "axios";


const sentiment = new Sentiment();
const result = sentiment.analyze('Cats are stupid.');

const TWITTER_BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAAGvbWwEAAAAA7AC6bsjAkCZafiVzJnn6hsbtIHE%3DRzptclXUKIRWw5wu1EoIodIxq3I8Lg7HtSvwgHq5l32OZub4OZ";

const api = axios.create({
    baseURL: `https://api.twitter.com/2`,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TWITTER_BEARER_TOKEN}`
    }
});

export async function findTweets(keyword) {

    const calculateSentiment = (tweets) => {
        return tweets.reduce((acc, x) => acc + sentiment.analyze(x.text).comparative, 0);
    };

    const result = await api.get(`/tweets/search/recent?query=${keyword}&max_results=50`);
    return {
        keyword,
        tweets: result.data.data,
        overallSentiment: calculateSentiment(result.data.data)
    }

}


