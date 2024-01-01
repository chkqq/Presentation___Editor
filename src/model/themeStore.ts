// store.ts
import { createStore } from 'redux';

// Действия
export const TOGGLE_THEME = 'TOGGLE_THEME';

// Создание действий
export const toggleTheme = () => ({
  type: TOGGLE_THEME,
});

// Начальное состояние
const initialState = {
  isDarkTheme: false,
};

// Редюсер
const themeReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case TOGGLE_THEME:
      return { ...state, isDarkTheme: !state.isDarkTheme };
    default:
  }
};

// Создание хранилища
const store = createStore(themeReducer);

export default store;
