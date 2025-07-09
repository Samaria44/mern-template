import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import FeedIcon from '@mui/icons-material/Feed';

export const navItems = [
    { title: 'Home', icon: HomeIcon, url: "/", entity: 'home' },
    { title: 'Users', icon: PeopleAltIcon, url: "/users", entity: 'user' },
    { title: 'Projects', icon: AccountTreeIcon, url: "/projects", entity: 'project' },
    // { title: 'Entities', icon: FeedIcon, url: "/entities", entity: 'entity' },
    { title: 'Departments', icon: HolidayVillageIcon, url: "/departments", entity: 'department' },
    // { title: 'Actions', icon: ReceiptLongIcon, url: "/actions", entity: 'action' },
    { title: 'Permissions', icon: ManageAccountsIcon, url: "/permissions", entity: 'permission' },
    { title: 'Settings', icon: SettingsIcon, url: "/settings", entity: 'setting' }
];
