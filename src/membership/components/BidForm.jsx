import { Map } from 'immutable'
import React, { PropTypes } from 'react'
const { Col, Row } = require('react-flexbox-grid')
const ImmutablePropTypes = require('react-immutable-proptypes')
import Checkbox from 'material-ui/Checkbox';

import { midGray } from '../../theme'
import messages from '../messages'
import { TextInput } from './form-components'

export const hintStyle = {
  color: midGray,
  fontSize: 13,
  margin: '12px 0 24px' // sans the top margin, chrome autocomplete occludes us
}

export default class BidForm extends React.Component {

  static propTypes = {
    lc: PropTypes.string,
    member: ImmutablePropTypes.mapContains({
      paper_pubs: ImmutablePropTypes.map,
      contact_prefs: ImmutablePropTypes.mapContains({
        email: PropTypes.bool,
        snailmail: PropTypes.bool
      })
    }),
    newMember: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    prices: ImmutablePropTypes.map,
    tabIndex: PropTypes.number
  }

  static isValid(member) {
    return Map.isMap(member)
      && member.get('legal_name', false) && member.get('email', false);
  }

  constructor(props) {
    super(props)
    this.state = {
      member: props.member || Map()
    }
  }

  componentWillReceiveProps(nextProps) {
    const { member, onChange } = nextProps
    if (!member) {
      this.setState({ member: Map() })
    } else if (!member.equals(this.props.member)) {
      this.setState({ member }, () => {
        onChange(this.isValid, this.changes)
      })
    }
  }

  get changes() {
    const { member, newMember } = this.props
    return this.state.member.filter(
      newMember || !member
        ? (value) => value
        : (value, key) => {
            let v0 = member.get(key)
            if (typeof value === 'string' && !v0) v0 = ''
            return Map.isMap(value) ? !value.equals(v0) : value !== v0
          }
    )
  }

  getDefaultValue = (path) => this.props.member && this.props.member.getIn(path) || ''
  getValue = (path) => this.state.member.getIn(path) || ''

  get hasPaperPubs() {
    return !!this.state.member.get('paper_pubs')
  }

  get isValid() {
    return BidForm.isValid(this.state.member)
  }

  get contactPrefsHasEmail() {
    const p = ["contact_prefs", "email"];
    return this.state.member.getIn(p);
  }

  get contactPrefsHasSnailmail() {
    const p = ["contact_prefs", "snailmail"];
    return this.state.member.getIn(p);
  }

  msg(key, params) {
    if (!Array.isArray(key)) key = [ key ];

    const get = (p, o) =>
          p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, o);

    const { lc = 'en' } = this.props;

    return get(key, messages[lc])(params);
  }

  onChange = (path, value) => {
    this.setState({
      member: this.state.member.setIn(path, value)
    }, () => {
      this.props.onChange(this.isValid, this.changes)
    })
  }

  render() {
    const { lc, newMember, prices, tabIndex } = this.props;
    const { member } = this.state;
    const inputProps = {
      getDefaultValue: this.getDefaultValue,
      getValue: this.getValue,
      lc,
      onChange: this.onChange,
      tabIndex
    }

    const emailPath = ['contact_prefs', 'email'];
    const snailmailPath = ['contact_prefs', 'snailmail'];

    return <form>
      <Row>
        <Col xs={12} sm={6}>
          <TextInput
            { ...inputProps }
            inputRef={ focusRef => this.focusRef = focusRef }
            path='legal_name'
            required={true}
          />
          <div style={hintStyle}>{this.msg('legal_name_hint')}</div>
        </Col>
        <Col xs={12} sm={6}>
          { newMember ? [
              <TextInput { ...inputProps }
                key="input"
                path='email'
                type='email'
                required={true}
              />,
              <div key="hint" style={hintStyle}>{this.msg('new_email_hint')}</div>
          ] : [
              <TextInput { ...inputProps } key="input" path='email' disabled={true} />,
              <div key="hint" style={hintStyle}>
                To change the email address associated with this membership, please
                get in touch with us at <a href="mailto:info@chicagoworldconbid.org">
                info@chicagoworldconbid.org</a>
              </div>
          ] }
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={6}>
          <TextInput { ...inputProps } path='public_first_name' />
        </Col>
        <Col xs={12} sm={6}>
          <TextInput { ...inputProps } path='public_last_name' />
        </Col>
        <Col xs={12} style={hintStyle}>{this.msg('public_name_hint')}</Col>
      </Row>
      <Row>
        <Col xs={12} sm={6}>
          <Checkbox
            label={this.msg(["contact_prefs", "send_email"])}
            checked={member.getIn(emailPath, true)}
            onCheck={(ev, checked) => this.onChange(emailPath, checked) }
            />
        </Col>
        <Col xs={12} sm={6}>
          <Checkbox
            label={this.msg(["contact_prefs", "send_snailmail"])}
            checked={member.getIn(snailmailPath, false)}
            onCheck={(ev, checked) => this.onChange(snailmailPath, checked) }
            />
        </Col>
      </Row>
      <Row>
        <Col xs={12} style={hintStyle}>{this.msg('address_hint')}</Col>
      </Row>
      <Row>
        <Col xs={12}>
          <TextInput { ...inputProps } path='address' required={true} />
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={6}>
          <TextInput { ...inputProps } path='city' required={true} />
        </Col>
        <Col xs={12} sm={6}>
          <TextInput { ...inputProps } path='state' required={true} />
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={6}>
          <TextInput { ...inputProps } path='postcode' />
        </Col>
        <Col xs={12} sm={6}>
          <TextInput { ...inputProps } path='country' required={true} />
        </Col>
      </Row>
      {!newMember ? (
        <AddPaperPubs
          prices={prices}
          {...inputProps}
        />
      ) : this.hasPaperPubs ? (
        <EditPaperPubs
          prices={prices}
          {...inputProps}
        />
      ) : null}
    </form>
  }

  componentDidMount() {
    this.focusRef && this.focusRef.focus()
  }
}
