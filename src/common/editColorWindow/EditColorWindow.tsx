import { useState, useRef, useContext } from "react";
import { Editor } from "../../model/types";
import { SlideElement } from "../../model/types"
import Button from "../Button/Button";
import Knob from "../Knob/Knob";
import Palette from "./Palette/Palette";
import styles from "./EditColorWindow.module.css";
import { connect } from "react-redux";
import { AppDispatch } from "../../model/store";
import { changeFillColor, changeStrokeColor, changeStrokeWidth, changeTextProps, setBackground } from "../../model/actionCreators";
import { useClickOutside } from '../../core/hooks/useClickOutside'
import { getBase64FromPicture } from "../../model/export";
import { LocaleContext } from "../../App";

interface EditColorWindowProps {
    isDarkTheme: boolean,
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
    isDarkTheme,
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
    const localeContext = useContext(LocaleContext);

    const [selectedColor, setSelectedColor] = useState('')
    let removeButtonText: string = '';
    switch(drawMode) {
        case 'backgroundSlide':
            removeButtonText = localeContext.locale.localization.mainToolButtons.deleteBackground;
            break
        case 'fillFigure':
            removeButtonText = localeContext.locale.localization.mainToolButtons.figureSettings.deletePouring;
            break
        case 'strokeFigure':
            removeButtonText = localeContext.locale.localization.mainToolButtons.figureSettings.deleteOutline;
            break
    }
    return (
        <div className={styles.edit_color_window}>
            <div
                className={[styles.frame, isDarkTheme ? styles.frame_light_theme : styles.frame_dark_theme].join(' ')}
                ref = {frameRef}
            >
                {
                    drawMode === 'backgroundSlide' &&
                        <div className={styles.head_text}>
                            {localeContext.locale.localization.mainToolButtons.background}
                        </div>
                }
                {
                    drawMode === 'fillFigure' &&
                        <div className={styles.head_text}>
                            {localeContext.locale.localization.mainToolButtons.figureSettings.pouringTitle}
                        </div>
                }
                {
                    drawMode === 'strokeFigure' &&
                        <div className={styles.head_text}>
                            {localeContext.locale.localization.mainToolButtons.figureSettings.outlineTitle}
                        </div>
                }
                {
                    drawMode === 'textColor' &&
                        <div className={styles.head_text}>
                            {localeContext.locale.localization.mainToolButtons.text}
                        </div>
                }
                <hr className={styles.hr} />
                <div className={styles.palette_block}>
                    <div className={styles.secondary_text}>
                        {localeContext.locale.localization.general.color}
                    </div>
                    <div>
                        <Palette
                            sendValue = {(colorValue: string) => setSelectedColor(colorValue)}
                        />
                    </div>
                </div>
                {
                    drawMode === 'backgroundSlide' &&
                        <div className={styles.change_value}>
                            <div className={styles.secondary_text}>
                                {localeContext.locale.localization.general.image}
                            </div>

                            <Button
                                viewStyle="outline"
                                text={localeContext.locale.localization.mainToolButtons.chooseBackgroundImage}
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
                                {localeContext.locale.localization.mainToolButtons.figureSettings.outlineThickness}
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
                        text={localeContext.locale.localization.general.accept}
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

function mapStateToProps(state: Editor) {
    return {
        isDarkTheme: state.isDarkTheme,
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(EditColorWindow)