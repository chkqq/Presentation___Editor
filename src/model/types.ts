import { Size, Position } from '../core/types/types'

type Editor = {
    presentation: Presentation;
    history: History;
    statePreview: boolean;
    buffers: Buffers;
}

type Buffers = {
    slideBuffer: Array<Slide>;
    elementBuffer: Array<SlideElement>
}

type History = {
    undoStack: Array<Presentation>;
    redoStack: Array<Presentation>
}

type Presentation = {
    title: string;
    slides: Array<Slide>;
    currentSlideIds: Array<string>
}

type Slide = {
    slideId: string;
    elements: Array<SlideElement>;
    background: string;
    selectedElementsIds: Array<string>
}

type SlideElement = {
    elementId: string;
    elementType: "text" | "figure" | "image";
    position: Position;
    angle: number; 
    isSelected?: boolean;
    size: Size; 
    image?: string;
    textProps?: TextType;
    figure?: FigureType;
}

type TextType = {
    font: string;
    textColor: string;
    textValue: string;
    fontSize: number;
    fontWeight: number;
    align: "left" | "center" | "right"
}

type FigureType = {
    form: "rectangle" | "circle" | "triangle";
    strokeWidth: number;
    strokeColor: string;
    fillColor: string
}

type ImageType = {
    src: string;
}

export type { TextType, ImageType, SlideElement, Slide, Presentation, History, Editor, FigureType};