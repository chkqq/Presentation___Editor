import styles from './DropDown.module.css';
import { useState, useRef } from 'react';
import { Editor } from '../../model/types';
import { useClickOutside } from '../../core/hooks/useClickOutside';
import { AppDispatch } from '../../model/store';
import { addImage, addObject, } from '../../model/actionCreators';
import { connect } from 'react-redux';
import { getBase64FromPicture } from '../../model/export';

interface DropDownProps {
    isDarkTheme: boolean,
    addObject: (element: string) => void,
    addImage: (urlImage: string) => void,
}

const DropDown = ({isDarkTheme, addObject, addImage}: DropDownProps) => {
    const [opened, setOpened] = useState(false);
    const dropDownRef = useRef<HTMLDivElement>(null)

    useClickOutside(dropDownRef, () => setOpened(false));

    return (
        <div className = {styles.container}
            ref={dropDownRef}
        >
            <div
                className = {`${styles.drop_down} ${opened && styles.drop_down_active}`}
                onClick = {() => setOpened(!opened)}
            >
                <div
                    className = {[`${styles.text_container} ${opened && styles.text_container_active}`, isDarkTheme ? styles.text_container_light_theme : styles.text_container_dark_theme].join(' ')}
                >
                    Вставка
                </div>
            </div>
            {
                opened
                    ?  <DropDownOptions
                        onClick = {() => setOpened(false)}
                        addImage={addImage}
                        addObject={addObject}
                    />
                    :  null
            }
        </div>
    )
}

interface DropDownOptionsProps {
    onClick: () => void,
    addObject: (element: string, textValue?: string) => void,
    addImage: (urlImage: string) => void,
}

const DropDownOptions = ({onClick, addObject, addImage}: DropDownOptionsProps) => {
    const [activeFigure, setActiveFigure] = useState(false);
    const [activeImage, setActiveImage] = useState(false);
    const [activeWeather, setActiveWeather] = useState(false);
    return (
        <div className={styles.options_container}>
            <div
                className = {`${styles.figure} ${activeFigure && styles.figure_active}`}
                onClick = {() => {
                    setActiveFigure(!activeFigure);
                    setActiveWeather(false)
                    setActiveImage(false);
                }}
            >
                Фигура
            </div>
            <div
                className = {`${styles.image} ${activeImage && styles.image}`}
                onClick = {() => {
                    const inputFile = document.createElement('input');
                    inputFile.type = 'file';
                    inputFile.style.display = 'none';
                    inputFile.accept = 'image/*';
                    inputFile.onchange = () => {
                        if (inputFile.files) {
                            const urlImage = URL.createObjectURL(inputFile.files[0])
                            getBase64FromPicture(urlImage, {width: 400, height: 400}).then((newUrl) => {
                                addImage(newUrl)
                            })
                        }
                    }
                    inputFile.click();
                    inputFile.remove();
                    onClick()
                }}
            >
                Изображение
            </div>
            <div
                className = {styles.text}
                onClick = {() => {
                    addObject('text')
                    setActiveImage(false);
                    setActiveFigure(false);
                    onClick();
                }}
            >
                Текст
            </div>
            <DropDownOptionsToAdd
                activeFigure = {activeFigure}
                activeImage = {activeImage}
                activeWeather = {activeWeather}
                onClick = {onClick}
                addObject={addObject}
                addImage={addImage}
            />
        </div>
    )
}

interface DropDownOptionsToAddProps {
    activeFigure: boolean,
    activeImage: boolean,
    onClick: () => void,
    addObject: (element: string, textValue?: string) => void,
    addImage: (urlImage: string) => void,
    activeWeather: boolean
}

const DropDownOptionsToAdd = ({ activeFigure, onClick, addObject, addImage }: DropDownOptionsToAddProps) => {

    return (
        <div className={styles.options_to_add_container}>
            {
            activeFigure
                ?
                    <div className = {styles.figure_types}>
                        <div
                            className={styles.rectangle}
                            onClick = {() => {
                                addObject('rectangle')
                                onClick()
                            }}>
                        </div>
                        <div
                            className={styles.triangle}
                            onClick = {() => {
                                addObject('triangle')
                                onClick()
                            }}>
                        </div>
                        <div
                            className={styles.circle}
                            onClick = {() => {
                                addObject('circle')
                                onClick()
                            }}>
                        </div>
                    </div>
                : null
        }
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
        addObject: (element: string, textValue?: string) => dispatch(addObject(element, textValue)),
        addImage: (urlImage: string) => dispatch(addImage(urlImage)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DropDown)