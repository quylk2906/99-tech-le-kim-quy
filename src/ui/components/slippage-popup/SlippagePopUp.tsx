import {
  Alert,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  ModalProps,
  Segmented,
  Switch,
} from 'antd';
import { useEffect } from 'react';

type FormValue = {
  slippage: number;
  customSlippage?: boolean;
  customSlippageVal?: number;
};

type Props = ModalProps & {
  defaultValue?: number;
  onSubmit?: (slippage: number) => void;
};

const SlippageOptions = [
  {
    label: '0.5%',
    value: '0.5',
  },
  {
    label: '1%',
    value: '1',
  },
  {
    label: '2%',
    value: '2',
  },
];

const SlippagePopUp = ({ defaultValue = 1, onSubmit, ...props }: Props) => {
  const [form] = Form.useForm<FormValue>();

  const handleChangeSeg = (val: string) => {
    form.setFieldsValue({
      slippage: Number(val),
      customSlippage: false,
      customSlippageVal: 5,
    });
  };

  useEffect(() => {
    if (!SlippageOptions.some((el) => +el.value === defaultValue)) {
      form.setFieldsValue({
        slippage: 0,
        customSlippage: true,
        customSlippageVal: defaultValue,
      });
    }
  }, [defaultValue]);

  const handleSubmit = async () => {
    try {
      const data = await form.validateFields();
      if (data.customSlippage) {
        onSubmit?.(Number(data.customSlippageVal ?? 0));
      } else {
        onSubmit?.(Number(data.slippage ?? 0));
      }
      props.onCancel?.({} as any);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal {...props} centered title="Settings" onOk={handleSubmit}>
      <Form form={form} layout="horizontal">
        <Form.Item<FormValue>
          label="Max. slippage"
          name={'slippage'}
          initialValue={defaultValue}
        >
          <Input readOnly className="w-full" />
        </Form.Item>

        <Form.Item>
          <Segmented
            defaultValue={`${defaultValue}`}
            options={[
              {
                label: '0.5%',
                value: '0.5',
              },
              {
                label: '1%',
                value: '1',
              },
              {
                label: '2%',
                value: '2',
              },
            ]}
            onChange={handleChangeSeg as any}
          />
        </Form.Item>

        <Divider className="my-1" />

        <Form.Item<FormValue>
          label="Custom price impact"
          valuePropName="checked"
          name={'customSlippage'}
          // css={{
          //   '.ant-form-item-row': {
          //     display: 'grid',
          //     alignItems: 'center',
          //     gridTemplateColumns: `1fr auto`,
          //   },
          //   '.ant-form-item-control': {
          //     flexGrow: 0,
          //     width: 'unset !important',
          //   },
          //   '.ant-row': {
          //     justifyContent: 'space-between',
          //   },
          // }}
        >
          <Switch />
        </Form.Item>

        <Form.Item<FormValue> shouldUpdate noStyle>
          {({ getFieldValue }) => {
            const customSlippage = getFieldValue('customSlippage');
            return customSlippage ? (
              <>
                <Form.Item<FormValue>
                  name={'customSlippageVal'}
                  initialValue="5"
                  rules={[{ required: true, message: 'Please input' }]}
                >
                  <InputNumber
                    placeholder="0"
                    inputMode="decimal"
                    className="w-full"
                  />
                </Form.Item>
                <Alert
                  showIcon
                  description="Setting a custom price impact limit may result in a significant difference between the expected and the actual amount of tokens you receive. Use at your own risk."
                  type="warning"
                />
              </>
            ) : null;
          }}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SlippagePopUp;
