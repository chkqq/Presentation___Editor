import { useState, useRef } from "react";

import { SlideElement } from "../../model/types"
import Button from "../../common/Button/Button";
import Knob from "../../common/Knob/Knob";
import Palette from "../../common/Palette/Palette";
import styles from "./EditColorWindow.module.css";
import { connect } from "react-redux";
import { AppDispatch } from "../../model/store";
import { changeFillColor, changeStrokeColor, changeStrokeWidth, changeTextProps, setBackground } from "../../model/actionCreators";
import { useClickOutside } from '../../core/hooks/useClickOutside'
import { getBase64FromPicture } from "../../model/export";

interface EditColorWindowProps {
    firstSelectedElement: SlideElement | null
    drawMode: string,
    onClick: () => void,
    changeStrokeColor: (newColor: string) => void,
    changeFillColor: (newColor: string) => void,
    changeStrokeWidth: (newWidth: number) => void,
    setBackground: (background: string) => void,
    setTextColor: (newColor: string) => void
}

function EditColorWindow({ 
    drawMode,
    firstSelectedElement,
    onClick,
    changeFillColor,
    changeStrokeColor,
    changeStrokeWidth,
    setBackground,
    setTextColor
}: EditColorWindowProps) {
    const frameRef = useRef<HTMLDivElement>(null)
    useClickOutside(frameRef, onClick)
    
    const [selectedColor, setSelectedColor] = useState('')
    let removeButtonText: string = '';
    switch(drawMode) {
        case 'backgroundSlide':
            removeButtonText = 'Удалить фон';
            break
        case 'fillFigure':
            removeButtonText = 'Удалить заливку';
            break
        case 'strokeFigure':
            removeButtonText = 'Удалить контур';
            break
    }
    return (
        <div className={styles.edit_color_window}>
            <div
                className={styles.frame}
                ref = {frameRef}
            >
                {
                    drawMode === 'backgroundSlide' &&
                        <div className={styles.head_text}>
                            Фон
                        </div>
                }
                {
                    drawMode === 'fillFigure' &&
                        <div className={styles.head_text}>
                            Заливка
                        </div>
                }
                {
                    drawMode === 'strokeFigure' &&
                        <div className={styles.head_text}>
                            Контур
                        </div>
                }
                {
                    drawMode === 'textColor' &&
                        <div className={styles.head_text}>
                            Текст
                        </div>
                }
                <hr className={styles.hr} />
                <div className={styles.palette_block}>
                    <div className={styles.secondary_text}>
                        Цвет
                    </div>
                    <div>
                        <Palette 
                            sendValue = {(colorValue) => setSelectedColor(colorValue)}
                        />
                    </div>
                </div>
                {
                    drawMode === 'backgroundSlide' &&
                        <div className={styles.change_value}>
                            <div className={styles.secondary_text}>
                                Изображение
                            </div>

                            <Button
                                viewStyle="outline"
                                text="Выбрать изображение"
                                onClick={() => {
                                    const inputFile = document.createElement('input');
                                    inputFile.type = 'file';
                                    inputFile.style.display = 'none';
                                    inputFile.accept = 'image/*';
                                    inputFile.onchange = () => {
                                        if (inputFile.files) {
                                            const urlImage = URL.createObjectURL(inputFile.files[0])
                                            getBase64FromPicture(urlImage, {width: 818, height: 582}).then((newUrl) => {
                                                setBackground(newUrl)
                                            })
                                        }
                                    }
                                    inputFile.click();
                                    inputFile.remove();
                                    onClick()
                                }}
                            />
                        </div>
                }
                {
                    (drawMode === 'strokeFigure' && firstSelectedElement) &&
                        <div className={styles.change_value}>
                            <div className={styles.secondary_text}>
                                Толщина
                            </div>
                            <Knob
                                value = {firstSelectedElement.figure !== undefined ? firstSelectedElement.figure.strokeWidth: 0}
                                step = {1}
                                onClick={(value) => changeStrokeWidth(value)}
                            />
                        </div>    
                }
                <hr className={styles.hr} />
                <div className={styles.ready_button_block}>
                    <Button
                        viewStyle="default"
                        text = {removeButtonText}
                        onClick={() => {
                            switch(drawMode) {
                                case 'backgroundSlide':
                                    setBackground('#FFF');
                                    break
                                case 'fillFigure':
                                    changeFillColor('transparent');
                                    break
                                case 'strokeFigure':
                                    changeStrokeColor('transparent');
                                    break
                                }
                            onClick()
                        }}
                    />
                    <Button
                        viewStyle="default"
                        text="Готово"
                        onClick={() => {
                            switch(drawMode) {
                                case 'backgroundSlide':
                                    setBackground(selectedColor);
                                    break
                                case 'fillFigure':
                                    changeFillColor(selectedColor);
                                    break
                                case 'strokeFigure':
                                    changeStrokeColor(selectedColor);
                                    break
                                case 'textColor': 
                                    setTextColor(selectedColor);
                                    break
                                }
                            onClick()
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
        changeStrokeColor: (newColor: string) => dispatch(changeStrokeColor(newColor)),
        changeFillColor: (newColor: string) => dispatch(changeFillColor(newColor)),
        changeStrokeWidth: (newWidth: number) => dispatch(changeStrokeWidth(newWidth)),
        setBackground: (background: string) => dispatch(setBackground(background)),
        setTextColor: (newColor: string) => dispatch(changeTextProps(undefined, newColor))
    }
}

export default connect(null, mapDispatchToProps)(EditColorWindow)