import React, { FC, useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { Typography } from "@douyinfe/semi-ui";
import { Dialog } from "react-vant";
import "./index.css";
import { Habbit } from "../../../../API/models/Habbit";
import { db } from "../../../../API/db";
import { IconDelete } from "@douyinfe/semi-icons";

const { Title, Text } = Typography;
export interface ListModalProps {
  items: Habbit[];
  onOk: () => void;
  onCancel: () => void;
  visible?: boolean;
}
const ListModal: FC<ListModalProps> = ({
  items,
  onOk,
  onCancel,
  visible = false,
}) => {
  const [listData, setListData] = useState<Habbit[]>();
  const [deleteNameList, setDeleteNameList] = useState<string[]>();
  const reorder = async (
    list: Habbit[],
    startIndex: number,
    endIndex: number
  ) => {
    if (startIndex === endIndex) {
      return;
    }
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setListData(result);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    reorder(listData ?? [], result.source.index, result.destination.index);
  };
  const onDelelte = async (name: string) => {
    return await db.habbitList.where("name").equals(name).delete();
  };

  useEffect(() => {
    setListData(items);
  }, [items]);
  return (
    <Dialog
      visible={visible}
      title="Ranking Habbit"
      showCancelButton
      // showConfirmButton={false}
      onCancel={() => {
        setListData([...items]);
        onCancel();
      }}
      onConfirm={async () => {
        await deleteNameList?.map((name: string) => onDelelte(name));

        await db.habbitList.toCollection().modify((f) => {
          const idx = listData?.findIndex((v) => v.id === f.id) ?? -1;
          if (~idx) {
            f.rank = idx;
          }
        });
        onOk();
      }}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          renderClone={(provided, snapshot, rubric) => (
            <div
              className="mb-2 px-2 flex justify-between items center"
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
              // style={{ backgroundColor: 'red'}}
            >
              {listData?.[rubric.source.index].name}
              <IconDelete />
            </div>
          )}
          droppableId="hello"
        >
          {(provided) => (
            <div
              className="px-2 pb-4"
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ overflow: "hidden" }}
            >
              {listData?.map((val, idx) => {
                return (
                  <Draggable
                    draggableId={`${val.name}`}
                    index={idx}
                    key={`${val.name}`}
                    // ref={provided.innerRef}
                  >
                    {(provided) => (
                      <div
                        className="mt-2 px-2 flex justify-between items center"
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                      >
                        {val.name}
                        <IconDelete
                          onClick={() => {
                            let names;
                            if (deleteNameList) {
                              names = [...deleteNameList, val.name];
                            } else {
                              names = [val.name];
                            }
                            setDeleteNameList(names);
                            setListData(
                              listData.filter((v) => v.name !== val.name)
                            );
                          }}
                        />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Dialog>
  );
};

export default ListModal;
