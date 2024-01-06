import { useState, useContext } from "react";
import { connect } from 'react-redux';
import { AppDispatch, uploadDocFunction } from '../model/store'

import Button from "../common/Button/Button"
import DropDown from "../common/DropDown/DropDown"
import Knob from "../common/Knob/Knob"
import TextField from "../common/TextField/textField"

import { getL18nObject, l18nLocale } from '../i18n/i18n';
import { LocaleContext } from "../App";
import { Editor, Slide, SlideElement } from "../model/types"

import styles from "./ToolBar.module.css"
import EditColorWindow from "./editColorWindow/EditColorWindow";
import { exportDoc, addSlide, changeTextProps, changeTitle, redo, removeSlides, saveDoc, switchPreview, toggleTheme, switchSlidePositions, undo } from "../model/actionCreators";
import ThemeButton from "../common/ThemeButton/themeButton";

type ToolBarProps = {
    slide: Slide,
    title: string,
    isDarkTheme: boolean,
    saveDoc: () => void,
    uploadDoc: () => void,
    addSlide: () => void,
    removeSlides: () => void,
    switchSlidePositions: (orderShift: number) => void,
    undo: () => void,
    redo: () => void,
    switchPreview: () => void,
    toggleTheme: () => void,
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
    isDarkTheme,
    saveDoc,
    uploadDoc,
    addSlide,
    removeSlides,
    switchSlidePositions,
    undo,
    redo,
    switchPreview,
    toggleTheme,
    exportDoc,
    changeTextFont,
    changeTextSize,
    changeTitle,
    changeTextWeight,
    changeTextAlign
}: ToolBarProps) => {
    const [rename, setRename] = useState(false);
    const localeContext = useContext(LocaleContext);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [opened, setOpened] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleLanguageClick = (language: l18nLocale) => {
        localeContext.changeLocale?.(getL18nObject(language));
        setDropdownVisible(false);
    };

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
        <div className={styles.toolBar}>
            <div className={styles.top_block}>
                <div className={styles.rename_container}>
                {
                    rename ?
                        <TextField
                            onKeyUp = {(value) => {
                                if (value !== '') {
                                    changeTitle(value);
                                }
                                setRename(false)
                            }}
                            placeholder = {localeContext.locale.localization.topToolButtons.renamePlaceholder}
                         />
                        : <p className={styles.name}>{ title }</p>
                }
                </div>
                <div className={styles.top_buttons_block}>
                    <div className={styles.outline_button}>
                        <Button
                            viewStyle='outline'
                            text={localeContext.locale.localization.topToolButtons.rename}
                            onClick={() => setRename(!rename)}
                        />
                    </div>
                    <div className={styles.outline_button}>
                        <Button
                            viewStyle='outline'
                            text={localeContext.locale.localization.topToolButtons.save}
                            onClick={() => saveDoc()}
                        />
                    </div>
                    <div className={styles.outline_button}>
                        <Button
                            viewStyle='outline'
                            text={localeContext.locale.localization.topToolButtons.download}
                            onClick={() => uploadDoc()}
                        />
                    </div>
                    <div className={styles.outline_button}>
                        <button
                            className={[`${styles.language_selection} ${dropdownVisible && styles.language_selection_active}`,
                            isDarkTheme
                            ? styles.language_selection_light_theme
                            : styles.language_selection_dark_theme].join(' ')}
                            onClick={toggleDropdown}
                        >
                            {localeContext.locale.localization.topToolButtons.ChangeLanguage}
                        </button>
                        {dropdownVisible && (
                        <div className={[styles.drop_down_box, isDarkTheme ? styles.drop_down_box_light_theme : styles.drop_down_box_dark_theme].join(' ')}>
                            <button
                                className={[styles.language_buttons,
                                isDarkTheme
                                ? styles.language_buttons_light_theme
                                : styles.language_buttons_dark_theme ].join(' ')}
                                onClick={() => handleLanguageClick("ru_RU")}
                            >
                                {localeContext.locale.localization.topToolButtons.russianLanguage}
                            </button>
                            <button
                                className={[styles.language_buttons,
                                isDarkTheme
                                ? styles.language_buttons_light_theme
                                : styles.language_buttons_dark_theme ].join(' ')}
                                onClick={() => handleLanguageClick("en_EN")}
                            >
                                {localeContext.locale.localization.topToolButtons.englishLanguage}
                            </button>
                        </div>
                        )}
                    </div>
                    <div className={styles.outline_button}>
                        <ThemeButton
                        onClick={toggleTheme}
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
                            text={localeContext.locale.localization.mainToolButtons.background}
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
                            text={localeContext.locale.localization.mainToolButtons.preview}
                            onClick={() => {switchPreview()}}
                        />
                    </div>
                    <div className={styles.outline_button}>
                        <Button
                            viewStyle='outline'
                            text={localeContext.locale.localization.mainToolButtons.downloadPDF}
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
    const localeContext = useContext(LocaleContext);

    if (!textSelected && figureSelected){
        return (
            <div className={styles.optional_tools_container}>
                <div className = {styles.outline_button}>
                    <Button
                        viewStyle = 'outline'
                        text = {localeContext.locale.localization.mainToolButtons.figureSettings.pouringFigure}
                        onClick = {() => onClick('fillFigure')}
                    />
                </div>
                <div className={styles.outline_button}>
                    <Button
                        viewStyle='outline'
                        text={localeContext.locale.localization.mainToolButtons.figureSettings.figureOutline}
                        onClick = {() => onClick('strokeFigure')}
                    />
                </div>
            </div>
        )
    }
    else if (textSelected && !figureSelected && firstSelectedElement.textProps) {
        return (
            <div className={styles.optional_tools_container}>
                <p className={styles.optional_tools_text}>{localeContext.locale.localization.mainToolButtons.textSettings.font}</p>
                <select
                  className={styles.optional_tools_select}
                  onChange={(e) => changeTextFont(e.target.value)}
                  value={firstSelectedElement.textProps.font}
                >
                  <option value="Arial">Arial</option>
                  <option value="Calibri">Calibri</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Jost">Jost</option>
                  <option value="Arsenal">Arsenal</option>
                  <option value="Ledger">Ledger</option>
                  <option value="Martel">Martel</option>
                </select>
                <p className={styles.optional_tools_text}>{localeContext.locale.localization.mainToolButtons.textSettings.fontSize}</p>
                <Knob
                    value={firstSelectedElement.textProps.fontSize}
                    step = {1}
                    onClick={(value) => changeTextSize(value)}
                />
                <p className={styles.optional_tools_text}>{localeContext.locale.localization.mainToolButtons.textSettings.fontWeight}</p>
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
        title: state.presentation.title,
        isDarkTheme: state.isDarkTheme
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
        toggleTheme: () => dispatch(toggleTheme()),
        exportDoc: () => dispatch(exportDoc()),
        changeTextFont: (font: string) => dispatch(changeTextProps(font)),
        changeTextSize: (fontSize: number) => dispatch(changeTextProps(undefined, undefined, undefined, fontSize)),
        changeTextWeight: (fontWeight: number) => dispatch(changeTextProps(undefined, undefined, undefined, undefined, fontWeight)),
        changeTextAlign: (align: "left" | "center" | "right") => dispatch(changeTextProps(undefined, undefined, undefined, undefined, undefined, align)),
        changeTitle: (newTitle: string) => dispatch(changeTitle(newTitle)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolBar)