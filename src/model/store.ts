import { createStore } from 'redux';
import { Editor } from "./types"
import { addActionToHistoryReducer, editorReducer } from './editor'
import { presentationReducer } from './presentation';
import { slideReducer } from './slide'
import { deepClone } from '../core/functions/deepClone';
import { uploadDoc, redo, undo, deleteSelected, switchLayer, copy, paste } from './actionCreators';

let initialState: Editor = {
    presentation: {
        title: "Ваша презентация",
        slides: [
            {
                slideId: "0",
                elements: [],
                background: "#FFFFFF",
                selectedElementsIds: []
            }
        ],
        currentSlideIds: ['0']
    },
    history: {
        undoStack: [],
        redoStack: []
    },
    buffers: {
        slideBuffer: [],
        elementBuffer: []
    },
    statePreview: false,
    isDarkTheme: false
};

export type ActionType = {
    type: string,
    newTitle?: string,
    slideId?: string,
    orderShift?: number,
    background?: string,
    element?: string,
    elementId?: string,
    addObjectArgs?: {
        element: string,
        textValue?: string
    }
    changeAngleArgs?: {
        angleShift: number
    },
    changePositionCoordinates?: {
        xShift: number,
        yShift: number
    },
    ChangeSizeArgs?: {
        newWidth: number,
        newHeight: number,
        xShift: number,
        yShift: number
    },
    ChangeTextArgs?: {
        font?: string
        textColor?: string,
        textValue?: string,
        fontSize?: number,
        fontWeight?: number,
        align?: "left" | "center" | "right",
        fontStyle?: "normal" | "italic",
        textDecoration?: "underline" | "none" | "line-through" | "overline"
    },
    urlImage?: string,
    newWidth?: number,
    newColor?: string,
    newEditor?: Editor
}

function uploadDocFunction() {
    const inputFile = document.createElement('input')
    inputFile.type = 'file';
    inputFile.style.display = 'none';
    inputFile.accept = 'application/json';
    inputFile.onchange = () => {
        if (inputFile.files) {
            const fileEditor = inputFile.files[0];
            const reader = new FileReader();
            reader.readAsText(fileEditor);
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    const newEditor = deepClone(JSON.parse(reader.result)) as Editor;
                    store.dispatch(uploadDoc(newEditor));
                }
            };
        }
    }
    inputFile.click();
    inputFile.remove();
}

function addHotKeys() {
    window.addEventListener('keydown', function(event) {
        if (event.code === 'KeyZ' && (event.ctrlKey || event.metaKey)) {
            store.dispatch(undo())
        }
        if (event.code === 'KeyY' && (event.ctrlKey || event.metaKey)) {
            store.dispatch(redo())
        }
        if (event.code === 'KeyY' && (event.ctrlKey || event.metaKey)) {
            store.dispatch(redo())
        }
        if (event.code === 'ArrowUp' && (event.ctrlKey || event.metaKey)) {
            store.dispatch(switchLayer(1))
        }
        if (event.code === 'ArrowDown' && (event.ctrlKey || event.metaKey)) {
            store.dispatch(switchLayer(-1))
        }
        if (event.code === 'KeyC' && (event.ctrlKey || event.metaKey)) {
            store.dispatch(copy())
        }
        if (event.code === 'KeyV' && (event.ctrlKey || event.metaKey)) {
            store.dispatch(paste())
        }
        if (event.code === 'Delete') {
            store.dispatch(deleteSelected())
        }
    });
}


function mainReducer(state: Editor = initialState, action: ActionType): Editor {
    const addInHistory: boolean = (action.type !== 'SAVE_DOCUMENT')
                                && (action.type !== 'EXPORT_DOCUMENT')
                                && (action.type !== 'SWITCH_PREVIEW')
                                && (action.type !== 'TOGGLE_THEME')
                                && (action.type !== 'UPLOAD_DOCUMENT')
                                && (action.type !== 'SWITCH_PREVIEW')
                                && (action.type !== 'UNDO')
                                && (action.type !== 'REDO');
    const indexCurrentSlide: number = state.presentation.slides.findIndex(slide => slide.slideId === state.presentation.currentSlideIds[0]);
    const newState: Editor = editorReducer(state, action);
    if (addInHistory) {newState.history = addActionToHistoryReducer(state)}
    newState.presentation.slides.splice(indexCurrentSlide, 1, slideReducer(newState.presentation.slides[indexCurrentSlide], action))
    newState.presentation = presentationReducer(newState.presentation, action);
    return newState
}


let store = createStore(mainReducer, initialState)

export type AppDispatch = typeof store.dispatch

export { store, uploadDocFunction, addHotKeys }