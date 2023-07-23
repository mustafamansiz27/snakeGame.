// src/SnakeGame.js
import React, { useState, useEffect } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: GRID_SIZE / 2, y: GRID_SIZE / 2 },
  { x: GRID_SIZE / 2, y: GRID_SIZE / 2 - 1 },
];
const INITIAL_DIRECTION = { x: 0, y: 1 };
const INITIAL_FOOD = createRandomFood();

function createRandomFood() {
  return {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  };  
}

function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [isGameOver, setIsGameOver] = useState(false);
  
  useEffect(() => {
    const gameLoop = setInterval(() => {
      if (!isGameOver) {
        moveSnake();
        checkCollision();
        checkFood();
      }
    }, 200);

    return () => clearInterval(gameLoop);
  }, [isGameOver, snake, direction]);

  const moveSnake = () => {
    setSnake((prevSnake) =>
      prevSnake.map((_, index) =>
        index === 0
          ? { x: prevSnake[0].x + direction.x, y: prevSnake[0].y + direction.y }
          : { ...prevSnake[index - 1] }
      )
    );
  };

  const checkCollision = () => {
    const head = snake[0];
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      setIsGameOver(true);
    }
  };

  const checkFood = () => {
    const head = snake[0];
    if (head.x === food.x && head.y === food.y) {
      setFood(createRandomFood());
      growSnake();
    }
  };

  const growSnake = () => {
    setSnake((prevSnake) => [
      { x: prevSnake[0].x + direction.x, y: prevSnake[0].y + direction.y },
      ...prevSnake,
    ]);
  };

  const handleKeyPress = (event) => {
    const keyPressed = event.key;
    switch (keyPressed) {
      case 'ArrowUp':
        setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
        setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
        setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
        setDirection({ x: 1, y: 0 });
        break;
      default:
        break;
    }
  };

  return (
    <div tabIndex="0" onKeyDown={handleKeyPress}>
      <h1>Snake Game</h1>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)` }}>
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);
          const isSnakeCell = snake.some((cell) => cell.x === x && cell.y === y);
          const isFoodCell = food.x === x && food.y === y;
          return (
            <div
              key={index}
              style={{
                width: '20px',
                height: '20px',
                border: '1px solid black',
                backgroundColor: isSnakeCell
                  ? isGameOver
                    ? 'red'
                    : 'green'
                  : isFoodCell
                  ? 'orange'
                  : 'white',
              }}
            />
          );
        })}
      </div>
      {isGameOver && <h2>Game Over!</h2>}
    </div>
  );
}

export default SnakeGame;
