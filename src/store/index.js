import { configureStore } from "@reduxjs/toolkit"
import { combineReducers } from "redux"
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist"
import storage from "redux-persist/lib/storage" // localStorage

// placeholder do slice de proposta (vamos criar)
import proposalReducer from "./slices/proposalSlice"

const rootReducer = combineReducers({
  proposal: proposalReducer,
})

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["proposal"],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)
