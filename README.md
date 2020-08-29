# use-prosemirror

_ProseMirror + React done right_

ProseMirror is one of the best, if not the best, rich text editors
out there. It may not be written in React, but its render model is
very similar to React's. It is therefore a great fit for your
React project.

This package lets you integrate ProseMirror into your project
quickly and correctly, using modern React best practices.

## Installation

```
node install --save use-prosemirror
```

or

```
yarn add use-prosemirror
```

This package specifies React and ProseMirror as peer dependencies,
so makes sure you have them installed, too.

## Usage

This is all you need started:

```javascript
import 'prosemirror-view/style/prosemirror.css';

import React from 'react';
import {schema} from 'prosemirror-schema-basic';
import {useProseMirror, ProseMirror} from 'use-prosemirror';

return function MyEditor() {
    const [state, setState] = useProseMirror({schema});
    return <ProseMirror state={state} onChange={setState} />;
};
```

### `useProseMirror(config)`

This hook maintains editor state. It accepts one argument: the
[same object as
`EditorState.create`](https://prosemirror.net/docs/ref/#state.EditorState%5Ecreate).
It follows the same convention as React's `useState` and creates
the initial state and returns it along with an update function.

### `<ProseMirror />`

This component wraps ProseMirror's `EditorView`. It displays the
editor state provided by `useProseMirror` and dispaches state
updates using the update function. It accepts the following props:

-   `state` — the `EditorState` created by `useProseMirror`.
-   `onChange` — the update function returned by `useProseMirror`.
-   `props` — (optional) any [`DirectEditorProps`](https://prosemirror.net/docs/ref/#view.DirectEditorProps)
    you want set on the `EditorView`, except [`dispatchTransaction`](https://prosemirror.net/docs/ref/#view.DirectEditorProps.dispatchTransaction).
-   `style` — (optional) a React style object to be passed the `div` containing ProseMirror.
-   `className` — (optional) a string any classes you want to be passed to the `div` containing ProseMirror.

It also accepts any
[`DirectEditorProp`](https://prosemirror.net/docs/ref/#view.DirectEditorProps)
except
[`dispatchTransaction`](https://prosemirror.net/docs/ref/#view.DirectEditorProps.dispatchTransaction). So, for example, you can
write:

```javascript
<ProseMirror
    state={props.state}
    onChange={props.onChange}
    transformPastedHTML={string => {
        console.log('transformPastedHTML', string);
        return string;
    }}
/>
```

If you pass a `ref`, `<ProseMirror />` exposes a `view` getter to retrieve the underlying [`EditorView`](https://prosemirror.net/docs/ref/#view.EditorView) instance:

```javascript
const [state, setState] = useProseMirror({schema});
const viewRef = useRef();

return (
    <ProseMirror
        ref={viewRef}
        state={state}
        onChange={state => {
            setState(state);
            console.log(viewRef.current.view.hasFocus());
        }}
    />
);
```

## More Info

React and ProseMirror follow the same data flow model. Even though
ProseMirror is not written in React, it fits nicely into a React
project.

From the [ProseMirror documentation](https://prosemirror.net/docs/guide/#view):

> So the editor view displays a given editor state, and when
> something happens, it creates a transaction and broadcasts this.
> This transaction is then, typically, used to create a new state,
> which is given to the view using its updateState method.
>
> <img src="./prosemirror-data-flow.png">
>
> This creates a straightforward, cyclic data flow, as opposed to
> the classic approach (in the JavaScript world) of a host of
> imperative event handlers, which tends to create a much more
> complex web of data flows.

Sound familiar? It continues:

> It is possible to ‘intercept’ transactions as they are dispatched
> with the dispatchTransaction prop, in order to wire this cyclic
> data flow into a larger cycle—if your whole app is using a data
> flow model like this, as with Redux and similar architectures, you
> can integrate ProseMirror's transactions in your main
> action-dispatching cycle, and keep ProseMirror's state in your
> application ‘store’.

Which is exactly what [this module does](src/ProseMirror.tsx).
