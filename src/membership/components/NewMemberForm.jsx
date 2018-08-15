import { Map } from 'immutable'
import React from 'react'
import { connect } from 'react-redux'
import { push, replace } from 'react-router-redux'
import { Card, CardActions, CardText } from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
const { Col, Row } = require('react-flexbox-grid');
const ImmutablePropTypes = require('react-immutable-proptypes');

import messages from '../messages'
import { setScene, showMessage } from '../../app/actions/app'
import { buyMembership, getPrices } from '../../payments/actions'
import StripeCheckout from '../../payments/components/stripe-checkout'
import { MembershipSelect, TextInput } from './form-components'
import MemberForm from './MemberForm'
import BidForm from './BidForm'

const bidFormName = "bid";
const membershipFormName = "membership";

class NewMemberForm extends React.Component {
  static propTypes = {
    buyMembership: React.PropTypes.func.isRequired,
    email: React.PropTypes.string,
    getPrices: React.PropTypes.func.isRequired,
    prices: ImmutablePropTypes.map,
    params: React.PropTypes.shape({
      membership: React.PropTypes.string
    }).isRequired,
    push: React.PropTypes.func.isRequired,
    replace: React.PropTypes.func.isRequired,
    setScene: React.PropTypes.func.isRequired,
    showMessage: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    console.log("Form, props: ", props);
    super(props);
    const { email, getPrices, params: { membership }, prices } = this.props;
    this.state = {
      member: Map({ email, membership, contact_prefs: Map({ email: true, snailmail: false }) }),
      tipAmount: 0,
      sent: false,
      valid: false
    };
    if (!prices) getPrices();
  }

  componentWillReceiveProps(nextProps) {
    const { email, params: { membership } } = nextProps;
    let { member } = this.state;
    if (email !== this.props.email) member = member.set('email', email);
    if (membership !== this.props.params.membership) member = member.set('membership', membership);
    if (!member.equals(this.state.member)) this.setState({ member });
  }

  componentDidMount() {
    this.props.setScene({ title: 'New Membership', dockSidebar: false });
  }

  onCheckout = (token) => {
    const { buyMembership, push, showMessage } = this.props;
    const { member } = this.state;
    const email = member.get('email');
    showMessage(`Charging ${email} USD ${this.price/100} ...`);
    buyMembership(member, this.paymentParts, email, token, () => {
      showMessage('Charge completed; new member registered!');
      push('/');
    });
  }

  msg(key, params) {
    const { lc = 'en' } = this.props
    return messages[lc][key](params)
  }

  get description() {
    const { prices } = this.props;
    const { member } = this.state;
    const msDesc = prices && prices.getIn(['memberships', member.get('membership'), 'description']);
    const parts = [`New ${msDesc} member`];
    if (member.get('paper_pubs')) parts.push(prices.getIn(['PaperPubs', 'description']));
    return parts.join(' + ')
  }

  get membershipPrice() {
    const { prices } = this.props;
    if (!prices) return 0;
    const { member } = this.state;
    const msAmount = prices.getIn(['memberships', member.get('membership'), 'amount']) || 0;
    const ppAmount = member.get('paper_pubs') && prices.getIn(['PaperPubs', 'amount']) || 0;
    return msAmount + ppAmount;
  }

  get tip() {
    const tipJarAmount = this.state.tipAmount || 0;
    return tipJarAmount;
  }

  get price() {
    return this.tip + this.membershipPrice;
  }

  get paymentParts() {
    return {
      membership: this.membershipPrice,
      tip: this.tip,
    };
  }

  get membershipType() {
    const { prices } = this.props;
    if (!prices) return 0;
    const { member } = this.state;
    const msType = prices.getIn(['memberships', member.get('membership'), 'type']);
    return msType;
  }

  render() {
    const { prices, replace } = this.props;
    const { member, sent, valid } = this.state;
    const paymentDisabled = !valid || this.price <= 0;

    const form = {
      membership: <MemberForm
                      member={member}
                      newMember={true}
                      onChange={ (valid, member) => this.setState({ member, valid }) }
                      prices={prices}
                      tabIndex={2}
        />,
      bid: <BidForm
               member={member}
               newMember={true}
               onChange={ (valid, member) => this.setState({ member, valid }) }
               prices={prices}
               tabIndex={2}
        />
    }[this.membershipType];
    const tipProps = {
      getDefaultValue: (path) => 0,
      getValue: (path) => this.state.tipAmount ? this.state.tipAmount / 100 : 0,
      onChange: (path, value) => this.setState({ tipAmount: parseInt(value) * 100 })
    };
    const tipField = {
      membership: <div/>,
      bid: <div>
        <TextInput
          { ... tipProps }
          
          path="tip_amount">
        </TextInput>
        </div>
    }[this.membershipType];

    return <Row>
      <Col
        xs={12}
        sm={10} smOffset={1}
        lg={8} lgOffset={2}
        style={{ paddingTop: 20 }}
      >
        <Card>
          <CardText>
            <Row>
              <Col xs={12}>
                <MembershipSelect
                  getValue={ path => member.getIn(path) || ''}
                  onChange={ (path, value) => replace(`/new/${value}`) }
                  prices={prices}
                />
              </Col>
          </Row>
          {form}
          </CardText>
          <CardActions style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 16, paddingBottom: 16 }}>
            <div style={{ display: 'flex', marginRight: 'auto' }}>
            {tipField}
            </div>
            <div style={{ color: 'rgba(0, 0, 0, 0.5)', paddingTop: 8, paddingRight: 16 }}>
              {this.price > 0 ? `Total: \$${this.price / 100}` : ''}
            </div>
            <StripeCheckout
              amount={this.price}
              currency="USD"
              description={this.description}
              disabled={paymentDisabled}
              email={member.get('email')}
              onCheckout={this.onCheckout}
              onClose={() => this.setState({ sent: false })}
            >
              <FlatButton
                label={ sent ? 'Working...' : 'Pay by card' }
                disabled={paymentDisabled}
                onTouchTap={ () => this.setState({ sent: true }) }
                style={{ flexShrink: 0 }}
                tabIndex={3}
              />
            </StripeCheckout>
          </CardActions>
        </Card>
      </Col>
    </Row>;
  }
}

export default connect(
  ({ purchase, user }) => ({
    email: user.get('email'),
    prices: purchase.get('prices')
  }), {
    buyMembership,
    getPrices,
    push,
    replace,
    setScene,
    showMessage,
  }
)(NewMemberForm);

