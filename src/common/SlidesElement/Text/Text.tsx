import styles from './Text.module.css';
import type { TextType } from '../../../model/types'
import { connect } from 'react-redux';
import { Size } from '../../../core/types/types';
import { useState } from 'react';

interface TextProps {
    size: Size
    text: TextType,
    placeholder?: string,
    onKeyUp: (value: string) => void
}

const Text = ({
    text,
    size,
    onKeyUp,
    placeholder
}: TextProps) => {
    const [textValue, setTextValue] = useState(text.textValue)

    return (
        <textarea
            value = {text.textValue}
            className = {styles.text}
            onChange = {(event) => {
                    onKeyUp(event.currentTarget.value)
                    setTextValue(event.currentTarget.value)
                }}
            style = {{
                'fontFamily': text.font,
                'fontWeight': text.fontWeight,
                'fontSize': text.fontSize,
                'color': text.textColor,
                'width': size.width,
                'height': size.height,
                'textAlign': text.align,
                'fontStyle': text.fontStyle,
                'textDecoration': text.textDecoration
            }}
        >{textValue}</textarea>
    )
}

export default connect()(Text)