import { Form } from "@douyinfe/semi-ui";
import React, { FC, useEffect, useState } from "react";
import { Dialog } from "react-vant";
import { Habbit } from "../../../../API/models/Habbit";
import { CirclePicker } from "react-color";
import { BaseFormApi } from ".pnpm/@douyinfe+semi-foundation@2.2.0/node_modules/@douyinfe/semi-foundation/lib/es/form/interface";
import { useAppContext } from "../../../../layout/context";
import { db } from "../../../../API/db";
export interface HabbitModalProps {
  type: "edit" | "add";
  item?: Habbit;
  onOk: () => void;
  onCancel: () => void;
  visible?: boolean;
}
const HabbitModal: FC<HabbitModalProps> = ({
  onOk,
  onCancel,
  visible = false,
  type,
  item,
}) => {
  const initialColor = "#2563eb";
  const [formApi, setFormApi] = useState<BaseFormApi<any>>();
  const { habitatController } = useAppContext();
  const [habbitName, setHabbitName] = useState<string>("");
  const [addcolor, setAddcolor] = useState<string>("#2563eb");
  useEffect(() => {
    if (type === "edit" && item) {
      setAddcolor(item.color);
      setHabbitName(item.name);
    }
  }, [item]);
  const onAdd = async () => {
    try {
      await habitatController.addHabbit({
        name: habbitName,
        createDate: new Date(),
        count: 0,
        color: addcolor,
      });
      formApi?.reset();
      setAddcolor(initialColor);
      onOk();
    } catch (e) {
      formApi?.setError("name", "name are unique or name are unique");
    }
  };
  const onEdit = async () => {
    try {
      await formApi?.validate();

      if (habbitName !== item?.name || addcolor !== item?.color) {
        await db.habbitList
          .where({
            name: item?.name,
          })
          .modify((f) => {
            if (habbitName) {
              f.name = habbitName;
            }
            f.color = addcolor;
          });
        history.replaceState(null, "", `/detail/${habbitName}`);
      }
      onOk();
    } catch (e) {
      console.log(e);

      formApi?.setError("name", "name are unique");
    }
  };
  return (
    <Dialog
      visible={visible}
      title="Add Habbit"
      showCancelButton
      onCancel={onCancel}
      onConfirm={() => {
        if (type === "add") {
          onAdd();
        } else {
          onEdit();
        }
      }}
    >
      <div style={{ textAlign: "center", margin: "16px" }}>
        <Form getFormApi={(formApi) => setFormApi(formApi)}>
          <Form.Input
            field="name"
            noLabel
            initValue={habbitName}
            rules={[{ required: true, message: "name can not be empty" }]}
            onChange={(v) => setHabbitName(v)}
            placeholder={"NEW HABBIT"}
          ></Form.Input>
        </Form>
        <CirclePicker
          colors={[
            "#2196f3",
            "#2563eb",
            "#03a9f4",
            "#f44336",
            "#e91e63",
            "#9c27b0",
            "#673ab7",
          ]}
          onChange={(v) => setAddcolor(v.hex)}
          color={addcolor}
          circleSpacing={16}
        />
      </div>
    </Dialog>
  );
};

export default HabbitModal;
