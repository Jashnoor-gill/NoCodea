import { useDrag, useDrop } from 'react-dnd';

export const useDragDrop = (type, item, canDrag = true) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item,
    canDrag,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: type,
    drop: (droppedItem) => {
      if (droppedItem.id !== item.id) {
        // Handle the drop
        console.log('Dropped:', droppedItem);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return {
    drag,
    drop,
    isDragging,
    isOver,
  };
}; 