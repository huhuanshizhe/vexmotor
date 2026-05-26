'use client';

import { DeleteOutlined, EditOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Switch, Table, Tag, Typography } from 'antd';
import { useState, useTransition } from 'react';

import type { AdminProductRow } from '@/server/admin/products';

const initialValues = {
  name: '',
  slug: '',
  sku: '',
  purchaseMode: 'buy',
  status: 'draft',
  price: 0,
  compareAtPrice: null as number | null,
  shortDescription: '',
  description: '',
  currencyCode: 'USD',
  stockQuantity: 0,
  featured: false,
  brandId: null as string | null,
  defaultCategoryId: null as string | null,
  seoTitle: '',
  seoDescription: '',
  images: [] as Array<{ url: string; alt: string; width: number | null; height: number | null; isPrimary: boolean }>,
  features: [] as Array<{ featureKey: string; featureValue: string; unit: string | null }>,
  attachments: [] as Array<{ name: string; url: string; mimeType: string }>,
};

type OptionItem = { label: string; value: string };

export function AdminProductsClient({
  initialRows,
  brandOptions,
  categoryOptions,
}: {
  initialRows: AdminProductRow[];
  brandOptions: OptionItem[];
  categoryOptions: OptionItem[];
}) {
  const [rows, setRows] = useState<AdminProductRow[]>(initialRows);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [form] = Form.useForm<typeof initialValues>();

  async function reloadRows() {
    const response = await fetch('/api/admin/products', { cache: 'no-store' });
    const payload = (await response.json()) as { items: AdminProductRow[] };
    setRows(payload.items ?? []);
  }

  function openCreate() {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue(initialValues);
    setOpen(true);
  }

  function openEdit(row: AdminProductRow) {
    startTransition(async () => {
      const response = await fetch(`/api/admin/products/${row.id}`, { cache: 'no-store' });
      if (!response.ok) {
        return;
      }

      const detail = (await response.json()) as AdminProductRow & {
        seoTitle: string | null;
        seoDescription: string | null;
        images: Array<{ url: string; alt: string; width: number | null; height: number | null; isPrimary: boolean }>;
        features: Array<{ featureKey: string; featureValue: string; unit: string | null }>;
        attachments: Array<{ name: string; url: string; mimeType: string }>;
      };

      setEditingId(row.id);
      form.setFieldsValue({
        name: detail.name,
        slug: detail.slug,
        sku: detail.sku,
        purchaseMode: detail.purchaseMode,
        status: detail.status,
        price: Number(detail.price),
        compareAtPrice: detail.compareAtPrice == null ? null : Number(detail.compareAtPrice),
        shortDescription: detail.shortDescription ?? '',
        description: detail.description ?? '',
        currencyCode: detail.currencyCode,
        stockQuantity: detail.stockQuantity,
        featured: detail.featured,
        brandId: detail.brandId,
        defaultCategoryId: detail.defaultCategoryId,
        seoTitle: detail.seoTitle ?? '',
        seoDescription: detail.seoDescription ?? '',
        images: detail.images,
        features: detail.features,
        attachments: detail.attachments,
      });
      setOpen(true);
    });
  }

  function handleSubmit(values: typeof initialValues) {
    startTransition(async () => {
      const response = await fetch(editingId ? `/api/admin/products/${editingId}` : '/api/admin/products', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        form.resetFields();
        setOpen(false);
        setEditingId(null);
        await reloadRows();
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const response = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await reloadRows();
      }
    });
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <div>
          <Typography.Title level={2}>Products</Typography.Title>
          <Typography.Paragraph type="secondary">
            The admin product list now reads from the real database API. Use the seed script first to populate catalog records.
          </Typography.Paragraph>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Create Product
        </Button>
      </Space>
      <Card>
        <Table
          rowKey="id"
          loading={isPending}
          dataSource={rows}
          pagination={false}
          columns={[
            { title: 'Name', dataIndex: 'name' },
            { title: 'SKU', dataIndex: 'sku' },
            { title: 'Brand', dataIndex: 'brandName', render: (value: string | null) => value ?? 'Unassigned' },
            { title: 'Category', dataIndex: 'categoryName', render: (value: string | null) => value ?? 'Unassigned' },
            {
              title: 'Mode',
              dataIndex: 'purchaseMode',
              render: (value: string) => <Tag color={value === 'buy' ? 'green' : 'orange'}>{value}</Tag>,
            },
            { title: 'Stock', dataIndex: 'stockQuantity' },
            { title: 'Price', dataIndex: 'price' },
            {
              title: 'Status',
              dataIndex: 'status',
              render: (value: string) => <Tag>{value}</Tag>,
            },
            {
              title: 'Actions',
              key: 'actions',
              render: (_, row: AdminProductRow) => (
                <Space>
                  <Button icon={<EditOutlined />} onClick={() => openEdit(row)} />
                  <Popconfirm title="Delete this product?" onConfirm={() => handleDelete(row.id)}>
                    <Button danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
        />
      </Card>
      <Modal
        open={open}
        onCancel={() => {
          setOpen(false);
          setEditingId(null);
        }}
        onOk={() => form.submit()}
        confirmLoading={isPending}
        title={editingId ? 'Edit Product' : 'Create Product'}
      >
        <Form form={form} layout="vertical" initialValues={initialValues} onFinish={handleSubmit}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="sku" label="SKU" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="shortDescription" label="Short Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={5} />
          </Form.Item>
          <Form.Item name="seoTitle" label="SEO Title">
            <Input />
          </Form.Item>
          <Form.Item name="seoDescription" label="SEO Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="purchaseMode" label="Purchase Mode" rules={[{ required: true }]}>
            <Select options={[{ value: 'buy', label: 'buy' }, { value: 'inquiry', label: 'inquiry' }]} />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'draft', label: 'draft' },
                { value: 'active', label: 'active' },
                { value: 'inactive', label: 'inactive' },
                { value: 'archived', label: 'archived' },
              ]}
            />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber min={0} precision={2} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="compareAtPrice" label="Compare At Price">
            <InputNumber min={0} precision={2} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="currencyCode" label="Currency" rules={[{ required: true }]}>
            <Select options={[{ value: 'USD', label: 'USD' }, { value: 'EUR', label: 'EUR' }, { value: 'CNY', label: 'CNY' }]} />
          </Form.Item>
          <Form.Item name="stockQuantity" label="Stock Quantity" rules={[{ required: true }]}>
            <InputNumber min={0} precision={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="brandId" label="Brand">
            <Select allowClear options={brandOptions} />
          </Form.Item>
          <Form.Item name="defaultCategoryId" label="Default Category">
            <Select allowClear options={categoryOptions} />
          </Form.Item>
          <Form.Item name="featured" label="Featured" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Divider>Images</Divider>
          <Form.List name="images">
            {(fields, { add, remove }) => (
              <Space direction="vertical" style={{ width: '100%' }}>
                {fields.map((field) => (
                  <Card key={field.key} size="small">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Form.Item name={[field.name, 'url']} label="Image URL" rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                      <Form.Item name={[field.name, 'alt']} label="Alt Text" rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                      <Space style={{ width: '100%' }}>
                        <Form.Item name={[field.name, 'width']} label="Width" style={{ flex: 1 }}>
                          <InputNumber min={1} precision={0} style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item name={[field.name, 'height']} label="Height" style={{ flex: 1 }}>
                          <InputNumber min={1} precision={0} style={{ width: '100%' }} />
                        </Form.Item>
                      </Space>
                      <Form.Item name={[field.name, 'isPrimary']} label="Primary" valuePropName="checked">
                        <Switch />
                      </Form.Item>
                      <Button danger icon={<MinusCircleOutlined />} onClick={() => remove(field.name)}>
                        Remove Image
                      </Button>
                    </Space>
                  </Card>
                ))}
                <Button icon={<PlusOutlined />} onClick={() => add({ url: '', alt: '', width: null, height: null, isPrimary: false })}>
                  Add Image
                </Button>
              </Space>
            )}
          </Form.List>

          <Divider>Features</Divider>
          <Form.List name="features">
            {(fields, { add, remove }) => (
              <Space direction="vertical" style={{ width: '100%' }}>
                {fields.map((field) => (
                  <Card key={field.key} size="small">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Form.Item name={[field.name, 'featureKey']} label="Feature Key" rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                      <Form.Item name={[field.name, 'featureValue']} label="Feature Value" rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                      <Form.Item name={[field.name, 'unit']} label="Unit">
                        <Input />
                      </Form.Item>
                      <Button danger icon={<MinusCircleOutlined />} onClick={() => remove(field.name)}>
                        Remove Feature
                      </Button>
                    </Space>
                  </Card>
                ))}
                <Button icon={<PlusOutlined />} onClick={() => add({ featureKey: '', featureValue: '', unit: null })}>
                  Add Feature
                </Button>
              </Space>
            )}
          </Form.List>

          <Divider>Attachments</Divider>
          <Form.List name="attachments">
            {(fields, { add, remove }) => (
              <Space direction="vertical" style={{ width: '100%' }}>
                {fields.map((field) => (
                  <Card key={field.key} size="small">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Form.Item name={[field.name, 'name']} label="Attachment Name" rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                      <Form.Item name={[field.name, 'url']} label="Attachment URL" rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                      <Form.Item name={[field.name, 'mimeType']} label="MIME Type" rules={[{ required: true }]}>
                        <Input placeholder="application/pdf" />
                      </Form.Item>
                      <Button danger icon={<MinusCircleOutlined />} onClick={() => remove(field.name)}>
                        Remove Attachment
                      </Button>
                    </Space>
                  </Card>
                ))}
                <Button icon={<PlusOutlined />} onClick={() => add({ name: '', url: '', mimeType: 'application/pdf' })}>
                  Add Attachment
                </Button>
              </Space>
            )}
          </Form.List>
        </Form>
      </Modal>
    </Space>
  );
}
