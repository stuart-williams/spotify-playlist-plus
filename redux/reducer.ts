import { AnyAction, combineReducers } from "redux";

interface State {
  hello: string;
}

const r1 = (state: State, action: AnyAction) => {
  return {
    hello: "world 1"
  };
};

const r2 = (state: State, action: AnyAction) => {
  return {
    hello: "world 2"
  };
};

export default combineReducers({
  r1,
  r2
});
