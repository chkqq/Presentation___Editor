import styles from './SlideEditor.module.css';
import SlidesElement from "../common/SlidesElement/SlidesElement";
import type { Editor, Slide } from '../model/types'
import SlideView from '../common/Slide/Slide'
import { connect } from 'react-redux';
import { useRef } from 'react';

type SlideBarProps = {
    slide: Slide,
    isDarkTheme: boolean
}

function SlideEditor({
        slide,
        isDarkTheme
    }: SlideBarProps) {  
    const slideRef = useRef(null);     
    
    const slideElements = slide.elements.map((slideElement) =>
        <li             
            key = {slideElement.elementId}
            className = {styles.slide_element}
        >
            <SlidesElement
                slideId={slide.slideId}
                elementId={slideElement.elementId}
                active={slide.selectedElementsIds.includes(slideElement.elementId)}
                slideRef={slideRef}
            />
            
        </li>
    )
    return (
        <div 
            className={[styles.slide_container, isDarkTheme ? styles.slide_container_light_theme : styles.slide_container_dark_theme].join(' ')}
            ref = {slideRef}
        >
            <SlideView
                slideElements = {slideElements}
                background = {slide.background} 
            />
        </div>
    )
}

function mapStateToProps(state: Editor) {
    const indexSlide: number = state.presentation.slides.findIndex(slide => slide.slideId === state.presentation.currentSlideIds[0]);
    return {
        slide: state.presentation.slides[indexSlide],
        isDarkTheme: state.isDarkTheme
    }
}

export default connect(mapStateToProps)(SlideEditor)