import { useState } from "react";
import { connect } from 'react-redux';
import { AppDispatch, uploadDocFunction } from '../model/store'

import Button from "../common/Button/Button"
import DropDown from "../common/DropDown/DropDown"
import Knob from "../common/Knob/Knob"
import TextField from "../common/TextField/textField" 

import { Editor, Slide, SlideElement } from "../model/types"

import styles from "./ToolBar.module.css"
import EditColorWindow from "./editColorWindow/EditColorWindow";
import { exportDoc, addSlide, changeTextProps, changeTitle, redo, removeSlides, saveDoc, switchPreview, switchSlidePositions, undo } from "../model/actionCreators";

type ToolBarProps = {
    slide: Slide,
    title: string,
    saveDoc: () => void,
    uploadDoc: () => void,
    addSlide: () => void,
    removeSlides: () => void,
    switchSlidePositions: (orderShift: number) => void,
    undo: () => void,
    redo: () => void,
    switchPreview: () => void,
    exportDoc: () => void,
    changeTextFont: (font: string) => void,
    changeTextSize: (fontSize: number) => void,
    changeTextWeight: (fontWeight: number) => void,
    changeTitle: (newTitle: string) => void,
    changeTextAlign: (align: "left" | "center" | "right") => void
}

const ToolBar = ({
    slide,
    title,
    saveDoc,
    uploadDoc,
    addSlide,
    removeSlides,
    switchSlidePositions,
    undo,
    redo,
    switchPreview,
    exportDoc,
    changeTextFont,
    changeTextSize,
    changeTitle,
    changeTextWeight,
    changeTextAlign
}: ToolBarProps) => {
    const [rename, setRename] = useState(false);

    let textSelected = true;
    let figureSelected = true;
    slide.selectedElementsIds.forEach(id => 
        {
            if(slide.elements.find(element => element.elementId === id)?.elementType === 'figure')
            {
                textSelected = false;
            }
            else if (slide.elements.find(element => element.elementId === id)?.elementType === 'text')
            {
                figureSelected = false;
            }
        }   
    )
    const [drawBlock, setDrawBlock] = useState('absent')
    const firstSelectedElement: SlideElement | undefined = slide.elements.find(element => element.elementId === slide.selectedElementsIds[0]);
    

    return (
        <div className={styles.toolbar}>
            <div className={styles.top_block}>
                <div className={styles.rename_container}>
                {
                    rename ?
                        <TextField
                            size="big"
                            onKeyUp = {(value) => {
                                if (value !== '') {
                                    changeTitle(value);
                                }
                                setRename(false)
                            }}
                            placeholder = 'Введите название...'
                         />
                        : <p className={styles.name}>{ title }</p>
                }
                </div>
                <div className={styles.top_buttons_block}>
                    <div className={styles.outline_button}>
                        <Button
                            viewStyle='outline'
                            text='Переименовать'
                            onClick={() => setRename(!rename)}
                        />
                    </div>
                    <div className={styles.outline_button}>
                        <Button
                            viewStyle='outline'
                            text='Сохранить'
                            onClick={() => saveDoc()}
                        />
                    </div>
                    <div className={styles.outline_button}>
                        <Button
                            viewStyle='outline'
                            text='Загрузить'
                            onClick={() => uploadDoc()}
                        />
                    </div>
                </div>
            </div>
            <div className={styles.bottom_buttons_block}>
                <div className={styles.slidebar_buttons_block}>
                    <div className={styles.icon_button}>
                        <Button
                            viewStyle='sign'
                            text='+'
                            onClick={() => addSlide()}
                        />
                    </div>
                    <div className={styles.icon_button}>
                        <Button
                            viewStyle='delete'
                            onClick={() => removeSlides()}
                        />
                    </div>
                    <div className={styles.icon_button}>
                        <Button
                            viewStyle='arrow_down'
                            onClick={() => switchSlidePositions(1)}
                        />
                    </div>
                    <div className={styles.icon_button}>
                        <Button
                            viewStyle='arrow_up'
                            onClick={() => switchSlidePositions(-1)}
                        />
                    </div>
                    <div className={styles.icon_button}>
                        <Button
                            viewStyle='undo'
                            onClick={() => undo()}
                        />
                    </div>
                    <div className={styles.icon_button}>
                        <Button
                            viewStyle='redo'
                            onClick={() => redo()}
                        />
                    </div>
                </div>
                <div className={styles.slide_editor_buttons_block}>
                    <div className={styles.dropdown}>
                        <DropDown />
                    </div>
                    <div className={styles.outline_button}>
                        <Button
                            viewStyle='outline'
                            text='Фон'
                            onClick={() => setDrawBlock('backgroundSlide')}
                        />
                    </div>
                    {
                        (firstSelectedElement) &&
                        <OptionalTools 
                            textSelected = {textSelected}
                            figureSelected = {figureSelected}
                            firstSelectedElement = {firstSelectedElement}
                            onClick = {(newMode) => setDrawBlock(newMode)}
                            changeTextFont={changeTextFont}
                            changeTextSize={changeTextSize}
                            changeTextWeight={changeTextWeight}
                            changeTextAlign={changeTextAlign}
                        />
                    }
                </div>
                <div className={styles.result_buttons_block}>
                    <div className={styles.outline_button}>
                        <Button
                            viewStyle='outline'
                            text='Просмотр'
                            onClick={() => {switchPreview()}}
                        />
                    </div>
                    <div className={styles.outline_button}>
                        <Button
                            viewStyle='outline'
                            text='Экспорт'
                            onClick={() => exportDoc()}
                        />
                    </div>
                </div>
            </div>
            {
                (drawBlock !== 'absent' && (firstSelectedElement || drawBlock === 'backgroundSlide')) &&
                <EditColorWindow
                    firstSelectedElement = {firstSelectedElement? firstSelectedElement: null}
                    drawMode = {drawBlock}
                    onClick={() => setDrawBlock('absent')}
                />
            }
        </div>

    )}


interface OptionalToolsProps {
    textSelected: boolean,
    figureSelected: boolean,
    firstSelectedElement: SlideElement,
    onClick: (newMode: string) => void,
    changeTextFont: (font: string) => void,
    changeTextSize: (fontSize: number) => void,
    changeTextWeight: (fontWeight: number) => void,
    changeTextAlign: (align: "left" | "center" | "right") => void
}

function OptionalTools({ 
    textSelected,
    figureSelected,
    firstSelectedElement,
    onClick,
    changeTextFont,
    changeTextSize,
    changeTextWeight,
    changeTextAlign
}: OptionalToolsProps) {
    if (!textSelected && figureSelected){
        return (
            <div className={styles.optional_tools_container}>
                <div className = {styles.outline_button}>
                    <Button
                        viewStyle = 'outline'
                        text = 'Заливка фигуры'
                        onClick = {() => onClick('fillFigure')}
                    />
                </div>
                <div className={styles.outline_button}>
                    <Button
                        viewStyle='outline'
                        text='Контур фигуры'
                        onClick = {() => onClick('strokeFigure')}
                    />
                </div>
            </div>
        )
    }
    else if (textSelected && !figureSelected && firstSelectedElement.textProps) {
        return (
            <div className={styles.optional_tools_container}>
                <p className={styles.optional_tools_text}>Шрифт</p>
                <TextField
                    size="small"
                    placeholder={firstSelectedElement.textProps.font}
                    onKeyUp={(value) => changeTextFont(value)}
                /> 
                <p className={styles.optional_tools_text}>Размер шрифта</p>
                <Knob 
                    value={firstSelectedElement.textProps.fontSize} 
                    step = {1}   
                    onClick={(value) => changeTextSize(value)}
                />
                <p className={styles.optional_tools_text}>Начертание</p>
                <Knob 
                    value={firstSelectedElement.textProps.fontWeight} 
                    step = {100}   
                    onClick={(value) => changeTextWeight(value)}
                />
                <Button 
                    viewStyle="align_left"
                    onClick={() => changeTextAlign('left')}
                />
                <Button 
                    viewStyle="align_center"
                    onClick={() => changeTextAlign('center')}
                />
                <Button 
                    viewStyle="align_right"
                    onClick={() => changeTextAlign('right')}
                />
                <Button 
                    viewStyle="text_color"
                    onClick={() => onClick('textColor')}
                />
            </div>
        )
    }
    else {
        return (
            <div className={styles.optional_tools_container}>
            </div>
        )
    }
}

function mapStateToProps(state: Editor) {
    const indexSlide: number = state.presentation.slides.findIndex(slide => slide.slideId === state.presentation.currentSlideIds[0]);
    return { 
        slide: state.presentation.slides[indexSlide],
        title: state.presentation.title
    }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
        saveDoc: () => dispatch(saveDoc()),
        uploadDoc: () => uploadDocFunction(),
        addSlide: () => dispatch(addSlide()),
        removeSlides: () => dispatch(removeSlides()),
        switchSlidePositions: (orderShift: number) => dispatch(switchSlidePositions(orderShift)),
        undo: () => dispatch(undo()),
        redo: () => dispatch(redo()),
        switchPreview: () => dispatch(switchPreview()),
        exportDoc: () => dispatch(exportDoc()),
        changeTextFont: (font: string) => dispatch(changeTextProps(font)),
        changeTextSize: (fontSize: number) => dispatch(changeTextProps(undefined, undefined, undefined, fontSize)),
        changeTextWeight: (fontWeight: number) => dispatch(changeTextProps(undefined, undefined, undefined, undefined, fontWeight)),
        changeTextAlign: (align: "left" | "center" | "right") => dispatch(changeTextProps(undefined, undefined, undefined, undefined, undefined, align)),
        changeTitle: (newTitle: string) => dispatch(changeTitle(newTitle)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolBar)