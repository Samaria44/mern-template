// import React from 'react';
// import { useLocation, Link as RouterLink } from 'react-router-dom';
// import {Typography, Breadcrumbs, Link} from '@mui/material';
// import NavigateNextIcon from '@mui/icons-material/NavigateNext';

// const DynamicBreadcrumbs = () => {
//     const location = useLocation();
//     const pathnames = location.pathname.split('/').filter(x => x);
//     // console.log("pathnames", location.pathname);

//     return (
//         <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />}>
//             <Link component={RouterLink} underline="hover" color="inherit" to="/">
//                 Home
//             </Link>
//             {pathnames.map((value, index) => {
//                 const to = `/${pathnames.slice(0, index + 1).join('/')}`;
//                 const breadcrumbName = pathnames.slice(0, index + 1);

//                 return index === pathnames.length - 1 ? (
//                     <Typography color="text.primary" key={to}>
//                         {breadcrumbName}
//                     </Typography>
//                 ) : (
//                     <Link component={RouterLink} underline="hover" color="inherit" to={to} key={to}>
//                         {breadcrumbName}
//                     </Link>
//                 );
//             })}
//         </Breadcrumbs>
//     );
// };

// export default DynamicBreadcrumbs;

import React from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Typography, Breadcrumbs, Link } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const DynamicBreadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(x => x);
    // console.log("pathnames", location.pathname);
    const capitalizeWords = (str) => {
        return str.replaceAll("-", " ").replace(/\b\w/g, char => char.toUpperCase());
    }
    return (
        <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />}>
            <Link component={RouterLink} underline="hover" color="inherit" to="/">
                Home
            </Link>
            {pathnames.map((value, index) => {
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;

                return index === pathnames.length - 1 ? (
                    <Typography color="text.primary" key={to}>
                        {capitalizeWords(value)}
                    </Typography>
                ) : (
                    <Link component={RouterLink} underline="hover" color="inherit" to={to} key={to}>
                        {capitalizeWords(value)}
                    </Link>
                );
            })}
        </Breadcrumbs>
    );
};

export default DynamicBreadcrumbs;
