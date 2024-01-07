import { connect } from 'react-redux';
import { Editor } from '../../model/types';
import styles from './Button.module.css';

interface ButtonProps {
    isDarkTheme: boolean,
    viewStyle: 'default' | 'outline' | 'delete' | 'redo' | 'undo' | 'arrow_down' | 'arrow_up' | 'sign' | 'align_left' | 'align_center' | 'align_right' | 'text_color' | 'italic' | 'text_decoration' | 'underline' | 'overline' | 'through_line' | 'none',
    text?: string,
    onClick: () => void
}

const Button = ({
    isDarkTheme,
    viewStyle,
    text = '',
    onClick
}: ButtonProps) => {
    let buttonStyle = styles.button_default;
    switch(viewStyle) {
        case 'outline': {buttonStyle = styles.button_outline; break}
        case 'delete': {buttonStyle = isDarkTheme ? styles.button_delete_light_theme : styles.button_delete_dark_theme; break}
        case 'redo': {buttonStyle = isDarkTheme ? styles.button_redo_light_theme : styles.button_redo_dark_theme; break}
        case 'undo': {buttonStyle = isDarkTheme ? styles.button_undo_light_theme : styles.button_undo_dark_theme; break}
        case 'arrow_down': {buttonStyle = isDarkTheme ? styles.button_arrow_down_light_theme : styles.button_arrow_down_dark_theme; break}
        case 'arrow_up': {buttonStyle = isDarkTheme ? styles.button_arrow_up_light_theme : styles.button_arrow_up_dark_theme; break}
        case 'sign': {buttonStyle = styles.button_sign; break}
        case 'align_left': {buttonStyle = isDarkTheme ? styles.button_align_left_light_theme : styles.button_align_left_dark_theme; break}
        case 'align_center': {buttonStyle = isDarkTheme ? styles.button_align_center_light_theme : styles.button_align_center_dark_theme; break}
        case 'align_right': {buttonStyle = isDarkTheme ? styles.button_align_right_light_theme : styles.button_align_right_dark_theme; break}
        case 'text_color': {buttonStyle = isDarkTheme ? styles.button_text_color_light_theme : styles.button_text_color_dark_theme; break}
        case 'italic': {buttonStyle = isDarkTheme ? styles.button_italic_light_theme : styles.button_italic_dark_theme; break}
        case 'text_decoration': {buttonStyle = isDarkTheme ? styles.button_text_decoration_light_theme : styles.button_text_decoration_dark_theme; break}
        case 'underline': {buttonStyle = isDarkTheme ? styles.button_underline_light_theme : styles.button_underline_dark_theme; break}
        case 'overline': {buttonStyle = isDarkTheme ? styles.button_overline_light_theme : styles.button_overline_dark_theme; break}
        case 'through_line': {buttonStyle = isDarkTheme ? styles.button_through_line_light_theme : styles.button_through_line_dark_theme; break}
        case 'none': {buttonStyle = isDarkTheme ? styles.button_none_light_theme : styles.button_none_dark_theme; break}
    }
    return (
        <button
            type = "button"
            className = {[`${styles.button} ${buttonStyle}`, isDarkTheme ? styles.button_light_theme : styles.button_dark_theme].join(' ')}
            onClick={onClick}
        >
            <div className = {`${styles.text} ${viewStyle === 'sign' && styles.text_sign}`}>
                {text}
            </div>
        </button>
    )
}

function mapStateToProps(state: Editor) {
    return {
        isDarkTheme: state.isDarkTheme,
    }
}

export default connect(mapStateToProps)(Button)