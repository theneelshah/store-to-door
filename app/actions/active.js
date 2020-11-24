import { PLACE_ACTIVE, REMOVE_ACTIVE } from "./types";

export const placeActive = (food) => {
  console.log(food);
  return {
    type: PLACE_ACTIVE,
    id: food._id,
    item: food.item,
    user: food.user,
    vendor: food.vendor,
  };
};

export const removeActive = (key) => ({
  type: REMOVE_ACTIVE,
  key: key,
});
