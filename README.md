# use-prosemirror

_ProseMirror + React done right_

- [Installation](#installation)
- [Usage](#usage)
  - [`useProseMirror(config)`](#useprosemirrorconfig)
  - [`<ProseMirror />`](#prosemirror-)
- [More Info](#more-info)

[ProseMirror](https://prosemirror.net/) is one of the best rich
text editors out there. Although it is not written in React, its
render model is very similar to React's. It is therefore a great
fit for your React project.

This package lets you bootstrap a minimal, unopinionated React
integration quickly, using modern React best practices. Unlike
other integrations, it separates state management and presentation
so you can keep your state as high in your render tree as
necessary.

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

This is all you need to get started:

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
editor state provided by `useProseMirror` and dispatches state
updates using the update function. It accepts the following props:

-   `state` — the `EditorState` created by `useProseMirror`.
-   `onChange` — a function that accepts the next state. This can be
    the update function returned by `useProseMirror`, or some function
    that accepts the next state and eventually calls the update
    function. Provide this if you do not provide
    [`dispatchTransaction`](https://prosemirror.net/docs/ref/#view.DirectEditorProps.dispatchTransaction).
-   `style` — (optional) a React style object to pass to the `div` containing ProseMirror.
-   `className` — (optional) a string of classes you want to pass to the `div` containing ProseMirror.

It also accepts any
[`EditorProps`](https://prosemirror.net/docs/ref/#view.EditorProps).
So you can, for example, set
[`transformPastedHTML`](https://prosemirror.net/docs/ref/#view.EditorProps.transformPastedHTML)
directly on the component:

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

If you pass
[`dispatchTransaction`](https://prosemirror.net/docs/ref/#view.DirectEditorProps.dispatchTransaction)
to `<ProseMirror />`, you are responsible for applying dispatched
transactions to the existing state and calling the update function
returned by `useProseMirror()`. `dispatchTransaction` takes
precedence over `onChange`, which will not be called if
`dispatchTransaction` is provided.

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
