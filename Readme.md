# 프론트엔드 개발 과제

해당 [요구사항](https://github.com/MementoAI/Front_Assignment/blob/main/Readme.md)에 따라 기능을 구현합니다.

### 🔗 [배포 링크](https://front-assignment-pink.vercel.app/)

## 🤔해결 방식

<details>
<summary >⚙️1. 개발 환경 세팅</summary>

### 🔗[PR](https://github.com/oridori2705/Front_Assignment/pull/1)

### 🛠️ 개발 환경 세팅(Webpack, Typescript, Emotion, Eslint, Prettier)

- 아래 플러그인을 활용했습니다.
  ```
   @babel/core
   @babel/preset-env
   @babel/preset-react
   @babel/preset-typescript
   @types/node
   @types/react
   @types/react-dom
   @types/webpack
   @types/webpack-dev-server
   @typescript-eslint/eslint-plugin
   @typescript-eslint/parser
   babel-loader
   core-js
   css-loader
   eslint
   eslint-config-prettier
   eslint-plugin-prettier
   eslint-plugin-react
   html-webpack-plugin
   prettier
   ts-node
   typescript
   webpack
   webpack-cli
   webpack-dev-server
   webpack-merge
  ```
- 개발 설정과 빌드 설정을 분리해서 설정하기 위해 `webpack-merge`를 사용했습니다.
- 개발환경에서는 `ts-loader`를 사용하고 배포환경에서는 `babel-loader`를 사용했습니다.

  ```
   'babel-loader + @babel/preset-typescript'의 경우 타입 검사를 하지 않는다.
    따라서 트랜스 파일링 속도가 빠르다.

    반면, 'ts-loader'의 경우 타입 검사를 하기 때문에 트랜스 파일링 속도가 상대적으로 느리다.
  ```

- `TypeScript`를 사용했습니다.
  - 조건이 많아 대응되는 상태를 관리해야 될 것을 판단했고, 타입 검사를 엄격하게해 코드의 안정성을 높이고 잠재적인 오류를 줄이기 위해 타입스크립트를 도입했습니다.
- `Emotion`의 `styled-component`를 사용했습니다.
  - `react-beautiful-dnd`의 `getItemStyle` 방식을 보면서 `styled-component`를 사용하기에 적합하다고 판단했습니다.

</details>

<details>
<summary>✨2. 단일 드래그 + 제약조건이 있는 DnD 구현</summary>

### 🔗[PR](https://github.com/oridori2705/Front_Assignment/pull/2)

### 🛠️ 제약조건이 있는 DnD 구현

1. 컬럼의 갯수를 1개에서 4개로 지정했습니다.
2. 컬럼의 데이터 구조는 아래와 같습니다.
   ```
    {
        "column-1": {
            "id": "column-1",
            "title": "Column 1",
            "items": [
                {
                    "id": 1,
                    "content": "item-1",
                    "isSelected": false
                },
                {
                    "id": 2,
                    "content": "item-2",
                    "isSelected": false
                },
            ]
        },
        "column-2": {
            "id": "column-2",
            "title": "Column 2",
            "items": []
        },
        "column-3": {
            "id": "column-3",
            "title": "Column 3",
            "items": []
        },
        "column-4": {
            "id": "column-4",
            "title": "Column 4",
            "items": []
        }
    }
   ```
3. 같은 컬럼 내의 이동과 다른 컬럼으로 이동 후 업데이트는 조건을 통해 분리했습니다.

- `같은 컬럼 내의 이동으로 인한 데이터 변경`과 `다른 컬럼으로 이동 후 데이터 변경`이 다르다는 점을 이용했습니다.

4.  isInValidDrop 상태로 `짝수 나열 조건`과 `1->3 컬럼 이동 금지 조건`을 관리했습니다.

- 짝수 나열 조건 검증은 도착 지점의 데이터에 드래그한 요소를 미리 넣고, 짝수가 연속적으로 나열되는지 확인했습니다.
- 이 검증을 onDragUpdate에 수행시켜 드래그 중에 사용자가 `드래그가 불가`하다는 것을 인지하도록 했습니다.

5.  해당 개발 과정에서는 `단일 드래그일 때`의 기준으로 기능과 조건 검증을 구현했습니다.

</details>

<details>
<summary>✨3. 멀티 드래그 기능 구현</summary>

### 🔗[PR](https://github.com/oridori2705/Front_Assignment/pull/3)

### 🛠️ 멀티 드래그 기능 구현

1. 멀티 드래그 기능을 구현했습니다.
   - `ctrl + 클릭`을 동시에 할 경우 멀티 드래그가 가능하도록 구현했습니다.
   - 컬럼 외부 클릭 또는 다른 컬럼 클릭시 멀티 셀렉트된 데이터가 초기화 되도록 했습니다.
2. 멀티 드래그시` 짝수 나열 조건`에 대한 validation 수정했습니다.
   - `onDragUpdate`과정에서 멀티 셀렉된 데이터가 짝수 연속 나열이 되는지 검증됩니다.
   - `onDragUpdate`과정에서 시작 지점과 도착 지점이 `드래그 이후`에 짝수가 나열되는지 미리 검증됩니다.
3. `selectedItems` 상태를 추가로 관리했습니다. 이때 `Set` 자료구조를 활용했습니다.
   - `멀티 셀렉된 데이터`가 삭제되고 추가되는 작업이 필요하다는 것을 인지함
   - 멀티 셀렉된 데이터에서 특정 데이터가 포함되는지 확인하는 작업이 필요하다는 것을 인지함
   - 위 두 조건을 좋은 성능으로 해결할 수 있는 `Set` 자료구조를 선택함
4. `isMultiDragging` 상태를 추가로 관리했습니다.
   - 멀티 셀렉트 된 이후 한 요소가 드래그 될 때 `셀렉된 요소도 드래그 중`이라는 표시를 하기 위한 상태입니다.
5. `previousColumnId` 상태를 추가로 관리했습니다.
   - 멀티 셀렉트는 한 컬럼 내에서만 가능하도록 하기 위해 상태입니다.
6. `errorMessage` 상태를 추가로 관리했습니다.
   - 에러 메세지를 관리하기 위한 상태입니다.

</details>

<details>
<summary>✨4. UX를 위한 기능 추가</summary>

- 🔗[PR](https://github.com/oridori2705/Front_Assignment/pull/4)

### 🛠️ 데이터 영속성 구현 및 되돌리기/초기화 기능 추가

> UX를 고려하여 사용자 친화적인 인터페이스를 설계하세요. (이를 위해 과제 목표 외 UI 및 기능을 추가하여도 좋습니다.)

위 요구사항을 충족하기 위해 아래와 같은 시도를 했습니다.

1. 컬럼 값이 업데이트 될 때마다 로컬스토리지에 저장하고, 불러올 수 있도록 했습니다.
2. `되돌리기` 기능을 추가했습니다.
   - `되돌리기`는 `최대 5개`의 기록만 저장하도록 했습니다.
   - 초기화 시에도 이전 기록이 저장됩니다.
   - 5개가 넘어갈경우 가장 오래된 기록은 제거됩니다.
3. `초기화` 기능을 추가했습니다.
   - 초기화` 버튼 클릭 시 컬럼 값이 앱 시작 시점으로 되돌아갑니다.
4. DnD를 관리하는 상태와 드래그 이벤트를 각각 커스텀 훅으로 나누었습니다.
   - App,tsx에서 과도하게 긴 코드로 인해 가독성이 저하됨을 느꼈고, 관심사를 분리해 가독성을 높였습니다.
5. 앱의 드래그 조건과 안내를 나타내는 `설명란`을 추가했습니다.

</details>

## ⚡ 기술 스택

<table>
    <thead>
        <tr>
            <th>분류</th>
            <th>기술 스택</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                  <p>프론트엔드</p>
            </td>
            <td>
                 <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=ffffff"/>
                 <img src="https://img.shields.io/badge/Emotion-DB7093?style=flat-square&logo=styled-components&logoColor=white"/>
                  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=black"/> 
                <img src="https://img.shields.io/badge/webpack-8DD6F9?style=flat-square&logo=webpack&logoColor=white"/> 
            </td>
        </tr>
          <tr>
            <td>
                <p>배포</p>
            </td>
            <td>
                <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=Vercel&logoColor=white"/>
            </td>
        </tr>
    </tbody>
</table>

```
  "dependencies": {
    "@emotion/react": "^11.13.0",
    "@emotion/styled": "^11.13.0",
    "@types/react-beautiful-dnd": "^13.1.8",
    "clean-webpack-plugin": "^4.0.0",
    "eslint-plugin-import": "^2.29.1",
    "react": "18.2.0",
    "react-beautiful-dnd": "13.1.1",
    "react-dom": "18.2.0"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@babel/preset-env": "^7.25.3",
    "@babel/preset-react": "^7.24.7",
    "@babel/preset-typescript": "^7.24.7",
    "@emotion/babel-plugin": "^11.12.0",
    "@types/node": "^22.0.0",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@types/webpack": "^5.28.5",
    "@types/webpack-bundle-analyzer": "^4.7.0",
    "@types/webpack-dev-server": "^4.7.2",
    "@typescript-eslint/eslint-plugin": "^7.18.0",
    "@typescript-eslint/parser": "^7.18.0",
    "babel-loader": "^9.1.3",
    "core-js": "^3.37.1",
    "css-loader": "^7.1.2",
    "eslint": "^8.57.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.2.1",
    "eslint-plugin-react": "^7.35.0",
    "eslint-plugin-react-hooks": "^4.6.2",
    "eslint-plugin-simple-import-sort": "^12.1.1",
    "html-webpack-plugin": "^5.6.0",
    "prettier": "^3.3.3",
    "ts-loader": "^9.5.1",
    "ts-node": "^10.9.2",
    "typescript": "^5.5.4",
    "webpack": "^5.93.0",
    "webpack-bundle-analyzer": "^4.10.2",
    "webpack-cli": "^5.1.4",
    "webpack-dev-server": "^5.0.4",
    "webpack-merge": "^6.0.1"
  },

```

## 🤔 고민되거나 어려웠던 점

<details> 
<summary>⚡DnD를 구현하면서 겪었던 많은 예외 상황들을 처리하면서 해결 과정을 정리해봤습니다.</summary>
  
### 1. 짝수가 나열되면 안된다.
```
문제 상황: 멀티 드래그시에도 짝수만을 선택했을 때 경고가 나와야 함

해결 방안: 셀렉된 아이템들을 드래그 할 때 검사해서 경고 메세지를 상태에 저장 후 출력합니다.

```

```

문제 상황: 드래그 중일 때 어떤 컬럼에 도착한다면 미리 짝수 나열이 되는지 확인하고 경고가 나와야 함

해결 방안: onDragUpdate 때에 시작 지점 컬럼과 도착 지점 컬럼에 짝수가 나열되는지 확인합니다.

- 같은 컬럼 내의 이동일 때는 셀렉된 아이템이 이동된 이후의 수열을 미리 검사해서 결과를 알려줍니다.
- 다른 컬럼 내의 이동일 때는 셀렉된 아이템이 도착지점에 이동된 이후를 미리 검사합니다.

즉 onDragUpdate때 미리 짝수가 나열되는지 예상해서 검사 후 화면에 경고를 나타내고,
onDragEnd에는 짝수 검사가 통과된 것이므로 업데이트만 수행합니다.

```

```

문제 상황 : 시작 지점에서 드래그할 요소가 빠질 때 해당 컬럼에 짝수 나열이 생긴다면 경고가 나와야 함

해결 방안 : onDragUpdate때 같은 컬럼 내의 이동과 다른 컬럼 내의 이동을 분리해서 짝수가 나열 되는지 미리 확인합니다. 위와 동일

```

### 2. 멀티 드래그
```

문제 상황: 멀티 드래그할 때 어떤 기준으로 정렬이 되어야할까? -> 정렬의 기준이 잡혀야 짝수 나열 조건에서 유효한지 예상이 가능함

해결 방안: 멀티 드래그할 때는 무조건 정렬이 되도록 강제했다.

```

```

문제 상황: 멀티 드래그 선택 후에 ctrl 버튼을 떼고 클릭 시에는 멀티 드래그를 취소하고 단일 드래그를 해야하는가?

해결 방안: 아래 코드에서 보이는 것처럼 만약 onDragStart 시 자신이 셀렉한 아이템이 아니라면 셀렉아이템을 초기화 한다.

if (!selectedItems.has(Number(draggableId))) setSelectedItems(new Set())

```

```

문제 상황: 1 컬럼요소와 2컬럼요소를 멀티 셀렉 후 4번으로 드래그가 가능한 것인가?

해결 방안: 한 컬럼 내에서만 멀티셀렉이 가능하도록 강제했다.

```


### 3. 복잡한 멀티 드래그와 단일 드래그 조건

1. 활용할 수 있는 값들의 한정됨

  - `destinationIndex`: 현재 드래그할 위치의 값

     -> 단일 드래그 기준이라서 만약 멀티 드래그일 때는 그저 하나의 값을 제외한 이후의 인덱스를 반환해주는 상황

     -> 예를 들어 1을 2 뒤로 드래그하면 destinationIndex는 1이지만, 1,2,3을 4 뒤로 드래그하면 destinationIndex는 3임

  - `selectedItems` : 현재 선택된 값들의 배열(각 데이터의 id값이 들어가 있음)

     -> 단일 드래그일 때와 멀티 드래그일 때를 맞추기 위해 배열로 만듦

     -> 아이디가 1,2,3,4...로 인덱스 순처럼 되어있지만 재활용가능성을 위해 인덱스 처럼 활용하지 않음

  - `finishItems` : 선택된 데이터들이 제외된 배열

     -> 위에서 말했듯이 destinationIndex는 드래그한 요소를 제외한 이후의 배열을 기준으로 도착지점 인덱스를 정함

     -> 그러므로 선택된 데이터를 제거한 이후의 배열이 필요한 것임

   - `sourceIndex` : 드래그를 시작하는 인덱스 지점

     -> 위에서 말한 단일드래그에서의 destinationIndex와 멀티드래그에서의 destinationIndex가 일관되지 않고있음

     -> 이를 위해서 조건 처리가 필요한데

     -> 1. 현재 선택된 데이터가 다수인가? 를 확인

     -> 2. 현재 드래그 시작 인덱스가 destinationIndex보다 작은가? 를 확인

     -> 3. 위 두 조건이 true이면 "아래로 드래그하는 중" 이고, "멀티 드래그" 중임을 확인

     -> 4. 위 두 조건이 false이면 "위 시나리오를 제외한 모든 상황" 임을 확인

  => 이를 통해서 멀티 드래그와 단일 드래그의 일관성을 유지

 다시 설명하면

1. `단일 드래그`이고, `아래로 드래그` 할 때는 "destinationIndex" 값이 필요

2. `단일 드래그`이고, `위로 드래그` 할 때는 " destinationIndex " 값이 필요

3. `멀티 드래그`이고, `아래로 드래그` 할 때는 "destinationIndex - (선택된 데이터 갯수 - 1)"이 필요

4. `멀티 드래그`이고, `위로 드래그` 할 때는 "destinationIndex" 값이 필요

이게 다 destinationIndex이 "드래그 하고 있는 데이터를 제외한 이후의 도착 지점 인덱스" 이기 때문임


</details>

<br/>
