import { MakeStore } from "next-redux-wrapper";
import { createStore } from "redux";
import reducer from "./reducer";

export const makeStore: MakeStore = () => createStore(reducer);
