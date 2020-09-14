import {useState, SetStateAction, Dispatch} from 'react';
import {EditorState} from 'prosemirror-state';

type Config = Parameters<typeof EditorState.create>[0];

export default function useProseMirror(
    config: Config,
): [EditorState, Dispatch<SetStateAction<EditorState>>] {
    return useState(() => EditorState.create(config));
}
