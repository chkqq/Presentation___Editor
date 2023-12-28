import { connect } from 'react-redux';
import styles from './Button.module.css';

interface ButtonProps {
    viewStyle: 'default' | 'outline' | 'delete' | 'redo' | 'undo' | 'arrow_down' | 'arrow_up' | 'sign' | 'align_left' | 'align_center' | 'align_right' | 'text_color',
    text?: string,
    onClick: () => void
}

const Button = ({
    viewStyle,
    text = '',
    onClick
}: ButtonProps) => {
    let buttonStyle = styles.button_default;
    switch(viewStyle) {
        case 'outline': {buttonStyle = styles.button_outline; break}
        case 'delete': {buttonStyle = styles.button_delete; break}
        case 'redo': {buttonStyle = styles.button_redo; break}
        case 'undo': {buttonStyle = styles.button_undo; break}
        case 'arrow_down': {buttonStyle = styles.button_arrow_down; break}
        case 'arrow_up': {buttonStyle = styles.button_arrow_up; break}
        case 'sign': {buttonStyle = styles.button_sign; break}
        case 'align_left': {buttonStyle = styles.button_align_left; break}
        case 'align_center': {buttonStyle = styles.button_align_center; break}
        case 'align_right': {buttonStyle = styles.button_align_right; break}
        case 'text_color': {buttonStyle = styles.button_text_color; break}
    }
    return (
        <button
            type = "button"
            className = {`${styles.button} ${buttonStyle}`}
            onClick={onClick}
        >
            <div className = {`${styles.text} ${viewStyle === 'sign' && styles.text_sign}`}>
                {text}
            </div>
        </button>
    )
}

export default connect()(Button)