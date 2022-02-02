const { getGameById, updateGame } = require('./games');
const { sumCards } = require('./player-actions');

const completeDealerTurn = async (gameId) => {
  const game = await getGameById(gameId);
  let dealerSum = sumCards(game.dealerCards);
  while (dealerSum < 17) {
    const card = game.deck.pop();
    game.dealerCards.push(card);
    dealerSum = sumCards(game.dealerCards);
  }
  await updateGame(gameId, game);
};

module.exports = { completeDealerTurn };