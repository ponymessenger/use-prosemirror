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
    view: EditorView | null;
}

interface PropsBase extends EditorProps {
    state: EditorState;
    style?: CSSProperties;
    className?: string;
}

// If using TypeScript, the compiler will enforce that either
// `onChange` or `dispatchTransaction` are provided, but not both:

interface PropsWithOnChange {
    onChange: (state: EditorState) => void;
    dispatchTransaction?: never;
}

interface PropsWithDispatchTransaction {
    dispatchTransaction: (transaction: Transaction) => void;
    onChange?: never;
}

type Props = PropsBase &
    (PropsWithOnChange | PropsWithDispatchTransaction);

export default forwardRef<Handle, Props>(function ProseMirror(
    props,
    ref,
): JSX.Element {
    const root = useRef<HTMLDivElement>(null!);
    const initialProps = useRef(props);
    const viewRef = useRef<EditorView<any> | null>(null);
    // If this is a non-initial render, update the editor view with
    // the React render.
    // - First update editor state using `EditorView#updateState()`.
    // - Then update other props using `EditorView#setProps()`.
    // If we update state with other props together using
    // `setProps()`, scroll-into-view will not occur due to:
    // https://github.com/ProseMirror/prosemirror-view/blob/13b046a834b489530a98dd362fa55703e52e076d/src/index.js#L183-L195
    const {state, ...restProps} = props;
    viewRef.current?.updateState(state);
    viewRef.current?.setProps(buildProps(restProps));
    useEffect(() => {
        // Bootstrap the editor on first render. Note: running
        // non-initial renders inside `useEffect` produced glitchy
        // behavior.
        const view = new EditorView(root.current, {
            state: initialProps.current.state,
            ...buildProps(initialProps.current),
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
    return (
        <div
            ref={root}
            style={props.style}
            className={props.className}
        />
    );

    function buildProps(
        props: Partial<Props>,
    ): Partial<DirectEditorProps> {
        return {
            ...props,
            dispatchTransaction: transaction => {
                // `dispatchTransaction` takes precedence.
                if (props.dispatchTransaction) {
                    props.dispatchTransaction(transaction);
                } else if (props.onChange && viewRef.current) {
                    props.onChange(
                        viewRef.current.state.apply(transaction),
                    );
                }
            },
        };
    }
});
