const INITIAL_DATA = {
  USER_DATA: {},
};

const Reducer = (state = INITIAL_DATA, action) => {
  if (action.type === 'USER_DATA') {
    return {
      ...state,
      USER_DATA: action.payload,
    };
  } else if (action.type === 'BLOODFIND_DETAILS') {
    return {
      ...state,
      findBlood: action.payload,
    };
  } else if (action.type === 'DONOR_LIST') {
    return {
      ...state,
      DONOR_LIST: action.payload,
    };
  }
  return state;
};

export default Reducer;
