import React from 'react';
import { connect } from 'react-redux';
import { Editor } from '../../model/types';
import styles from './themeButton.module.css'

interface ThemeButtonProps {
  isDarkTheme: boolean,
  onClick?: () => void;
}

const ThemeButton: React.FC<ThemeButtonProps> = ({isDarkTheme, onClick }) => {

  const handleButtonClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
        className={[
          styles.theme_button,
          isDarkTheme
            ? styles.moon_light_theme
            : styles.sun_dark_theme
        ].join(' ')}
        onClick={handleButtonClick}
      ></button>
  );
};


function mapStateToProps(state: Editor) {
  return {
      isDarkTheme: state.isDarkTheme,
  }
}

export default connect(mapStateToProps)(ThemeButton)