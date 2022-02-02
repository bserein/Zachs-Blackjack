const firestore = require('firebase-admin/firestore');
const { getFreshDeck } = require('./deck');

const getGamesCollection = () => {
  const db = firestore.getFirestore();
  return db.collection('games');
};

const updateGame = async (gameId, game) => {
  const col = getGamesCollection();
  await col.doc(gameId).update(game);

  return game;
};

const startNewGame = async () => {
  const col = getGamesCollection();
  const deck = getFreshDeck();
  // burn/remove card from deck;
  deck.pop();
  const playerCards = [deck.pop(), deck.pop()];
  const dealerCards = [deck.pop(), deck.pop()];
  const { id } = await col.add({
    playerCards,
    dealerCards,
    isDealerTurn: false,
    deck,
  });

  return id;
};

const getGameById = async (id) => {
  const col = getGamesCollection();
  const game = await col.doc(id).get();

  return { id, ...game.data() };
};

module.exports = { startNewGame, getGameById, updateGame };