import React, {
    useRef,
    useEffect,
    useImperativeHandle,
    forwardRef,
    CSSProperties,
} from 'react';
import {EditorView, DirectEditorProps} from 'prosemirror-view';
import {EditorState} from 'prosemirror-state';
import {Schema} from 'prosemirror-model';

export interface Handle {
    view: EditorView;
}

interface Props<S extends Schema = any>
    extends Partial<DirectEditorProps<S>> {
    state: EditorState<S>;
    onChange: (state: EditorState) => void;
    style?: CSSProperties;
    className?: string;
}

export default forwardRef<Handle, Props>(function ProseMirror(
    props,
    ref,
): JSX.Element {
    const {
        onChange,
        dispatchTransaction,
        style,
        className,
        ...setProps
    } = props;
    const root = useRef<HTMLDivElement>(null!);
    const initialProps = useRef(setProps);
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    const viewRef = useRef<EditorView<any>>(null!);
    viewRef.current?.setProps(setProps);
    useEffect(() => {
        const view = new EditorView(root.current, {
            ...initialProps.current,
            dispatchTransaction: transaction => {
                onChangeRef.current(view.state.apply(transaction));
            },
        });
        viewRef.current = view;
        return () => {
            view.destroy();
        };
    }, []);
    useImperativeHandle(ref, () => ({
        get view() {
            return viewRef.current;
        },
    }));
    return <div ref={root} style={style} className={className} />;
});
