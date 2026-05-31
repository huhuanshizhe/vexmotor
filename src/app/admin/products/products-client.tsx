'use client';

import { DeleteOutlined, EditOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Switch, Table, Tag, Typography } from 'antd';
import { useState, useTransition } from 'react';

import {
  formatAdminMoney,
  productStatusColors,
  productStatusLabels,
  productStatusOptions,
  purchaseModeColors,
  purchaseModeLabels,
  purchaseModeOptions,
} from '@/lib/admin-display';
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
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();
  const [form] = Form.useForm<typeof initialValues>();

  async function reloadRows(nextSearch = search) {
    const params = new URLSearchParams();
    if (nextSearch.trim()) {
      params.set('search', nextSearch.trim());
    }

    const response = await fetch(`/api/admin/products${params.size ? `?${params.toString()}` : ''}`, { cache: 'no-store' });
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
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <div>
          <Typography.Title level={2}>产品管理</Typography.Title>
          <Typography.Paragraph type="secondary">
            维护产品基础信息、购买模式、库存、图册、规格特性与资料附件。数据库不可用时会自动回退到内存数据，便于本地联调。
          </Typography.Paragraph>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          新建产品
        </Button>
      </Space>
      <Card>
        <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }} wrap>
          <Input.Search
            placeholder="搜索产品名称、SKU、Slug"
            allowClear
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onSearch={(value) => {
              setSearch(value);
              startTransition(async () => {
                await reloadRows(value);
              });
            }}
            style={{ maxWidth: 360 }}
          />
          <Typography.Text type="secondary">共 {rows.length} 个产品</Typography.Text>
        </Space>
        <Table
          rowKey="id"
          loading={isPending}
          dataSource={rows}
          pagination={false}
          scroll={{ x: 1100 }}
          columns={[
            { title: '产品名称', dataIndex: 'name' },
            { title: 'SKU', dataIndex: 'sku' },
            { title: '品牌', dataIndex: 'brandName', render: (value: string | null) => value ?? '未分配' },
            { title: '默认分类', dataIndex: 'categoryName', render: (value: string | null) => value ?? '未分配' },
            {
              title: '购买模式',
              dataIndex: 'purchaseMode',
              render: (value: keyof typeof purchaseModeLabels) => (
                <Tag color={purchaseModeColors[value]}>{purchaseModeLabels[value]}</Tag>
              ),
            },
            { title: '库存', dataIndex: 'stockQuantity' },
            {
              title: '单价',
              dataIndex: 'price',
              render: (value: string, row: AdminProductRow) => formatAdminMoney(value, row.currencyCode),
            },
            {
              title: '状态',
              dataIndex: 'status',
              render: (value: keyof typeof productStatusLabels) => (
                <Tag color={productStatusColors[value]}>{productStatusLabels[value]}</Tag>
              ),
            },
            {
              title: '操作',
              key: 'actions',
              render: (_, row: AdminProductRow) => (
                <Space>
                  <Button icon={<EditOutlined />} onClick={() => openEdit(row)} />
                  <Popconfirm title="确定删除该产品吗？" onConfirm={() => handleDelete(row.id)}>
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
        title={editingId ? '编辑产品' : '新建产品'}
      >
        <Form form={form} layout="vertical" initialValues={initialValues} onFinish={handleSubmit}>
          <Form.Item name="name" label="产品名称" rules={[{ required: true, message: '请输入产品名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="slug" label="Slug" rules={[{ required: true, message: '请输入 Slug' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="sku" label="SKU" rules={[{ required: true, message: '请输入 SKU' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="shortDescription" label="简短描述">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="description" label="详细描述">
            <Input.TextArea rows={5} />
          </Form.Item>
          <Form.Item name="seoTitle" label="SEO 标题">
            <Input />
          </Form.Item>
          <Form.Item name="seoDescription" label="SEO 描述">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="purchaseMode" label="购买模式" rules={[{ required: true }]}>
            <Select options={purchaseModeOptions} />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true }]}>
            <Select options={productStatusOptions} />
          </Form.Item>
          <Form.Item name="price" label="销售价" rules={[{ required: true, message: '请输入销售价' }]}>
            <InputNumber min={0} precision={2} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="compareAtPrice" label="划线价">
            <InputNumber min={0} precision={2} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="currencyCode" label="币种" rules={[{ required: true }]}>
            <Select options={[{ value: 'USD', label: 'USD' }, { value: 'EUR', label: 'EUR' }, { value: 'CNY', label: 'CNY' }]} />
          </Form.Item>
          <Form.Item name="stockQuantity" label="库存数量" rules={[{ required: true }]}>
            <InputNumber min={0} precision={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="brandId" label="品牌">
            <Select allowClear options={brandOptions} />
          </Form.Item>
          <Form.Item name="defaultCategoryId" label="默认分类">
            <Select allowClear options={categoryOptions} />
          </Form.Item>
          <Form.Item name="featured" label="首页推荐" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Divider>产品图片</Divider>
          <Form.List name="images">
            {(fields, { add, remove }) => (
              <Space orientation="vertical" style={{ width: '100%' }}>
                {fields.map((field) => (
                  <Card key={field.key} size="small">
                    <Space orientation="vertical" style={{ width: '100%' }}>
                      <Form.Item name={[field.name, 'url']} label="图片 URL" rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                      <Form.Item name={[field.name, 'alt']} label="图片描述" rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                      <Space style={{ width: '100%' }}>
                        <Form.Item name={[field.name, 'width']} label="宽度" style={{ flex: 1 }}>
                          <InputNumber min={1} precision={0} style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item name={[field.name, 'height']} label="高度" style={{ flex: 1 }}>
                          <InputNumber min={1} precision={0} style={{ width: '100%' }} />
                        </Form.Item>
                      </Space>
                      <Form.Item name={[field.name, 'isPrimary']} label="主图" valuePropName="checked">
                        <Switch />
                      </Form.Item>
                      <Button danger icon={<MinusCircleOutlined />} onClick={() => remove(field.name)}>
                        删除图片
                      </Button>
                    </Space>
                  </Card>
                ))}
                <Button icon={<PlusOutlined />} onClick={() => add({ url: '', alt: '', width: null, height: null, isPrimary: false })}>
                  新增图片
                </Button>
              </Space>
            )}
          </Form.List>

          <Divider>产品特性</Divider>
          <Form.List name="features">
            {(fields, { add, remove }) => (
              <Space orientation="vertical" style={{ width: '100%' }}>
                {fields.map((field) => (
                  <Card key={field.key} size="small">
                    <Space orientation="vertical" style={{ width: '100%' }}>
                      <Form.Item name={[field.name, 'featureKey']} label="特性名称" rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                      <Form.Item name={[field.name, 'featureValue']} label="特性值" rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                      <Form.Item name={[field.name, 'unit']} label="单位">
                        <Input />
                      </Form.Item>
                      <Button danger icon={<MinusCircleOutlined />} onClick={() => remove(field.name)}>
                        删除特性
                      </Button>
                    </Space>
                  </Card>
                ))}
                <Button icon={<PlusOutlined />} onClick={() => add({ featureKey: '', featureValue: '', unit: null })}>
                  新增特性
                </Button>
              </Space>
            )}
          </Form.List>

          <Divider>资料附件</Divider>
          <Form.List name="attachments">
            {(fields, { add, remove }) => (
              <Space orientation="vertical" style={{ width: '100%' }}>
                {fields.map((field) => (
                  <Card key={field.key} size="small">
                    <Space orientation="vertical" style={{ width: '100%' }}>
                      <Form.Item name={[field.name, 'name']} label="附件名称" rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                      <Form.Item name={[field.name, 'url']} label="附件 URL" rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                      <Form.Item name={[field.name, 'mimeType']} label="MIME 类型" rules={[{ required: true }]}>
                        <Input placeholder="application/pdf" />
                      </Form.Item>
                      <Button danger icon={<MinusCircleOutlined />} onClick={() => remove(field.name)}>
                        删除附件
                      </Button>
                    </Space>
                  </Card>
                ))}
                <Button icon={<PlusOutlined />} onClick={() => add({ name: '', url: '', mimeType: 'application/pdf' })}>
                  新增附件
                </Button>
              </Space>
            )}
          </Form.List>
        </Form>
      </Modal>
    </Space>
  );
}
