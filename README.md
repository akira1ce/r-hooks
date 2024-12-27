<div align="center">
  <p align="center">
    <img src="./logo.png" alt="Beautiful React Hooks" width="500px" />
  </p>
</div>

# r-hooks

A collection of React hooks to make your code easier.

## Installation

```bash
npm install @akira1ce/r-hooks
```

or

```bash
yarn add @akira1ce/r-hooks
```

## Available Hooks
- `useLeast`: Keeps the latest value.
- `useUpdate`: Force update.
- `use`: mock React Hooks use method.
- `useControl`: Component controlled state management.
- `useDeepEffect`: useEffect with deep comparison of dependencies, usage is the same as useEffect.
- `useTable`: Table data request.
- `useLoopFetch`: Loop fetch request.


## Usage

```javascript
import { useLeast, useUpdate, use, useControl, useDeepEffect, useTable, useLoopFetch } from 'r-hooks';

function MyComponent() {
  const least = useLeast();
  const update = useUpdate();
  const control = useControl();
  const deepEffect = useDeepEffect();
  const table = useTable();
  const loopFetch = useLoopFetch();

  // Your component logic here

  return (
    <div>
      {/* Your component JSX here */}
    </div>
  );
}
```

## License

This project is licensed under the MIT License.