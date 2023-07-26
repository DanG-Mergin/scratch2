import { observable, action } from 'mobx';
import { DataObject, Cake, UpdateDisabled, PlayCircleOutline, CalendarMonth, AccessibleForward, Healing, Start, EventBusy, SentimentSatisfiedAlt, Person2, Groups2, AccountCircle, Work, LocationOn, BedroomChild, Store, Apartment, AccountBalance, Signpost, EmojiTransportation, Map, FlagCircleOutlined, MarkunreadMailboxOutlined, PermContactCalendarOutlined, PhoneForwardedOutlined, AlternateEmailOutlined, LanguageOutlined, ComputerOutlined, Badge, Payments, FolderSharedOutlined, RequestQuoteOutlined, CreditCardOutlined, CardTravelOutlined, DriveEtaOutlined, PermDeviceInformationOutlined, FingerprintOutlined, RememberMeOutlined } from '@mui/icons-material';

// TODO: this is a temporary solution to get icons working
// we need a proper icon loading solution which can inject icons 
// without having to import them all here
class IconStore {
  @observable iconMap: Record<string, any> = {
    "DataObject": <DataObject />,
    "Cake": <Cake />,
    "UpdateDisabled": <UpdateDisabled />,
    "PlayCircleOutline": <PlayCircleOutline />,
    "CalendarMonth": <CalendarMonth />,
    "AccessibleForward": <AccessibleForward />,
    "Healing": <Healing />,
    "Start": <Start />,
    "EventBusy": <EventBusy />,
    "SentimentSatisfiedAlt": <SentimentSatisfiedAlt />,
    "Person2": <Person2 />,
    "Groups2": <Groups2 />,
    "AccountCircle": <AccountCircle />,
    "Work": <Work />,
    "LocationOn": <LocationOn />,
    "BedroomChild": <BedroomChild />,
    "Store": <Store />,
    "Apartment": <Apartment />,
    "AccountBalance": <AccountBalance />,
    "Signpost": <Signpost />,
    "EmojiTransportation": <EmojiTransportation />,
    "Map": <Map />,
    "FlagCircleOutlined": <FlagCircleOutlined />,
    "MarkunreadMailboxOutlined": <MarkunreadMailboxOutlined />,
    "PermContactCalendarOutlined": <PermContactCalendarOutlined />,
    "PhoneForwardedOutlined": <PhoneForwardedOutlined />,
    "AlternateEmailOutlined": <AlternateEmailOutlined />,
    "LanguageOutlined": <LanguageOutlined />,
    "ComputerOutlined": <ComputerOutlined />,
    "Badge": <Badge />,
    "Payments": <Payments />,
    "FolderSharedOutlined": <FolderSharedOutlined />,
    "RequestQuoteOutlined": <RequestQuoteOutlined />,
    "CreditCardOutlined": <CreditCardOutlined />,
    "CardTravelOutlined": <CardTravelOutlined />,
    "DriveEtaOutlined": <DriveEtaOutlined />,
    "PermDeviceInformationOutlined": <PermDeviceInformationOutlined />,
    "FingerprintOutlined": <FingerprintOutlined />,
    "RememberMeOutlined": <RememberMeOutlined />,
  };

  // the bundler doesn't like this dynamic solution.  I think using css is probably the best solution
  constructor() {
    // create a mapping of icon names to icon components
    // for (const iconName in iconMap) {
    //   if (iconMap.hasOwnProperty(iconName)) {
    //     const IconComponent = require(`@mui/icons-material/${iconMap[iconName]}`).default;
    //     this.iconMap[iconName] = IconComponent;
    //   }
    // }
  }

  @action getIcon(iconName: string) {
    return this.iconMap[iconName] || null;
  }
}

const iconStore = new IconStore();

export default iconStore;
