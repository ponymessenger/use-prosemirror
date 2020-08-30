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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    {dispatchTransaction, onChange, style, className, ...props},
    ref,
): JSX.Element {
    const root = useRef<HTMLDivElement>(null!);
    const initialProps = useRef(props);
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    const viewRef = useRef<EditorView<any>>(null!);
    viewRef.current?.update(buildProps(props));
    useEffect(() => {
        const view = new EditorView(
            root.current,
            buildProps(initialProps.current),
        );
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
    function buildProps(props: DirectEditorProps): DirectEditorProps {
        return {
            ...props,
            dispatchTransaction: transaction => {
                onChangeRef.current(
                    viewRef.current.state.apply(transaction),
                );
            },
        };
    }
});
