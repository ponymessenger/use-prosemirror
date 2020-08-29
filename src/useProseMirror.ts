import {useState, SetStateAction, Dispatch} from 'react';
import {EditorState, Selection, Plugin} from 'prosemirror-state';
import {Schema, Node, Mark} from 'prosemirror-model';

interface Config<S extends Schema = any> {
    schema?: S | null;
    doc?: Node<S> | null;
    selection?: Selection<S> | null;
    storedMarks?: Mark[] | null;
    plugins?: Array<Plugin<any, S>> | null;
}

export default function useProseMirror<S extends Schema = any>(
    config: Config<S>,
): [EditorState, Dispatch<SetStateAction<EditorState>>] {
    return useState(() => EditorState.create(config));
}
