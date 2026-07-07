import React, { useState, useRef, useEffect } from 'react';
import { GripVertical } from 'lucide-react';

const InteractiveDragList = ({ items, onReorder, renderItem }) => {
  const [list, setList] = useState(items);
  const dragItem = useRef();
  const dragOverItem = useRef();

  useEffect(() => {
    setList(items);
  }, [items]);

  const handleDragStart = (e, position) => {
    dragItem.current = position;
    e.currentTarget.classList.add('opacity-40');
  };

  const handleDragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('opacity-40');
    
    const copyListItems = [...list];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    
    dragItem.current = null;
    dragOverItem.current = null;
    setList(copyListItems);
    onReorder(copyListItems);
  };

  if (!list || list.length === 0) {
    return <div className="text-center py-8 text-slate-400">No items available to reorder</div>;
  }

  return (
    <div className="space-y-3">
      {list.map((item, index) => (
        <div
          key={item._id || item.id || index}
          onDragStart={(e) => handleDragStart(e, index)}
          onDragEnter={(e) => handleDragEnter(e, index)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => e.preventDefault()}
          draggable
          className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-xl hover:border-slate-200 shadow-sm transition-all select-none cursor-move group"
        >
          <div className="text-slate-300 group-hover:text-slate-400 cursor-grab active:cursor-grabbing transition-colors shrink-0">
            <GripVertical className="w-5 h-5" />
          </div>
          <div className="grow">
            {renderItem(item, index)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default InteractiveDragList;
