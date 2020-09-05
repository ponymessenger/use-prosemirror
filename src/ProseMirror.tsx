import React, {
    useRef,
    useEffect,
    useImperativeHandle,
    forwardRef,
    CSSProperties,
} from 'react';
import {
    EditorView,
    EditorProps,
    DirectEditorProps,
} from 'prosemirror-view';
import {EditorState, Transaction} from 'prosemirror-state';

export interface Handle {
    view: EditorView;
}

interface PropsBase extends EditorProps {
    state: EditorState;
    style?: CSSProperties;
    className?: string;
}

// If using TypeScript, the compiler will enforce that either
// `onChange` or `dispatchTransaction` are provided, but not both:

interface PropsWithOnChange extends PropsBase {
    onChange: (state: EditorState) => void;
    dispatchTransaction?: never;
}

interface PropsWithDispatchTransaction extends PropsBase {
    dispatchTransaction: (transaction: Transaction) => void;
    onChange?: never;
}

type Props = PropsWithOnChange | PropsWithDispatchTransaction;

export default forwardRef<Handle, Props>(function ProseMirror(
    props,
    ref,
): JSX.Element {
    const root = useRef<HTMLDivElement>(null!);
    const initialProps = useRef(props);
    const buildPropsRef = useRef(buildProps);
    buildPropsRef.current = buildProps;
    const viewRef = useRef<EditorView<any>>(null!);
    // If this is a non-initial render, update the editor view as part
    // of the React render. Otherwise, bootstrap and render in
    // `useEffect` below.
    viewRef.current?.update(buildProps(props));
    useEffect(() => {
        // Bootstrap the editor on first render. Note: running
        // non-initial renders inside `useEffect` produced glitchy
        // behavior.
        const view = new EditorView(
            root.current,
            buildPropsRef.current(initialProps.current),
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
    return (
        <div
            ref={root}
            style={props.style}
            className={props.className}
        />
    );

    function buildProps(props: Props): DirectEditorProps {
        return {
            ...props,
            dispatchTransaction: transaction => {
                // `dispatchTransaction` takes precedence.
                if (props.dispatchTransaction) {
                    props.dispatchTransaction(transaction);
                } else {
                    props.onChange(
                        viewRef.current.state.apply(transaction),
                    );
                }
            },
        };
    }
});
