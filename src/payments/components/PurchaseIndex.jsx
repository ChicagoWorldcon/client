import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
const { Col, Row } = require('react-flexbox-grid');

import { setScene } from '../../app/actions/app'
import { getPurchaseData, getPurchaseList } from '../actions'
import * as PurchasePropTypes from '../proptypes'
import PurchaseItemCard from './PurchaseItemCard'
import PurchaseSelectCard from './PurchaseSelectCard'

class PurchaseIndex extends React.Component {
  static propTypes = {
    getPurchaseData: PropTypes.func.isRequired,
    getPurchaseList: PropTypes.func.isRequired,
    purchaseData: PurchasePropTypes.data,
    purchaseList: PurchasePropTypes.list,
    push: PropTypes.func.isRequired,
    setScene: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { getPurchaseData, getPurchaseList, purchaseData, purchaseList, setScene } = this.props;
    if (!purchaseData) getPurchaseData();
    if (!purchaseList) getPurchaseList();
    setScene({ title: 'Purchases', dockSidebar: false });
  }

  render() {
    const { purchaseData, purchaseList, push } = this.props;
    if (!purchaseData) return null;
    const firstOffset = [0, 4, 2][(purchaseData ? purchaseData.size : 0) + (purchaseList ? purchaseList.size : 0)] || 0;
    return <Row>
      { purchaseList && purchaseList.map((purchase, i) => {
        const categoryData = purchaseData.get(purchase.get('category'));
        const type = purchase.get('type');
        return (
          <Col
            xs={12} sm={6}
            lg={4} lgOffset={i > 0 ? 0 : firstOffset}
            key={i}
          >
            <PurchaseItemCard
              label={categoryData.getIn(['types', type, 'label']) || type}
              purchase={purchase}
              shape={categoryData.get('shape')}
            />
          </Col>
        );
      })}
      { purchaseData && purchaseData.entrySeq().map(([category, data]) => (
        <Col
          xs={12} sm={6} lg={4}
          key={category}
        >
          <PurchaseSelectCard
            data={data}
            label={category}
            onSelect={(type) => push(`/pay/${category}/${type}`)}
            title={`New ${category}`}
          />
        </Col>
      ))}
    </Row>;
  }
}

export default connect(
  ({ purchase }) => ({
    purchaseData: purchase.get('data'),
    purchaseList: purchase.get('list')
  }), {
    getPurchaseData,
    getPurchaseList,
    push,
    setScene,
  }
)(PurchaseIndex);
