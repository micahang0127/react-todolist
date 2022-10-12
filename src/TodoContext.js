import React, { useReducer, createContext, useContext, useRef } from "react";

const initialTodos = [
  {
    id: 1,
    text: "프로젝트 생성하기",
    done: true,
  },
  {
    id: 2,
    text: "컴포넌트 스타일링하기",
    done: true,
  },
  {
    id: 3,
    text: "Context 만들기",
    done: false,
  },
  {
    id: 4,
    text: "기능 구현하기",
    done: false,
  },
];

const TodoStateContext = createContext();
const TodoDispatchContext = createContext();
const TodoNextIdContext = createContext();

function todoReducer(state, action) {
  switch (action.type) {
    case "CREATE":
      return state.concat(action.todo);
    case "TOGGLE":
      return state.map((todo) =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo
      );
    case "REMOVE":
      return state.filter((todo) => todo.id !== action.id);
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

// Context 에서 사용 할 값을 지정 할 때에는 위와 같이 Provider 컴포넌트를 렌더링 하고 value 를 설정해주면 된다.
// 이렇게하면 다른 컴포넌트에서 state나 dispatch를 사용하고 싶을때 아래와 같이 사용하면 된다.
/*
import React, { useContext } from 'react';
import { TodoStateContext, TodoDispatchContext } from './TodoContext'

function Sample(){
    const state = useContext(TodoStateContext);
    const dispatch = useContext(TodoDispatchContext);
    return <div>Sample</div>
}

*/
export function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, initialTodos);
  const nextId = useRef(5);

  return (
    <TodoStateContext.Provider value={state}>
      <TodoDispatchContext.Provider value={dispatch}>
        <TodoNextIdContext.Provider value={nextId}>
          {/* 
            꼭 children 문자열이어야 함!
            다른 명칭으로 주면 제대로 동작하지 않음
            APP component(사용 컴포넌트)에서 component들을 TodoProvider를 통해 감싸주기 때문에 
            그 안에 있는 컴포넌트들이 적용되기위해서는 children props를 넣어주어야 감싸진 component들이 적용되게 된다.
          */}
          {children}
        </TodoNextIdContext.Provider>
      </TodoDispatchContext.Provider>
    </TodoStateContext.Provider>
  );
}

// 커스텀 Hook
// 포넌트에서 useContext 를 직접 사용하는 대신에, useContext 를 사용하는 커스텀 Hook 을 만들어서 내보내줌
// 이렇게하면 다른 컴포넌트에서 state나 dispatch를 사용하고 싶을때 아래와 같이 사용하면 된다.
/*
import React from 'react'
import { useTodoState, useTodoDispatch} from './TodoContext';

function Sample(){
    const state = useTodoState();
    const dispatch = useTodoDispatch();
    return <div>Sample</div>;
}
*/
export function useTodoState() {
  const context = useContext(TodoStateContext);
  // Hook 을 사용하려면, 해당 컴포넌트가 TodoProvider 컴포넌트 내부에 렌더링되어 있어야 한다.
  // 만약 TodoProvider 로 감싸져있지 않다면 에러를 발생
  if (!context) {
    throw new Error("Cannot find TodoProvider");
  }
  return context;
}

export function useTodoDispatch() {
  const context = useContext(TodoDispatchContext);
  if (!context) {
    throw new Error("Cannot find TodoProvider");
  }
  return context;
}

// nextId : 새로운 항목을 추가할때 사용할 고유 ID
export function useTodoNextId() {
  const context = useContext(TodoNextIdContext);
  if (!context) {
    throw new Error("Cannot find TodoProvider");
  }
  return context;
}
