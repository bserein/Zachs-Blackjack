const admin = require('firebase-admin');
const { cert } = require('firebase-admin/app');
const firestore = require('firebase-admin/firestore');
const creds = require('./credentials.json')
const { completeDealerTurn } = require('./dealer-actions');
const { getFreshDeck } = require('./deck');
const { startNewGame, getGameById } = require('./games');
const { sumCards, hitOrStay } = require('./player-actions');
const express = require('express');

const app = express();
app.use(express.json());

admin.initializeApp({ credential: cert(creds) });

app.post('/player-action', async (req, res) => {
  const id = req.body.gameId;
  console.log({ id })
  await hitOrStay(id, req.body.action);
  let game = await getGameById(id);
  if (req.body.action === 'stay') {
    await completeDealerTurn(id);
    const playerTotal = sumCards(game.playerCards);
    const dealerTotal = sumCards(game.dealerCards);
    if (playerTotal > 21 || playerTotal < dealerTotal) {
      res.send({
        message: `Dealer wins with ${dealerTotal}, you had ${playerTotal}`,
      });
    } else if (dealerTotal > 21 || dealerTotal < playerTotal) {
      res.send({
        message: `You win no money with ${playerTotal}, dealer had ${dealerTotal}`,
      });
    } else {
      res.send({
        message: `You pushed and keep your no money with ${playerTotal}, dealer had ${dealerTotal}`,
      });
    }
  } else {
    const total = sumCards(game.playerCards);
    if (total > 21) {
      // dealer wins game is over;
      res.send({
        message: `You busted with ${total} and lose, sucks to be you`,
      });
    } else {
      game.dealerCards.pop();
      delete game.deck;
      res.send({ id, ...game });
    }
  }
});

app.post('/start-game', async (req, res) => {
  const id = await startNewGame();
  const game = await getGameById(id);
  game.dealerCards.pop();
  delete game.deck;
  res.send({ id, ...game });
});

app.listen(3000, () => {
  console.log('Listening on 3000');
});

// const run = async () => {
//   const gameId = await startNewGame();
//   await hitOrStay(gameId, 'hit');
//   await completeDealerTurn(gameId);
//   const game = await getGameById(gameId);
//   console.log(game);
// };

// run().then();