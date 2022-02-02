const getFreshDeck = () => {
    const values = [
      'ace',
      'king',
      'queen',
      'jack',
      '10',
      '9',
      '8',
      '7',
      '6',
      '5',
      '4',
      '3',
      '2',
    ];
    const suites = ['diamond', 'spade', 'club', 'heart'];
  
    return values
      .reduce((acc, curr) => {
        for (const suite of suites) {
          acc.push({
            suite,
            value: curr,
          });
        }
        return acc;
      }, [])
      .sort(() => (Math.random() > 0.5 ? 1 : -1));
  };
  module.exports = { getFreshDeck };