<div align="center">
  <p align="center">
    <img src="./logo.png" alt="Beautiful React Hooks" width="500px" />
  </p>
</div>

# r-hooks

A collection of React hooks to make your code easier.

## 🦹‍♂️ Installation

```bash
npm install @akira1ce/r-hooks
```

or

```bash
yarn add @akira1ce/r-hooks
```

## 🎨 Hooks

* [useLeast](docs/useLeast.md)
* [useUpdate](docs/useUpdate.md)
* [use](docs/use.md)
* [useControl](docs/useControl.md)
* [useDeepEffect](docs/useDeepEffect.md)
* [useTable](docs/useTable.md)
* [useLoopFetch](docs/useLoopFetch.md)


## 🤌 Usage

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