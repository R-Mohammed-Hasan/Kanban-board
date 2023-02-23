import { Draggable, Droppable, DragDropContext } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";
import { useState } from "react";

const itemsFromBackend = [
  { id: uuid(), content: "1st task" },
  { id: uuid(), content: "2nd task" },
  { id: uuid(), content: "3rd task" },
  { id: uuid(), content: "4th task" },
];

const columnsFromBackend = {
  [uuid()]: {
    name: "Todo",
    items: itemsFromBackend,
  },
  [uuid()]: {
    name: "In Progress",
    items:[]
  },
  [uuid()]: {
    name: "Completed",
    items:[]
  }
};

const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;
    // for better understanding these logs will help
    console.log(source);
    console.log(destination);
    // for same column dragging
    if(source.droppableId === destination.droppableId){
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];

    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }else{    // for dragging over different columns
      const sourceColumn = columns[source.droppableId];
      const destinationColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destinationItems = [...destinationColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destinationItems.splice(destination.index, 0, removed);
      setColumns({
          ...columns,
          [source.droppableId]: {
            ...sourceColumn,
            items: sourceItems
          },
          [destination.droppableId]: {
            ...destinationColumn,
            items: destinationItems
          }
      });

  }
};

function App() {
  const [columns, setColumns] = useState(columnsFromBackend);

  return (
    <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([id, column]) => {
          return (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} key={id}>
              <h2>{column.name}</h2>
              <div style={{margin: 8}}>
                {/* // here is is the uuid */}
                <Droppable droppableId={id} key={id}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver
                            ? "lightblue"
                            : "lightgrey",
                          padding: 4,
                          width: 250,
                          minHeight: 500,
                        }}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.dragHandleProps}
                                    {...provided.draggableProps}
                                    style={{
                                      userSelect: "none",
                                      padding: 16,
                                      margin: "0 0 8px 0",
                                      minHeight: "50px",
                                      backgroundColor: snapshot.isDragging
                                        ? "#263B4A"
                                        : "#456C86",
                                      color: "white",
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    {item.content}
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}

export default App;
