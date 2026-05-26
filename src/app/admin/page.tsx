'use client';

import { Card, Col, Row, Statistic, Typography } from 'antd';

export default function AdminPage() {
  return (
    <div>
      <Typography.Title level={2}>Operations Overview</Typography.Title>
      <Typography.Paragraph type="secondary">
        First implementation milestone: the admin shell is live and ready to receive product, order, and inquiry management pages.
      </Typography.Paragraph>
      <Row gutter={[16, 16]} className="admin-grid">
        <Col span={24}>
          <Card>
            <Statistic title="Products planned in schema" value={23} suffix="tables/docs items" />
          </Card>
        </Col>
        <Col span={24}>
          <Card>
            <Statistic title="Storefront API tags" value={13} />
          </Card>
        </Col>
        <Col span={24}>
          <Card>
            <Statistic title="Spec-driven docs created" value={4} suffix="core files" />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
