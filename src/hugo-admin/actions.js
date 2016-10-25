export const addCanon = ({ category, id, nomination }) => ({
  module: 'hugo-admin',
  type: 'ADD_CANON',
  category,
  id,
  nomination
});

export const addClassification = ({ canon_id, category, nomination }) => ({
  module: 'hugo-admin',
  type: 'ADD_CLASSIFICATION',
  canon_id,
  category,
  nomination
});

export const initHugoAdmin = () => ({
  module: 'hugo-admin',
  type: 'INIT_HUGO_ADMIN'
});

export const setCanon = (category, canon) => ({
  module: 'hugo-admin',
  type: 'SET_CANON',
  canon,
  category
});

export const setCategory = (category) => ({
  module: 'hugo-admin',
  type: 'SET_CANON',
  category
});

export const setNominations = (category, nominations) => ({
  module: 'hugo-admin',
  type: 'SET_NOMINATIONS',
  category,
  nominations
});
