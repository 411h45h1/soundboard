export default (state, { type, payload }) => {
  switch (type) {
    case "UPDATE_SOUNDBOARD":
      return {
        ...state,
        soundBoard: payload,
      };

    default:
      return state;
  }
};
