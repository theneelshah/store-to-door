import { PLACE_ACTIVE, REMOVE_ACTIVE } from "../actions/types";

const initialState = {
  activeList: [],
};

const activeReducer = (state = initialState, action) => {
  switch (action.type) {
    case PLACE_ACTIVE:
      return {
        ...state,
        activeList: state.activeList.concat({
          key: Math.random(),
          id: action.id,
          item: action.item,
          user: action.user,
          vendor: action.vendor,
        }),
      };

    case REMOVE_ACTIVE:
      return {
        ...state,
        activeList: state.activeList.filter((el) => el.item !== action.key),
      };

    default:
      return state;
  }
};

export default activeReducer;
