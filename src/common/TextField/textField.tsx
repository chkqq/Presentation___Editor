import { connect } from 'react-redux';
import styles from './textField.module.css';
import { Editor } from '../../model/types';

interface TextFieldProps {
    isDarkTheme: boolean,
    placeholder?: string,
    value?: string,
    onKeyUp: (value: string) => void
}

const TextField = ({
    isDarkTheme,
    value,
    onKeyUp,
    placeholder = ""
}: TextFieldProps) => {
    return (
        <input
            type='text'
            value={value}
            className={[`${styles.input}`, isDarkTheme ? styles.input_light_theme : styles.input_dark_theme].join(' ')}
            placeholder={placeholder}
            onKeyUp={(e) => {
                if (e.key === 'Enter') {
                    onKeyUp(e.currentTarget.value)
                }
            }}
        ></input>
    )
}

function mapStateToProps(state: Editor) {
    return {
        isDarkTheme: state.isDarkTheme,
    }
}

export default connect(mapStateToProps)(TextField)