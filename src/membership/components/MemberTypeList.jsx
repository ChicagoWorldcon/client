import React, { PropTypes } from 'react'
const ImmutablePropTypes = require('react-immutable-proptypes');
import Divider from 'material-ui/Divider';
import { List, ListItem, makeSelectable } from 'material-ui/List'
import EventSeat from 'material-ui/svg-icons/action/event-seat'
import ThumbUp from 'material-ui/svg-icons/action/thumb-up'
import DirectionsRun from 'material-ui/svg-icons/maps/directions-run'
import DirectionsWalk from 'material-ui/svg-icons/maps/directions-walk'
import BidStarIcon from 'material-ui/svg-icons/toggle/star'
import BidFriendIcon from 'material-ui/svg-icons/action/favorite';
import BidSupporterIcon from 'material-ui/svg-icons/image/tag-faces'
import FirstWorldcon from 'material-ui/svg-icons/maps/local-activity'
import ChildFriendly from 'material-ui/svg-icons/places/child-friendly'
import SmilingFace from 'material-ui/svg-icons/social/mood'

const SelectableList = makeSelectable(List);

const memberTypeData = {
  BidSupporter: {
    primary: 'Donor',
    secondary: 'Thank you for supporting the bid!',
    icon: <BidSupporterIcon/>
  },
  BidFriend: {
    primary: 'Friend',
    secondary: 'Converts to attending with 2020 site selection vote',
    icon: <BidFriendIcon/>
  },
  BidStar: {
    primary: 'Star',
    secondary: 'Converts to attending with 2020 site selection vote, +bonus TBA',
    icon: <BidStarIcon/>
  },
  Adult: {
    primary: 'Adult membership',
    daypass: 'Adult day pass (from $25/day)',
    secondary: 'Born on or before 15 August 1993',
    icon: <DirectionsWalk/>
  },
  FirstWorldcon: {
    primary: 'First Worldcon membership',
    secondary: 'Have never been a Worldcon member',
    icon: <FirstWorldcon/>
  },
  YoungAdult: {
    primary: 'Young Adult membership',
    daypass: 'Young Adult day pass (from $15/day)',
    secondary: 'Born between 16 Aug 1993 and 15 Aug 2006 inclusive',
    icon: <DirectionsRun/>
  },
  Child: {
    primary: 'Child membership',
    daypass: 'Child day pass (from $10/day)',
    secondary: 'Born between 16 Aug 2006 and 15 Aug 2013 inclusive',
    icon: <SmilingFace/>
  },
  Infant: {
    primary: 'Infant membership',
    secondary: 'Born on or after 16 August 2013',
    icon: <ChildFriendly/>
  },
  Supporter: {
    primary: 'Supporting membership',
    icon: <EventSeat/>
  },
  UpgradeBid: {
    primary: 'Upgrade bid support level',
    icon: <ThumbUp/>
  },
  Upgrade: {
    primary: 'Upgrade membership',
    secondary: 'and/or add paper progress reports',
    icon: <ThumbUp/>
  }
};

export default class MemberTypeList extends React.Component {
  static propTypes = {
    canAddPaperPubs: PropTypes.bool,
    disabled: PropTypes.bool,
    memberTypes: PropTypes.arrayOf(PropTypes.string),
    onSelectType: PropTypes.func.isRequired,
    prevType: PropTypes.string,
    prices: ImmutablePropTypes.map,
    selectedType: PropTypes.string,
    style: PropTypes.object
  }

  getAmount(type) {
    const { prevType, prices } = this.props;
    if (!prices) return -1;
    const prevAmount = prices.getIn(['memberships', prevType, 'amount']) || 0;
    const thisAmount = prices.getIn(['memberships', type, 'amount']) || 0;
    return thisAmount - prevAmount;
  }

  listItemProps(type) {
    const { canAddPaperPubs, category, disabled, memberTypes, prevType } = this.props;
    const { primary, daypass, secondary, icon } = memberTypeData[type];
    const amount = this.getAmount(type);
    const isDisabled = disabled || prevType && amount < 0;
    const primaryText = category === 'daypass' ? daypass
        : amount < 0 ? primary
        : amount > 0 ? `${primary} ($${amount / 100})`
        : !prevType ? `${primary} (free)`
        : canAddPaperPubs ? 'No upgrade' : 'No upgrade available'
    const secondaryText = !prevType || amount ? secondary
        : canAddPaperPubs ? 'Just add paper progress reports' : 'Already has paper progress reports';
    return {
      disabled: isDisabled,
      innerDivStyle: { paddingLeft: 60 },
      leftIcon: icon,
      primaryText,
      secondaryText,
      style: isDisabled ? { opacity: 0.3 } : null,
      value: type
    }
  }

  render() {
    const { memberTypes, onSelectType, prevType, selectedType, style } = this.props;
    return (
      <SelectableList
        onChange={(ev, type) => onSelectType(type)}
        style={style}
        value={selectedType}
      >
        {memberTypes.map((type, i) => (
          type === '_divider' ? (
            <Divider key={'div'+i} style={{ marginTop: 8, marginBottom: 8, marginLeft: 60 }} />
          ) : (
            <ListItem key={type} {...this.listItemProps(type)} />
          )
        ))}
      </SelectableList>
    );
  }
}

export { memberTypeData, MemberTypeList };
