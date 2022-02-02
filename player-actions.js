const { getGameById, updateGame } = require('./games');

const getNumericValue = (value) => {
  const tenValues = ['10', 'jack', 'queen', 'king'];
  if (value === 'ace') {
    return 11;
  } else if (tenValues.includes(value)) {
    return 10;
  } else {
    return parseInt(value);
  }
};

const sumCards = (cards) => {
  return cards.reduce((acc, prev) => {
    return acc + getNumericValue(prev.value);
  }, 0);
};

const hitOrStay = async (gameId, action) => {
  const game = await getGameById(gameId);
  if (action === 'hit') {
    const card = game.deck.pop();
    game.playerCards.push(card);
  } else {
    game.isDealerTurn = true;
  }
  await updateGame(gameId, game);
};

module.exports = { sumCards, hitOrStay };
