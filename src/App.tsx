import { Editor, Slide } from './model/types';
import ToolBar from './toolBar/ToolBar';
import SlideEditor from './slideEditor/slideEditor';  
import styles from './App.module.css';
import SlideView from './common/Slide/Slide';
import SlidesElement from './common/SlidesElement/SlidesElement'
import { AppDispatch } from './model/store';
import SideBar from './sideBar/sideBar'
import { switchPreview } from './model/actionCreators';
import { connect } from 'react-redux';
import { useEffect, useRef, useState } from 'react';

interface AppProps {
    statePreview: Boolean,
    isDarkTheme: Boolean,
    slides: Array<Slide>,
    slideId: String,
    switchPreview: () => void,
}

function App({
    statePreview,
    isDarkTheme,
    slides,
    slideId,
    switchPreview
}: AppProps) {
    const indexSlideRef = useRef(0)
        useEffect(() => {
            if (statePreview) {
                document.addEventListener('keydown', onKeyDown)
            }
            return () => {
                document.removeEventListener('keydown', onKeyDown);
            }
        }, [statePreview])
        const onKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Escape':
                    switchPreview();
                    break;
                case 'ArrowRight':
                    if (indexSlideRef.current !== slides.length - 1) {
                        indexSlideRef.current += 1
                        setIndexSlide(indexSlideRef.current);    
                    }
                    break;
                case 'ArrowLeft':
                    if (indexSlideRef.current !== 0) {
                        indexSlideRef.current -= 1;
                        setIndexSlide(indexSlideRef.current);
                    }
                    break;            
            }
        }   
    const slideRef = useRef(null)
    const [indexSlide, setIndexSlide] = useState(slides.findIndex(slide => slide.slideId === slideId));
    const slidesList = slides.map((slide) => (
        <div
            key = {slide.slideId}
            ref = {slideRef}
        >
            <SlideView
                slideElements = {
                    slide.elements.map((slideElement) =>
                        <li key = {slideElement.elementId}> 
                            <SlidesElement
                                slideId = {slide.slideId}
                                elementId= {slideElement.elementId}
                                active = {false}
                                slideRef={slideRef}
                            />
                        </li> 
                    )}
                background = {slide.background}   
            />
        </div>      
    ))
    return (
        <div className={[styles.app_container, isDarkTheme ? styles.app_light_theme : styles.app_dark_theme].join(' ')}>
            {
                statePreview ?
                <div  className={styles.preview_container}> 
                    <div className={styles.preview_slide}> 
                        {slidesList[indexSlide]} 
                    </div>        
                </div>
                :
                <div className={styles.app_content}>
                    <ToolBar />
                    <div className={styles.pres_view}>
                        <SideBar />
                        <SlideEditor />
                    </div>
                </div>
            }
        </div>
    )
}

function mapStateToProps(state: Editor) {
    return {
        statePreview: state.statePreview,
        isDarkTheme: state.isDarkTheme,
        slides: state.presentation.slides,
        slideId: state.presentation.currentSlideIds[0]
    }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
        switchPreview: () => dispatch(switchPreview())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)